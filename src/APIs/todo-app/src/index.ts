import { Request, Response, NextFunction } from 'express'
import { ITodoAuthRequest, ICreateTodoBody, IUpdateTodoBody } from './types'
import httpResponse from '../../../handlers/httpResponse'
import httpError from '../../../handlers/errorHandler/httpError'
import { CustomError } from '../../../utils/errors'
import asyncHandler from '../../../handlers/async'
import Todo from './models/todo.model'

export default {
    getAll: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as ITodoAuthRequest
            const todos = await Todo.find({ user: req.authenticatedUser._id })
            httpResponse(response, request, 200, 'Todos fetched', todos)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    }),

    create: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as ITodoAuthRequest
            const { title } = req.body as ICreateTodoBody
            const todo = await Todo.create({ user: req.authenticatedUser._id, title })
            httpResponse(response, request, 201, 'Todo created', todo)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    }),

    update: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as ITodoAuthRequest
            const body = req.body as IUpdateTodoBody

            const todo = await Todo.findOneAndUpdate(
                { _id: req.params.id, user: req.authenticatedUser._id },
                body,
                { new: true }
            )

            if (!todo) {
                throw new CustomError('Todo not found', 404)
            }

            httpResponse(response, request, 200, 'Todo updated', todo)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    }),

    remove: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as ITodoAuthRequest

            const todo = await Todo.findOneAndDelete({
                _id: req.params.id,
                user: req.authenticatedUser._id
            })

            if (!todo) {
                throw new CustomError('Todo not found', 404)
            }

            httpResponse(response, request, 200, 'Todo deleted', null)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    })
}