import { Router } from 'express'
import authenticationController from './authentication.controller'
import authenticate from '../../../middlewares/authenticate'

const router = Router()

router.route('/register').post(authenticationController.register)
router.route('/registeration/confi  rm/:token').patch(authenticationController.confirmRegistration)

router.route('/login').post(authenticationController.login)
router.route('/logout').put(authenticate, authenticationController.logout)

import todoRoutes from './APIs/todo-app/src/routes/todo.routes'

// wherever your other routes are mounted:
router.route('/api/v1/todos', todoRoutes)

export default router
