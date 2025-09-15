export const roomHandlers = (socket, io) => {
	socket.on('joinRoom', async ({ chatId, userId, username }) => {
		console.log(`User ${username} has joined the room ${chatId}`)
		socket.to(chatId).emit('userJoined', { chatId, userId, username })
		socket.join(chatId)
	})

	socket.on('leaveRoom', ({ chatId, userId, username }) => {
		socket.leave(chatId)
		console.log(`User ${username} has left the room ${chatId}`)
		socket.to(chatId).emit('userLeft', { userId, username, chatId })
	})
}
