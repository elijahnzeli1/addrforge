// src/routes/auth.ts
import express from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: 'Login failed' });
  }
});

router.get('/me', auth, async (req: any, res) => {
  res.json(req.user);
});

export default router;