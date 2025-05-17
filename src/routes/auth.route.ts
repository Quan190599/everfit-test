import { Router } from 'express';
import { register, login, logout } from '../controllers';
import { validateRequest } from '../middleware';
import { CreateUserDto, LoginDto } from '../dto';

const router = Router();

router.post('/register', validateRequest({ body: CreateUserDto }), register);
router.post('/login', validateRequest({ body: LoginDto }), login);
router.post('/logout', logout);

export default router;
