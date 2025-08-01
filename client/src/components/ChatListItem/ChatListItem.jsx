import { memo, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createOrGetChat, setCurrentChat } from '../../features/chat/chatSlice'
import { useSocketChat } from '../../hooks/useSocketChats'
import { formatTime } from '../../utils/formatTime'
import styles from './ChatListItem.module.css'

function ChatListItem({ chatId, isSearchResult = false }) {
	const currentUser = useSelector(state => state.auth.user)
	const chats = useSelector(state => state.chat.chats)
	const searchResults = useSelector(state => state.users.searchResults)
	const currentChat = useSelector(state => state.chat.currentChat)

	const { joinChat, leaveChat } = useSocketChat()
	const dispatch = useDispatch()

	const itemData = useMemo(() => {
		if (isSearchResult) {
			const user = searchResults?.find(u => u?._id === chatId)
			return user
				? {
						type: 'user',
						name: user.username,
						message: 'Start a conversation',
						time: '',
						data: user
				  }
				: null
		}

		const chat = chats?.find(c => c?._id === chatId)
		if (!chat) return null

		const otherMember = chat.members?.find(m => m?._id !== currentUser?._id)

		return {
			type: 'chat',
			name: otherMember?.username || 'Unknown user',
			message: chat.lastMessage?.text || 'No messages yet',
			time: formatTime(chat.lastMessage?.createdAt),
			data: chat
		}
	}, [chatId, isSearchResult, searchResults, chats, currentUser?._id])

	const clickHandler = async () => {
		if (isSearchResult) {
			const existingChat = chats.find(chat => chat.members?.some(member => member._id === chatId))

			if (existingChat) {
				if (currentChat) {
					leaveChat(currentChat._id)
				}

				dispatch(setCurrentChat(existingChat))
				joinChat(existingChat._id)
			} else {
				const result = await dispatch(
					createOrGetChat({
						members: [currentUser?._id, chatId]
					})
				)

				if (result.payload?.data) {
					joinChat(result.payload.data._id)
				}
			}
		} else {
			if (currentChat && currentChat._id !== itemData.data._id) {
				leaveChat(currentChat._id)
			}

			dispatch(setCurrentChat(itemData.data))
			joinChat(itemData.data._id)
		}
	}

	if (!itemData) return null

	return (
		<li className={styles['chats-user']} onClick={clickHandler}>
			<div className={styles['chats-user__user-and-text']}>
				<div className={styles['chats-user__avatar']} />
				<div className={styles['chats-user__text']}>
					<p className={styles['chats-user__username']}>{itemData.name}</p>
					<p className={styles['chats-user__last-message']}>{itemData.message}</p>
				</div>
			</div>
			{itemData.time && <p className={styles['chats-user__date']}>{itemData.time}</p>}
		</li>
	)
}

export default memo(ChatListItem)
