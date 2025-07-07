import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useSocket } from '../../context/useSocket'
import {
	addMessage,
	fetchMessages,
	setCurrentChat
} from '../../features/chat/chatSlice'

const ChatPage = () => {
	const { chatId } = useParams()
	const dispatch = useDispatch()
	const socket = useSocket()
	const { messages } = useSelector(state => state.chat)
	const { user } = useSelector(state => state.auth)

	const [input, setInput] = useState('')
	const [log, setLog] = useState([])

	useEffect(() => {
		if (!chatId) return
		dispatch(fetchMessages(chatId))
		dispatch(setCurrentChat(chatId))
	}, [chatId, dispatch])

	useEffect(() => {
		if (!socket || !chatId || !user) return

		socket.emit('joinRoom', {
			chatId,
			userId: user._id,
			username: user.username
		})

		return () => {
			socket.emit('leaveRoom', {
				chatId,
				userId: user._id,
				username: user.username
			})
		}
	}, [socket, chatId, user])

	useEffect(() => {
		if (!socket) return

		const handleNewMessage = msg => {
			if (msg.chat === chatId) {
				dispatch(addMessage(msg))
			}
		}

		const handleUserJoined = ({ username }) => {
			setLog(prev => [...prev, `${username} вошёл в чат`])
		}

		const handleUserLeft = ({ username }) => {
			setLog(prev => [...prev, `${username} вышел из чата`])
		}

		socket.on('newMessage', handleNewMessage)
		socket.on('userJoined', handleUserJoined)
		socket.on('userLeft', handleUserLeft)

		return () => {
			socket.off('newMessage', handleNewMessage)
			socket.off('userJoined', handleUserJoined)
			socket.off('userLeft', handleUserLeft)
		}
	}, [socket, chatId, dispatch])

	// Отправка сообщения
	const sendMessage = () => {
		if (!socket || !input.trim()) return

		socket.emit('sendMessage', {
			text: input,
			authorId: user._id,
			chatId
		})
		setInput('')
	}

	return (
		<div>
			<h2>Чат</h2>

			<div
				style={{
					maxHeight: 300,
					overflowY: 'auto',
					border: '1px solid #ccc',
					padding: 8,
					marginBottom: 10
				}}
			>
				{log.map((entry, idx) => (
					<div key={idx} style={{ color: 'gray', fontStyle: 'italic' }}>
						{entry}
					</div>
				))}

				{messages.map(msg => (
					<div key={msg._id}>
						<b>{msg.author?.username || msg.author}:</b> {msg.text}
					</div>
				))}
			</div>

			<input
				value={input}
				onChange={e => setInput(e.target.value)}
				onKeyDown={e => e.key === 'Enter' && sendMessage()}
			/>
			<button onClick={sendMessage}>Отправить</button>
		</div>
	)
}

export default ChatPage
