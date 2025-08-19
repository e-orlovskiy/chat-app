import cn from 'classnames'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from 'react'
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
	const scrollContainerRef = useRef(null)
	const observerRef = useRef(null)
	const isPaginatingRef = useRef(false)

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

	const scrollToBottom = useCallback(() => {
		requestAnimationFrame(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
		})
	}, [])

	const handleSendMessage = useCallback(
		text => {
			if (!text || !text.trim() || !currentUser) return

			sendMessage(text)
			setMessageText('')
		},
		[currentUser, sendMessage]
	)

	useEffect(() => {
		if (!chatId) {
			navigate('/')
			return
		}

		joinChat(chatId)
		dispatch(resetMessages())
		dispatch(getChatMessages({ chatId, page: 1, limit: 20 }))

		dispatch(getChatById({ userId: currentUser._id, chatId }))
			.unwrap()
			.then(result => {
				if (result?.data) setInterlocutor(result.data.interlocutor)
			})
			.catch(err => {
				console.error('getChatById failed', err)
				navigate('/404', { replace: true })
			})

		return () => {
			leaveChat(chatId)
		}
	}, [chatId, currentUser._id, dispatch, navigate, joinChat, leaveChat])

	useLayoutEffect(() => {
		if (chatMessages.length > 0 && initialLoad) {
			scrollToBottom()
			setInitialLoad(false)
		}
	}, [chatMessages, initialLoad, scrollToBottom])

	useLayoutEffect(() => {
		if (chatMessages.length > 0 && !initialLoad) {
			const last = chatMessages[chatMessages.length - 1]
			if (last?.author?._id === currentUser._id) scrollToBottom()
		}
	}, [chatMessages, initialLoad, currentUser._id, scrollToBottom])

	useEffect(() => {
		if (!scrollContainerRef.current || !messagesTopRef.current) return

		const container = scrollContainerRef.current

		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (
					entry.isIntersecting &&
					messagesHasMore &&
					!messagesLoading &&
					!isPaginatingRef.current
				) {
					isPaginatingRef.current = true
					const oldScrollHeight = container.scrollHeight

					await dispatch(
						getChatMessages({
							chatId,
							page: messagesPage + 1,
							limit: 20
						})
					)

					requestAnimationFrame(() => {
						container.scrollTop = container.scrollHeight - oldScrollHeight
						isPaginatingRef.current = false
					})
				}
			},
			{ root: container, rootMargin: '100px', threshold: 0 }
		)

		observer.observe(messagesTopRef.current)
		observerRef.current = observer

		return () => {
			observer.disconnect()
		}
	}, [chatId, messagesHasMore, messagesLoading, messagesPage, dispatch])

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

							{chatMessages.map(message => (
								<MessageBlock
									key={message._id}
									messageText={message.text}
									author={message.author?.username || 'unknown'}
									createdAt={message.createdAt}
									updatedAt={message.updatedAt}
									own={message.author?._id === currentUser._id}
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
