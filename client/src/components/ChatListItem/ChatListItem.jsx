import { memo } from 'react'
import defaultAvatar from '../../assets/default-avatar.avif'
import { useChatListItemData } from '../../hooks/useChatListItemData'
import styles from './ChatListItem.module.css'

function ChatListItem({
	chatId = null,
	userId = null,
	isSearchResult = false,
	userData = null
}) {
	const { displayData, handleClick, isLoading } = useChatListItemData({
		chatId,
		userId,
		isSearchResult,
		userData
	})

	return (
		<li
			className={styles['chats-user']}
			onClick={handleClick}
			style={{ opacity: isLoading ? 0.5 : 1 }}
		>
			<div className={styles['chats-user__user-and-text']}>
				<div className={styles['chats-user__avatar-container']}>
					<img
						className={styles['chats-user__avatar']}
						src={displayData.avatar?.url || defaultAvatar}
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
				<div className={styles['chats-user__date']}>
					<p>{displayData.time[0]}</p>
					<p>at {displayData.time[1]}</p>
				</div>
			)}
		</li>
	)
}

export default memo(ChatListItem)
