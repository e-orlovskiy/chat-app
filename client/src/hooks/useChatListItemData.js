// hooks/useChatListItemData.js
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createOrGetChat } from '../features/chat/chatSlice'
import { formatTime } from '../utils/formatTime'

export const useChatListItemData = ({
	chatId,
	userId,
	isSearchResult,
	userData
}) => {
	const [isLoading, setIsLoading] = useState(false)
	const currentUser = useSelector(state => state.auth.user)
	const chats = useSelector(state => state.chat.chats)
	const chatsLastMessages = useSelector(state => state.chat.chatsLastMessages)
	const currentChat = useSelector(state => state.chat.currentChat)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const handleClick = async () => {
		if (isLoading) return
		setIsLoading(true)

		try {
			if (!isSearchResult && chatId) {
				if (currentChat?._id === chatId) return
				navigate(`/chat/${chatId}`)
			}

			if (isSearchResult && userId) {
				if (currentChat?.members?.some(m => m._id === userId)) return

				const result = await dispatch(
					createOrGetChat({ members: [currentUser._id, userId] })
				)

				if (result.payload?.data) {
					navigate(`/chat/${result.payload.data.chat._id}`)
				}
			}
		} finally {
			setIsLoading(false)
		}
	}

	const displayData = useMemo(() => {
		if (isSearchResult) {
			return {
				name: userData?.username || 'Unknown',
				message: 'Start a conversation',
				time: '',
				avatar: userData?.avatar
			}
		}

		const chat = chats.find(c => c._id === chatId)
		const lastMessage = chatsLastMessages.find(m => m.chatId === chatId)

		return {
			name:
				chat?.members.find(m => m._id !== currentUser?._id)?.username ||
				'Unknown',
			message:
				lastMessage?.text?.length > 20
					? lastMessage.text.slice(0, 25) + '...'
					: lastMessage?.text || 'No messages yet',
			time: formatTime(chat?.lastMessage?.createdAt, true),
			avatar: chat?.members.find(m => m._id !== currentUser?._id)?.avatar
		}
	}, [isSearchResult, userData, chats, chatsLastMessages, chatId, currentUser])

	return { displayData, handleClick, isLoading }
}
