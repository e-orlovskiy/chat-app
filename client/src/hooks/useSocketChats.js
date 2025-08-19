import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../context/socket/useSocket'
import { addMessage } from '../features/chat/chatSlice'

export const useSocketChat = () => {
	const socket = useSocket()
	const currentUser = useSelector(state => state.auth.user)
	const dispatch = useDispatch()

	const currentRoomRef = useRef(null)
	const pendingRoomRef = useRef(null)
	const listenersRegisteredRef = useRef(false)
	const handleNewMessageRef = useRef(null)

	const ensureListeners = useCallback(() => {
		if (!socket) return
		if (listenersRegisteredRef.current) return
		listenersRegisteredRef.current = true

		handleNewMessageRef.current = message => {
			console.log('[socket] recv newMessage', message)
			dispatch(addMessage(message))
		}

		socket.off('newMessage', handleNewMessageRef.current)
		socket.on('newMessage', handleNewMessageRef.current)
	}, [socket, dispatch])

	useEffect(() => {
		if (!socket) return

		const handleNewMessage = message => {
			console.log('[socket] recv newMessage', message)
			dispatch(addMessage(message))
		}

		socket.on('newMessage', handleNewMessage)

		socket.on('connect_error', error => {
			console.error('Socket connection error:', error)
		})

		return () => {
			socket.off('newMessage', handleNewMessage)
		}
	}, [socket, dispatch])

	useEffect(() => {
		if (!socket) return
		ensureListeners()

		if (pendingRoomRef.current && currentUser) {
			const toJoin = pendingRoomRef.current
			console.log('[socket] pending join emit joinRoom', toJoin)
			socket.emit('joinRoom', {
				chatId: toJoin,
				userId: currentUser._id,
				username: currentUser.username
			})
			currentRoomRef.current = toJoin
			pendingRoomRef.current = null
		}
	}, [socket, currentUser, ensureListeners])

	useEffect(() => {
		if (!socket) return

		const onConnect = () => {
			console.log('[socket] connect')
			ensureListeners()
			if (currentRoomRef.current && currentUser) {
				console.log('[socket] re-joinRoom', currentRoomRef.current)
				socket.emit('joinRoom', {
					chatId: currentRoomRef.current,
					userId: currentUser._id,
					username: currentUser.username
				})
			} else if (pendingRoomRef.current && currentUser) {
				console.log('[socket] pending re-joinRoom', pendingRoomRef.current)
				socket.emit('joinRoom', {
					chatId: pendingRoomRef.current,
					userId: currentUser._id,
					username: currentUser.username
				})
				currentRoomRef.current = pendingRoomRef.current
				pendingRoomRef.current = null
			}
		}

		socket.on('connect', onConnect)
		return () => {
			socket.off('connect', onConnect)
		}
	}, [socket, currentUser, ensureListeners])

	const joinChat = useCallback(
		chatId => {
			if (!chatId || !currentUser) return
			if (socket) ensureListeners()

			if (currentRoomRef.current === chatId) return

			if (!socket) {
				pendingRoomRef.current = chatId
				console.log('[socket] join pending', chatId)
				return
			}

			if (currentRoomRef.current) {
				console.log('[socket] emit leaveRoom', currentRoomRef.current)
				socket.emit('leaveRoom', {
					chatId: currentRoomRef.current,
					userId: currentUser._id,
					username: currentUser.username
				})
			}

			console.log('[socket] emit joinRoom', chatId)
			socket.emit('joinRoom', {
				chatId,
				userId: currentUser._id,
				username: currentUser.username
			})
			currentRoomRef.current = chatId
			pendingRoomRef.current = null
		},
		[socket, currentUser, ensureListeners]
	)

	const leaveChat = useCallback(
		chatId => {
			if (!chatId || !currentUser) {
				if (pendingRoomRef.current === chatId) pendingRoomRef.current = null
				if (currentRoomRef.current === chatId) currentRoomRef.current = null
				return
			}

			if (!socket) {
				if (pendingRoomRef.current === chatId) pendingRoomRef.current = null
				if (currentRoomRef.current === chatId) currentRoomRef.current = null
				return
			}

			if (currentRoomRef.current !== chatId) {
				if (pendingRoomRef.current === chatId) pendingRoomRef.current = null
				return
			}

			console.log('[socket] emit leaveRoom', chatId)
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
			if (!messageText || !currentUser) return

			if (socket && currentRoomRef.current) {
				console.log('[socket] emit sendMessage', {
					chatId: currentRoomRef.current,
					text: messageText
				})
				socket.emit('sendMessage', {
					chatId: currentRoomRef.current,
					text: messageText,
					authorId: currentUser._id
				})
				return
			}

			console.warn(
				'[socket] sendMessage fallback — socket not ready or not joined'
			)
		},
		[socket, currentUser]
	)

	useEffect(() => {
		return () => {
			if (!socket) return
			if (handleNewMessageRef.current)
				socket.off('newMessage', handleNewMessageRef.current)
		}
	}, [])

	return { joinChat, leaveChat, sendMessage }
}
