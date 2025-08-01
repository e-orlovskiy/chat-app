import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../context/socket/useSocket'
import { addMessage, getChatMessages, updateUserStatus } from '../features/chat/chatSlice'

export const useSocketChat = () => {
	const socket = useSocket()
	const dispatch = useDispatch()
	const currentUser = useSelector(state => state.auth.user)
	const currentChat = useSelector(state => state.chat.currentChat)

	useEffect(() => {
		if (!socket) return

		// Получение новых сообщений
		const handleNewMessage = message => {
			dispatch(addMessage(message))
		}

		// Изменение статуса пользователей
		const handleStatusChanged = ({ userId, status }) => {
			dispatch(updateUserStatus({ userId, status }))
		}

		// Пользователь присоединился
		const handleUserJoined = ({ userId, username, chatId }) => {
			console.log(`${username} joined chat ${chatId}`)
		}

		// Пользователь вышел
		const handleUserLeft = ({ userId, username, chatId }) => {
			console.log(`${username} left chat ${chatId}`)
		}

		socket.on('newMessage', handleNewMessage)
		socket.on('statusChanged', handleStatusChanged)
		socket.on('userJoined', handleUserJoined)
		socket.on('userLeft', handleUserLeft)

		if (currentUser) {
			socket.emit('changeStatus', {
				userId: currentUser._id,
				status: 'online'
			})
		}

		return () => {
			socket.off('newMessage', handleNewMessage)
			socket.off('statusChanged', handleStatusChanged)
			socket.off('userJoined', handleUserJoined)
			socket.off('userLeft', handleUserLeft)
		}
	}, [currentUser, dispatch, socket])

	// Присоединение к чату
	const joinChat = useCallback(
		chatId => {
			if (socket && currentUser && chatId) {
				socket.emit('joinRoom', {
					chatId,
					userId: currentUser._id,
					username: currentUser.username
				})

				// Загружаем историю сообщений
				dispatch(getChatMessages({ chatId, page: 1, limit: 50 }))
			}
		},
		[socket, currentUser, dispatch]
	)

	// Выход из чата
	const leaveChat = useCallback(
		chatId => {
			if (socket && currentUser && chatId) {
				socket.emit('leaveRoom', {
					chatId,
					userId: currentUser._id,
					username: currentUser.username
				})
			}
		},
		[socket, currentUser]
	)

	return {
		joinChat,
		leaveChat
	}
}
