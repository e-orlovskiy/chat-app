import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getChatById } from '../../features/chat/chatSlice'
import { useSocketChat } from '../../hooks/useSocketChats'
import ChatHeader from '../ChatHeader/ChatHeader'
import ChatInput from '../ChatInput/ChatInput'
import MessageBlock from '../MessageBlock/MessageBlock'
import styles from './Chat.module.css'

function Chat() {
	const { chatId } = useParams()
	const { joinChat, leaveChat } = useSocketChat()
	const [interlocutor, setInterlocutor] = useState(null)

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const { currentUser, currentChat, chatStatus } = useSelector(state => ({
		currentUser: state.auth.user,
		currentChat: state.chat.currentChat,
		chatStatus: state.chat.status
	}))

	useEffect(() => {
		if (!chatId) {
			navigate('/')
			return
		}

		const loadChat = async () => {
			try {
				const result = await dispatch(
					getChatById({ userId: currentUser._id, chatId })
				).unwrap()

				if (result?.data) {
					setInterlocutor(result.data.interlocutor)
					joinChat(chatId)
				}
			} catch (err) {
				console.error('Failed to load chat:', err)
				navigate('/404', { replace: true })
			}
		}

		loadChat()

		return () => {
			leaveChat(chatId)
		}
	}, [chatId, currentUser._id, dispatch, navigate, joinChat, leaveChat])

	if (chatStatus === 'loading') {
		return <div className={styles.loadingContainer}>Loading chat...</div>
	}

	return (
		<div className={cn(styles['chat-container'])}>
			{!currentChat ? (
				<h2 className={styles['chat-container__title']}>
					start a conversation <br /> :)
				</h2>
			) : (
				<>
					<ChatHeader interlocutor={interlocutor} />
					<div className={cn(styles['chat-window'])}>
						<div className={styles['chat-window__main']}>
							<MessageBlock />
						</div>
						<ChatInput />
					</div>
				</>
			)}
		</div>
	)
}

export default Chat
