import cookie from 'cookie'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Server as IOServer } from 'socket.io'
import { errorHandler } from './middlewares/errorMiddleware.js'
import Chat from './models/chatModel.js'
import Message from './models/messageModel.js'
import authRouter from './routes/authRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import userRouter from './routes/userRoutes.js'

dotenv.config()

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch(err => {
		console.log(err)
	})

const app = express()

app.use(
	cors({
		origin: [
			process.env.CLIENT_URL,
			'http://localhost:5173',
			'http://localhost:5174',
			'http://192.168.0.99:5173',
			'http://172.19.112.1:5173',
			'http://localhost:5174'
		],
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
	})
)
// app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/chats', chatRouter)

app.use(errorHandler)

const port = process.env.PORT || 3000
const server = http.createServer(app)

const io = new IOServer(server, {
	cors: {
		origin: [
			process.env.CLIENT_URL,
			'http://localhost:5173',
			'http://192.168.0.99:5173',
			'http://172.19.112.1:5173',
			'http://localhost:5174'
		],
		credentials: true,
		methods: ['GET', 'POST']
	}
})

io.use((socket, next) => {
	try {
		const cookies = cookie.parse(socket.handshake.headers.cookie || '')
		const token = cookies.accessToken

		if (!token) {
			return next(new Error('Authentication error: token missing'))
		}

		const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
		socket.user = { id: decoded.id }

		next()
	} catch (err) {
		console.error('Socket auth error:', err.message)
		next(new Error('Authentication error'))
	}
})

io.on('connection', socket => {
	console.log('Новый пользователь подключился', socket.id)

	// socket.on('changeStatus', ({ userId, status }) => {
	// 	console.log(`Cтатус пользователя ${userId} изменился на ${status}`)
	// 	io.emit('statusChanged', { userId, status })
	// })

	socket.on('joinRoom', async ({ chatId, userId, username }) => {
		console.log(`Пользователь ${username} присоединился к комнате ${chatId}`)
		socket.to(chatId).emit('userJoined', { chatId, userId, username })
		socket.join(chatId)
	})

	socket.on('leaveRoom', ({ chatId, userId, username }) => {
		socket.leave(chatId)
		console.log(`Пользователь ${username} вышел из комнаты ${chatId}`)
		socket.to(chatId).emit('userLeft', { userId, username, chatId })
	})

	socket.on('sendMessage', async ({ chatId, authorId, text }) => {
		try {
			if (text.length > 400) {
				socket.emit('message_send_error', {
					type: 'VALIDATION_ERROR',
					message: 'Message too long. Maximum 400 characters allowed',
					code: 'MESSAGE_TOO_LONG',
					maxLength: 400,
					currentLength: text.length
				})
				return
			}

			const message = await Message.create({
				author: authorId,
				chat: chatId,
				text
			})

			await Chat.findByIdAndUpdate(chatId, {
				updatedAt: Date.now(),
				$push: { messages: message._id }
			})

			const fullMessage = await Message.findById(message._id).populate(
				'author',
				'username avatar'
			)

			io.to(chatId).emit('newMessage', fullMessage)
		} catch (err) {
			socket.emit('message_send_error', {
				type: 'INTERNAL_ERROR',
				message: 'Failed to send message',
				code: 'INTERNAL_ERROR',
				detail: err.message
			})
		}
	})

	socket.on('disconnect', () => {
		console.log('User disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
