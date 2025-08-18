import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../context/socket/useSocket'
import { addMessage } from '../features/chat/chatSlice'

export const useSocketChat = () => {
	const socket = useSocket()
	const currentUser = useSelector(state => state.auth.user)
	const dispatch = useDispatch()

	const currentRoomRef = useRef(null)

	// Подключение к чату
	const joinChat = useCallback(
		chatId => {
			if (
				!socket ||
				!chatId ||
				!currentUser ||
				currentRoomRef.current === chatId
			)
				return

			if (currentRoomRef.current) {
				socket.emit('leaveRoom', {
					chatId: currentRoomRef.current,
					userId: currentUser._id,
					username: currentUser.username
				})
			}

			socket.emit('joinRoom', {
				chatId,
				userId: currentUser._id,
				username: currentUser.username
			})

			currentRoomRef.current = chatId
		},
		[socket, currentUser]
	)

	// Выход из чата
	const leaveChat = useCallback(
		chatId => {
			if (
				!socket ||
				!chatId ||
				!currentUser ||
				currentRoomRef.current !== chatId
			)
				return

			socket.emit('leaveRoom', {
				chatId,
				userId: currentUser._id,
				username: currentUser.username
			})

			currentRoomRef.current = null
		},
		[socket, currentUser]
	)

	const sendMessage = useCallback(
		messageText => {
			if (!socket || !currentUser || !currentRoomRef.current || !messageText)
				return

			socket.emit('sendMessage', {
				chatId: currentRoomRef.current,
				text: messageText,
				authorId: currentUser._id
			})
		},
		[socket, currentUser]
	)

	useEffect(() => {
		if (!socket) return

		const handleNewMessage = message => {
			console.log('New message:', message)
			dispatch(addMessage(message))
		}

		socket.on('newMessage', handleNewMessage)

		return () => {
			socket.off('newMessage', handleNewMessage)
			if (currentRoomRef.current && socket && currentUser) {
				socket.emit('leaveRoom', {
					chatId: currentRoomRef.current,
					userId: currentUser._id,
					username: currentUser.username
				})
			}
		}
	}, [socket, currentUser, dispatch])

	return { joinChat, leaveChat, sendMessage }
}
