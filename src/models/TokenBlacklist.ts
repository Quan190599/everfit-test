import mongoose, { Document, Schema } from 'mongoose';

export interface ITokenBlacklist extends Document {
  token: string;
  createdAt: Date;
}

const tokenBlacklistSchema = new Schema<ITokenBlacklist>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    expires: 24 * 60 * 60,
  }
);

export const TokenBlacklist = mongoose.models.TokenBlacklist || 
  mongoose.model<ITokenBlacklist>('TokenBlacklist', tokenBlacklistSchema); 