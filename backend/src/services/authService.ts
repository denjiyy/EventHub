import User, { IUser } from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export class AuthService {
  static async register(email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId: string) {
    try {
      const user = await User.findById(userId).populate('bookings');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId: string, updateData: Partial<IUser>) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
