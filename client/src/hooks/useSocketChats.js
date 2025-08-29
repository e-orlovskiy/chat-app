import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../context/socket/useSocket'
import { addMessage } from '../features/chat/chatSlice'

export const useSocketChat = () => {
	const socket = useSocket()
	const currentUser = useSelector(state => state.auth.user)
	const dispatch = useDispatch()
	const currentRoomRef = useRef(null)

	const handleNewMessage = useCallback(
		message => {
			console.log('[socket] newMessage received:', message)
			dispatch(addMessage(message))
		},
		[dispatch]
	)

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

	useEffect(() => {
		if (!socket) return

		const handleReconnect = () => {
			console.log('[socket] reconnected')
			if (currentRoomRef.current && currentUser) {
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

	const joinChat = useCallback(
		chatId => {
			if (!chatId || !currentUser) return

			if (currentRoomRef.current && currentRoomRef.current !== chatId) {
				leaveChat(currentRoomRef.current)
			}

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

	useEffect(() => {
		return () => {
			if (currentRoomRef.current) {
				leaveChat(currentRoomRef.current)
			}
		}
	}, [leaveChat])

	return { joinChat, leaveChat, sendMessage }
}
