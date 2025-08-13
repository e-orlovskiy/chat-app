import express from 'express'
import {
	createGroupChat,
	createOrGetChat,
	getChatById,
	getChatMessages,
	getUserChats,
	joinChat
} from '../controllers/chatController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.get('/', getUserChats)
router.get('/:chatId', getChatById)
router.get('/:id/messages', getChatMessages)
router.post('/create-or-get-chat', createOrGetChat)
router.post('/create-group', createGroupChat)
router.post('/:id/join-chat', joinChat)

export default router
