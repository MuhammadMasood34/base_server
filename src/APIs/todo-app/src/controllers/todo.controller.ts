import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import Todo from '../models/todo.model'

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body as { title: string }
    const todo = await Todo.create({ user: req.userId, title })
    res.status(201).json(todo)
  } catch (err: unknown) {
    // unknown is correct here — catch clause variables are always unknown
    const message = err instanceof Error ? err.message : 'Server error'
    res.status(500).json({ message })
  }
}

export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todos = await Todo.find({ user: req.userId })
    res.json(todos)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    res.status(500).json({ message })
  }
}

export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = req.body as { title?: string; completed?: boolean }
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      body,
      { new: true }
    )
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' })
      return
    }
    res.json(todo)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    res.status(500).json({ message })
  }
}

export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId })
    if (!deleted) {
      res.status(404).json({ message: 'Todo not found' })
      return
    }
    res.json({ message: 'Deleted successfully' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    res.status(500).json({ message })
  }
}