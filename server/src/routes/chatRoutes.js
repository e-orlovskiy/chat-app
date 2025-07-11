import express from 'express'
import {
	createChat,
	getChatById,
	getChatMessages,
	getMyChats,
	joinPrivateChat,
	joinPublicChat
} from '../controllers/chatController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.post('/', createChat)
router.get('/', getMyChats)
router.get('/:id', getChatById)
router.post('/:id/join-public', joinPublicChat)
router.post('/:id/join-private', joinPrivateChat)
router.get('/:id/messages', getChatMessages)

export default router
