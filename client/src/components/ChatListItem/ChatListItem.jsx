import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createOrGetChat, setCurrentChat } from '../../features/chat/chatSlice'
import styles from './ChatListItem.module.css'

function ChatListItem({
	chatId = null, // Для существующих чатов
	userId = null, // Для результатов поиска
	isSearchResult = false,
	userData = null // Данные пользователя для поиска
}) {
	const [isLoading, setIsLoading] = useState(false)
	const currentUser = useSelector(state => state.auth.user)
	const chats = useSelector(state => state.chat.chats)
	const currentChat = useSelector(state => state.chat.currentChat)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const clickHandler = async () => {
		if (isLoading) return
		setIsLoading(true)

		try {
			// для существующих чатов
			if (!isSearchResult && chatId) {
				if (currentChat?._id === chatId) return

				dispatch(setCurrentChat(chats.find(c => c._id === chatId)))
				navigate(`/chat/${chatId}`)
				return
			}

			// для результатов поиска
			if (isSearchResult && userId) {
				const result = await dispatch(
					createOrGetChat({ members: [currentUser._id, userId] })
				)

				if (result.payload?.data) {
					dispatch(setCurrentChat(result.payload.data.chat))
					navigate(`/chat/${result.payload.data.chat._id}`)
				}
			}
		} finally {
			setIsLoading(false)
		}
	}

	const displayData = isSearchResult
		? {
				name: userData?.username || 'Unknown',
				message: 'Start a conversation',
				time: ''
		  }
		: {
				name:
					chats
						.find(c => c._id === chatId)
						?.members.find(m => m._id !== currentUser?._id)?.username ||
					'Unknown',
				message:
					chats.find(c => c._id === chatId)?.lastMessage?.text ||
					'No messages yet',
				time: chats.find(c => c._id === chatId)?.lastMessage?.createdAt
		  }

	return (
		<li
			className={styles['chats-user']}
			onClick={clickHandler}
			style={{ opacity: isLoading ? 0.5 : 1 }}
		>
			<div className={styles['chats-user__user-and-text']}>
				<div className={styles['chats-user__avatar']} />
				<div className={styles['chats-user__text']}>
					<p className={styles['chats-user__username']}>{displayData.name}</p>
					<p className={styles['chats-user__last-message']}>
						{displayData.message}
					</p>
				</div>
			</div>
			{displayData.time && (
				<p className={styles['chats-user__date']}>{displayData.time}</p>
			)}
		</li>
	)
}

export default memo(ChatListItem)
