import cn from 'classnames'
import { memo } from 'react'
import defaultAvatar from '../../assets/default-avatar.avif'
import { useChatListItemData } from '../../hooks/useChatListItemData'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import styles from './ChatListItem.module.css'

function ChatListItem({
	chatId = null,
	userId = null,
	isSearchResult = false,
	userData = null
}) {
	const {
		displayData,
		handleClick,
		isLoading,
		activeChat,
		showConfirmDialog,
		setShowConfirmDialog,
		handleCreateChat
	} = useChatListItemData({
		chatId,
		userId,
		isSearchResult,
		userData
	})

	return (
		<>
			<li
				className={cn(styles['chats-user'], {
					[styles['chats-user--active']]: activeChat === chatId
				})}
				onClick={handleClick}
				style={{ opacity: isLoading ? 0.5 : 1 }}
			>
				<div className={styles['chats-user__user-and-text']}>
					<div className={styles['chats-user__avatar-container']}>
						<img
							className={styles['chats-user__avatar']}
							src={displayData?.avatar?.url || defaultAvatar}
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

			<ConfirmDialog
				isOpen={showConfirmDialog}
				user={displayData}
				message='Are you sure you want to create a new chat with this user?'
				cancelText='No'
				confirmText='Yes'
				onConfirm={handleCreateChat}
				onCancel={() => setShowConfirmDialog(false)}
			/>
		</>
	)
}

export default memo(ChatListItem)
