import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, TokenBlacklist } from '../models';
import { AppError } from '../middleware';
import { ResponseMapper } from '../utils/response-mapper';
import { UserRole } from '../models/User';
import { UserResponseDto } from '../dto';

const responseMapper = ResponseMapper.getInstance();

const signToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : '90d',
  };
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', options);
};

interface AuthResponse {
  token: string;
  user: UserResponseDto;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole: UserRole = role === 'admin' ? UserRole.ADMIN : UserRole.USER;

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: userRole,
    });

    const token = signToken(user._id.toString());

    const response: AuthResponse = {
      token,
      user: responseMapper.mapUser(user),
    };

    return responseMapper.created(res, response);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);

    const response: AuthResponse = {
      token,
      user: responseMapper.mapUser(user),
    };

    return responseMapper.success(res, response);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const existingBlacklist = await TokenBlacklist.findOne({ token });
    if (existingBlacklist) {
      return responseMapper.success(res, {
        message: 'Token already invalidated'
      });
    }

    await TokenBlacklist.create({ token });

    if (req.user?._id) {
      await removeOldTokens(req.user._id.toString());
    }

    return responseMapper.success(res, {
      message: 'Successfully logged out',
      loggedOutAt: new Date().toISOString()
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(new AppError(`Logout failed: ${error.message}`, 500));
    }
    next(new AppError('An unexpected error occurred during logout', 500));
  }
};

const removeOldTokens = async (userId: string) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await TokenBlacklist.deleteMany({
      createdAt: { $lt: oneDayAgo }
    });
  } catch (error) {
    console.error('Error removing old tokens:', error);
  }
};