import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import defaultAvatar from '../../assets/default-avatar.avif'
import { createOrGetChat } from '../../features/chat/chatSlice'
import { formatTime } from '../../utils/formatTime'
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

	const displayData = isSearchResult
		? {
				name: userData?.username || 'Unknown',
				message: 'Start a conversation',
				time: '',
				avatar: userData?.avatar
		  }
		: {
				name:
					chats
						.find(c => c._id === chatId)
						?.members.find(m => m._id !== currentUser?._id)?.username ||
					'Unknown',
				message:
					(chats.find(c => c._id === chatId)?.lastMessage?.text.length > 20
						? chats
								.find(c => c._id === chatId)
								?.lastMessage?.text.slice(0, 25) + '...'
						: chats.find(c => c._id === chatId)?.lastMessage?.text) ||
					'No messages yet',
				time: formatTime(
					chats.find(c => c._id === chatId)?.lastMessage?.createdAt,
					true
				),
				avatar: chats
					.find(c => c._id === chatId)
					?.members.find(m => m._id !== currentUser?._id)?.avatar
		  }

	return (
		<li
			className={styles['chats-user']}
			onClick={clickHandler}
			style={{ opacity: isLoading ? 0.5 : 1 }}
		>
			<div className={styles['chats-user__user-and-text']}>
				<div className={styles['chats-user__avatar-container']}>
					<img
						className={styles['chats-user__avatar']}
						src={
							displayData.avatar?.url ? displayData.avatar?.url : defaultAvatar
						}
						alt={displayData.name}
					/>
				</div>
				<div className={styles['chats-user__text']}>
					<p className={styles['chats-user__username']}>{displayData.name}</p>
					<p className={styles['chats-user__last-message']}>
						{displayData.message}
					</p>
				</div>
			</div>
			{displayData.time && (
				<p className={styles['chats-user__date']}>
					<p>{displayData.time[0]}</p>
					<p>at {displayData.time[1]}</p>
				</p>
			)}
		</li>
	)
}

export default memo(ChatListItem)
