import { Application } from 'express'
import { API_ROOT } from '../constant/application'
import todoRoutes from './todo-app/src/routes/todo.routes'

import General from './router'
import authRoutes from './user/authentication'
import userManagementRoutes from './user/management'

const App = (app: Application) => {
    app.use(`${API_ROOT}`, General)
    app.use(`${API_ROOT}`, authRoutes)
    app.use(`${API_ROOT}/user`, userManagementRoutes)
    app.use(`${API_ROOT}/todos`, todoRoutes)
}

export default App
