import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phoneNumber } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const result = await AuthService.register(email, password, firstName, lastName, phoneNumber);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await AuthService.getUserById(userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const updatedUser = await AuthService.updateUser(userId, req.body);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
