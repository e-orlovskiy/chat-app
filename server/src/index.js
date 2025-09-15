import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import { Server as IOServer } from 'socket.io'
import { errorHandler } from './middlewares/errorMiddleware.js'
import authRouter from './routes/authRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import userRouter from './routes/userRoutes.js'
import { initializeSocket } from './socket/index.js'

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

initializeSocket(io)

server.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
