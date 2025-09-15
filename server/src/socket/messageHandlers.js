import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'

export const messageHandlers = (socket, io) => {
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
}
