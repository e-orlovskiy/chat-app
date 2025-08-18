import cn from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
	getChatById,
	getChatMessages,
	resetMessages
} from '../../features/chat/chatSlice'
import { useSocketChat } from '../../hooks/useSocketChats'
import ChatHeader from '../ChatHeader/ChatHeader'
import ChatInput from '../ChatInput/ChatInput'
import MessageBlock from '../MessageBlock/MessageBlock'
import styles from './Chat.module.css'

function Chat() {
	const { chatId } = useParams()
	const { joinChat, leaveChat, sendMessage } = useSocketChat()
	const [messageText, setMessageText] = useState('')
	const [interlocutor, setInterlocutor] = useState(null)
	const [initialLoad, setInitialLoad] = useState(true)

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const messagesEndRef = useRef(null)
	const messagesTopRef = useRef(null)
	const messagesObserver = useRef()
	const scrollContainerRef = useRef(null)
	const lastMessageRef = useRef(null)
	const isPaginationLoading = useRef(false)

	const {
		currentUser,
		currentChat,
		chatStatus,
		chatMessages,
		messagesHasMore,
		messagesLoading,
		messagesPage
	} = useSelector(state => ({
		currentUser: state.auth.user,
		currentChat: state.chat.currentChat,
		chatStatus: state.chat.status,
		chatMessages: state.chat.messages,
		messagesHasMore: state.chat.messagesHasMore,
		messagesLoading: state.chat.messagesLoading,
		messagesPage: state.chat.messagesPage
	}))

	const handleSendMessage = messageText => {
		if (!messageText) return
		sendMessage(messageText)
		setMessageText('')
		lastMessageRef.current = {
			id:
				chatMessages.length > 0
					? chatMessages[chatMessages.length - 1]._id
					: null,
			count: chatMessages.length
		}
	}

	const scrollToBottom = useCallback((behavior = 'smooth') => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior })
		}
	}, [])

	const loadPreviousMessages = useCallback(() => {
		if (!currentChat || !messagesHasMore || messagesLoading || initialLoad)
			return

		isPaginationLoading.current = true
		const container = scrollContainerRef.current
		const oldScrollHeight = container.scrollHeight

		dispatch(
			getChatMessages({
				chatId,
				page: messagesPage + 1,
				limit: 10
			})
		).then(() => {
			requestAnimationFrame(() => {
				container.scrollTop = container.scrollHeight - oldScrollHeight
				isPaginationLoading.current = false
			})
		})
	}, [
		chatId,
		currentChat,
		dispatch,
		messagesHasMore,
		messagesLoading,
		messagesPage,
		initialLoad
	])

	useEffect(() => {
		if (!messagesEndRef.current || chatMessages.length === 0) return

		const isNewMessage =
			!lastMessageRef.current ||
			chatMessages[chatMessages.length - 1]._id !== lastMessageRef.current.id

		if (initialLoad) {
			scrollToBottom('auto')
			setInitialLoad(false)
			lastMessageRef.current = {
				id: chatMessages[chatMessages.length - 1]._id,
				count: chatMessages.length
			}
		} else if (isNewMessage && !isPaginationLoading.current) {
			const isUserNearBottom = () => {
				if (!scrollContainerRef.current) return false
				const { scrollTop, scrollHeight, clientHeight } =
					scrollContainerRef.current
				return scrollHeight - (scrollTop + clientHeight) < 200
			}

			if (
				chatMessages[chatMessages.length - 1].author._id === currentUser._id ||
				isUserNearBottom()
			) {
				scrollToBottom()
			}

			lastMessageRef.current = {
				id: chatMessages[chatMessages.length - 1]._id,
				count: chatMessages.length
			}
		}
	}, [chatMessages, currentUser._id, initialLoad, scrollToBottom])

	useEffect(() => {
		setInitialLoad(true)
		lastMessageRef.current = null
		dispatch(resetMessages())
		dispatch(getChatMessages({ chatId, page: 1, limit: 10 }))
	}, [chatId, dispatch])

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
					joinChat(chatId)
					setInterlocutor(result.data.interlocutor)
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

	useEffect(() => {
		if (!scrollContainerRef.current || initialLoad) return

		const options = {
			root: scrollContainerRef.current,
			rootMargin: '100px',
			threshold: 0.1
		}

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && messagesHasMore && !messagesLoading) {
				loadPreviousMessages()
			}
		}, options)

		if (messagesTopRef.current) {
			observer.observe(messagesTopRef.current)
		}

		messagesObserver.current = observer

		return () => {
			if (messagesObserver.current) {
				messagesObserver.current.disconnect()
			}
		}
	}, [loadPreviousMessages, messagesHasMore, messagesLoading, initialLoad])

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
						<div
							className={styles['chat-window__main']}
							ref={scrollContainerRef}
						>
							<div style={{ minHeight: '1px' }} ref={messagesTopRef} />

							{messagesLoading && (
								<div className={styles.loading}>Loading messages...</div>
							)}

							{chatMessages.map(message => (
								<MessageBlock
									key={message._id}
									messageText={message.text}
									author={message.author.username}
									createdAt={message.createdAt}
									updatedAt={message.updatedAt}
									own={message.author._id === currentUser._id}
								/>
							))}

							<div ref={messagesEndRef} />
						</div>

						<ChatInput
							messageText={messageText}
							setMessageText={setMessageText}
							onSendMessage={handleSendMessage}
						/>
					</div>
				</>
			)}
		</div>
	)
}

export default Chat
