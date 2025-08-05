import express from 'express'
import { searchUsers } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/search', authMiddleware, searchUsers)

export default router
