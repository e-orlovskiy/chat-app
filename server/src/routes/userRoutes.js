import express from 'express'
import { searchUsers, uploadUserAvatar } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/avatar', authMiddleware, uploadUserAvatar)
router.get('/search', authMiddleware, searchUsers)

export default router
