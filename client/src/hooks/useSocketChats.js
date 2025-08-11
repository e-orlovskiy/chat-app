import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useSocket } from '../context/socket/useSocket'

export const useSocketChat = () => {
	const socket = useSocket()
	const currentUser = useSelector(state => state.auth.user)

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

	useEffect(() => {
		return () => {
			if (currentRoomRef.current && socket && currentUser) {
				socket.emit('leaveRoom', {
					chatId: currentRoomRef.current,
					userId: currentUser._id,
					username: currentUser.username
				})
			}
		}
	}, [socket, currentUser])

	return { joinChat, leaveChat }
}
