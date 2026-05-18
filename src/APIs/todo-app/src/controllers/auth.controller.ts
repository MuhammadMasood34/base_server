import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'

type AuthBody = { email: string; password: string }

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as AuthBody

    const exists = await User.findOne({ email })
    if (exists) {
      res.status(400).json({ message: 'Email already registered' })
      return
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({ email, password: hashed })

    res.status(201).json({
      token: signToken(user._id.toString()),
      user: { id: user._id, email: user.email },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    res.status(500).json({ message })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as AuthBody

    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    res.json({
      token: signToken(user._id.toString()),
      user: { id: user._id, email: user.email },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    res.status(500).json({ message })
  }
}