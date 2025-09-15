import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getHasRefreshFailed, resetRefreshFlag } from '../api/axios'
import {
	getChatMessages,
	setCurrentChat,
	setShowSidebarMobile
} from '../features/chat/chatSlice'
import { useSocketChat } from './useSocketChats'

export function useChat() {
	const { chatId } = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const {
		joinChat,
		leaveChat,
		sendMessage: socketSendMessage
	} = useSocketChat()

	const [messageText, setMessageText] = useState('')
	const [initialLoad, setInitialLoad] = useState(true)

	const messagesEndRef = useRef(null)
	const messagesTopRef = useRef(null)
	const scrollContainerRef = useRef(null)
	const isPaginatingRef = useRef(false)

	const {
		currentUser,
		chats,
		currentChat,
		chatStatus,
		chatMessages,
		messagesHasMore,
		messagesLoading,
		messagesPage,
		showSidebarMobile
	} = useSelector(state => ({
		currentUser: state.auth.user,
		chats: state.chat.chats,
		currentChat: state.chat.currentChat,
		chatStatus: state.chat.status,
		chatMessages: state.chat.messages,
		messagesHasMore: state.chat.messagesHasMore,
		messagesLoading: state.chat.messagesLoading,
		messagesPage: state.chat.messagesPage,
		showSidebarMobile: state.chat.showSidebarMobile
	}))

	const scrollToBottom = useCallback(() => {
		requestAnimationFrame(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
		})
	}, [])

	const handleSendMessage = useCallback(
		text => {
			if (!text?.trim() || !currentUser) return
			socketSendMessage(text)
			setMessageText('')
		},
		[currentUser, socketSendMessage]
	)

	const handleToggleSidebar = useCallback(() => {
		dispatch(setShowSidebarMobile(!showSidebarMobile))
	}, [dispatch, showSidebarMobile])

	useEffect(() => {
		setInitialLoad(true)
		resetRefreshFlag()
	}, [chatId])

	useEffect(() => {
		if (!chatId) {
			navigate('/')
			return
		}

		const foundChat = chats.find(c => c._id === chatId)
		if (foundChat) {
			dispatch(setCurrentChat(foundChat))
		} else {
			console.warn('Chat not found in list, need to load it')
		}

		joinChat(chatId)
		dispatch(getChatMessages({ chatId, page: 1, limit: 20 }))

		return () => {
			leaveChat(chatId)
		}
	}, [chatId, dispatch, navigate, joinChat, leaveChat, chats])

	useLayoutEffect(() => {
		if (chatMessages.length > 0) {
			if (initialLoad) {
				scrollToBottom()
				setInitialLoad(false)
			} else {
				const last = chatMessages[chatMessages.length - 1]
				if (last?.author?._id === currentUser._id) {
					scrollToBottom()
				}
			}
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
			{ root: container, threshold: 0 }
		)

		observer.observe(messagesTopRef.current)
		return () => observer.disconnect()
	}, [chatId, messagesHasMore, messagesLoading, messagesPage, dispatch])

	return {
		chatId,
		currentUser,
		currentChat,
		chatStatus,
		chatMessages,
		messageText,
		setMessageText,
		showSidebarMobile,
		messagesEndRef,
		messagesTopRef,
		scrollContainerRef,
		handleToggleSidebar,
		handleSendMessage
	}
}
