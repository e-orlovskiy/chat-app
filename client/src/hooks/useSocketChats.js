import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../context/socket/useSocket'
import { addMessage } from '../features/chat/chatSlice'

export const useSocketChat = () => {
	const socket = useSocket()
	const currentUser = useSelector(state => state.auth.user)
	const dispatch = useDispatch()
	const currentRoomRef = useRef(null)

	// Обработчик новых сообщений
	const handleNewMessage = useCallback(
		message => {
			console.log('[socket] newMessage received:', message)
			dispatch(addMessage(message))
		},
		[dispatch]
	)

	// Подписка на события сокета
	useEffect(() => {
		if (!socket) return

		socket.on('newMessage', handleNewMessage)
		socket.on('connect_error', error => {
			console.error('Socket connection error:', error)
		})

		return () => {
			socket.off('newMessage', handleNewMessage)
			socket.off('connect_error')
		}
	}, [socket, handleNewMessage])

	// Выход из чата (вынесен отдельно чтобы избежать циклических зависимостей)
	const leaveChat = useCallback(
		chatId => {
			if (!chatId || !currentUser || !socket) return

			console.log('[socket] leaving room:', chatId)
			socket.emit('leaveRoom', {
				chatId,
				userId: currentUser._id,
				username: currentUser.username
			})

			if (currentRoomRef.current === chatId) {
				currentRoomRef.current = null
			}
		},
		[socket, currentUser]
	)

	// Переподключение при восстановлении соединения
	useEffect(() => {
		if (!socket) return

		const handleReconnect = () => {
			console.log('[socket] reconnected')
			if (currentRoomRef.current && currentUser) {
				// Присоединяемся к текущему чату при переподключении
				console.log('[socket] re-joining room:', currentRoomRef.current)
				socket.emit('joinRoom', {
					chatId: currentRoomRef.current,
					userId: currentUser._id,
					username: currentUser.username
				})
			}
		}

		socket.on('connect', handleReconnect)
		return () => {
			socket.off('connect', handleReconnect)
		}
	}, [socket, currentUser])

	// Присоединение к чату
	const joinChat = useCallback(
		chatId => {
			if (!chatId || !currentUser) return

			// Выходим из предыдущего чата если он отличается
			if (currentRoomRef.current && currentRoomRef.current !== chatId) {
				leaveChat(currentRoomRef.current)
			}

			// Присоединяемся к новому чату
			if (socket) {
				console.log('[socket] joining room:', chatId)
				socket.emit('joinRoom', {
					chatId,
					userId: currentUser._id,
					username: currentUser.username
				})
				currentRoomRef.current = chatId
			} else {
				console.warn('[socket] Socket not available for join')
			}
		},
		[socket, currentUser, leaveChat]
	)

	// Отправка сообщения
	const sendMessage = useCallback(
		messageText => {
			if (!messageText?.trim() || !currentUser || !socket) return

			const currentChatId = currentRoomRef.current
			if (!currentChatId) {
				console.warn('[socket] Cannot send message: not in any room')
				return
			}

			console.log('[socket] sending message to:', currentChatId)
			socket.emit('sendMessage', {
				chatId: currentChatId,
				text: messageText.trim(),
				authorId: currentUser._id
			})
		},
		[socket, currentUser]
	)

	// Автоматический выход при размонтировании
	useEffect(() => {
		return () => {
			if (currentRoomRef.current) {
				leaveChat(currentRoomRef.current)
			}
		}
	}, [leaveChat])

	return { joinChat, leaveChat, sendMessage }
}
