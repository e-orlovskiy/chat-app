import { socketAuthMiddleware } from './authMiddleware.js'
import { messageHandlers } from './messageHandlers.js'
import { roomHandlers } from './roomHandlers.js'

export const initializeSocket = io => {
	io.use(socketAuthMiddleware)

	io.on('connection', socket => {
		console.log('new user connected', socket.id)

		roomHandlers(socket, io)
		messageHandlers(socket, io)

		socket.on('disconnect', () => {
			console.log('User disconnected')
		})
	})
}
