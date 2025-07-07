import express from 'express'
import { checkAuth, login, register } from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.get('/check-auth', authMiddleware, checkAuth)
router.post('/register', register)
router.post('/login', login)

export default router
