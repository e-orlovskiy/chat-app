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
import { getHasRefreshFailed, resetRefreshFlag } from '../../api/axios'
import {
	getChatMessages,
	resetMessages,
	setCurrentChat
} from '../../features/chat/chatSlice'
import { useSocketChat } from '../../hooks/useSocketChats'
import { groupMessages } from '../../utils/groupMessages'
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
	const chats = useSelector(state => state.chat.chats)

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const messagesEndRef = useRef(null)
	const messagesTopRef = useRef(null)
	const scrollContainerRef = useRef(null)
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
		setInitialLoad(true)
		resetRefreshFlag()
	}, [chatId])

	useEffect(() => {
		if (!chatId) {
			navigate('/')
			return
		}

		joinChat(chatId)
		dispatch(resetMessages())
		dispatch(setCurrentChat(chats.find(c => c._id === chatId)))
		dispatch(getChatMessages({ chatId, page: 1, limit: 20 }))

		return () => {
			dispatch(resetMessages())
			leaveChat(chatId)
			setInterlocutor(null)
		}
	}, [chatId, currentUser._id, dispatch, navigate, joinChat, leaveChat, chats])

	useEffect(() => {
		if (currentChat?.members && currentUser) {
			const foundInterlocutor = currentChat.members.find(
				member => member._id !== currentUser._id
			)
			setInterlocutor(foundInterlocutor || null)
		}
	}, [currentChat, currentUser])

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
					if (getHasRefreshFailed()) return

					isPaginatingRef.current = true
					const oldScrollHeight = container.scrollHeight

					try {
						await dispatch(
							getChatMessages({
								chatId,
								page: messagesPage + 1,
								limit: 20
							})
						)
					} catch (err) {
						console.error('Failed to load messages page:', err)
					} finally {
						requestAnimationFrame(() => {
							container.scrollTop = container.scrollHeight - oldScrollHeight
							isPaginatingRef.current = false
						})
					}
				}
			},
			{ root: container, rootMargin: '0px', threshold: 0 }
		)

		observer.observe(messagesTopRef.current)
		return () => observer.disconnect()
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

							{groupMessages(chatMessages, { thresholdMs: 5 * 60 * 1000 }).map(
								dateGroup => (
									<div key={dateGroup.dateKey} className={styles['date-group']}>
										<div className={styles['date-group__header']}>
											{dateGroup.dateLabel}
										</div>

										{dateGroup.userGroups.map(g =>
											g.messages.map((message, index) => {
												const isLastMessage = index === g.messages.length - 1
												const isFirstMessage = index === 0

												return (
													<MessageBlock
														key={message._id}
														messageText={message.text}
														author={message.author?.username || 'unknown'}
														createdAt={message.createdAt}
														updatedAt={message.updatedAt}
														own={message.author?._id === currentUser._id}
														isLastMessage={isLastMessage}
														isFirstMessage={isFirstMessage}
														// если нужно, можно передать весь объект group (g) для дополнительных стилей
													/>
												)
											})
										)}
									</div>
								)
							)}

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
