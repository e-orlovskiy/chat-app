// ChatList.js
import cn from 'classnames'
import { RiUserSearchFill, RiUserSharedFill } from 'react-icons/ri'
import { useChatList } from '../../hooks/useChatList'
import ChatListItem from '../ChatListItem/ChatListItem'
import styles from './ChatList.module.css'

function ChatList({ searchFocused, searchTerm, inputValue }) {
	const {
		showSearch,
		chatState,
		userState,
		lastChatRef,
		lastSearchRef,
		existingChats,
		noChatUsers,
		isEmptyChats,
		isEmptySearch
	} = useChatList(searchTerm, inputValue)

	const renderChatsList = () => {
		if (isEmptyChats) {
			return <div className={styles.noResults}>No chats found</div>
		}

		return (
			<ul
				className={cn(styles['chats-list'], styles['chats-focused'], {
					[styles.hidden]: showSearch
				})}
			>
				{chatState.chats.map((chat, index) => (
					<div
						key={chat._id}
						ref={index === chatState.chats.length - 1 ? lastChatRef : null}
					>
						<ChatListItem chatId={chat._id} isSearchResult={false} />
					</div>
				))}
				{chatState.status === 'loading' && (
					<div className={styles.loading}>Loading chats...</div>
				)}
			</ul>
		)
	}

	const renderSearchResults = () => {
		if (isEmptySearch)
			return <div className={styles.noResults}>No users found</div>
		if (!searchTerm) return null

		return (
			<ul
				className={cn(styles['chats-list'], styles['search-focused'], {
					[styles.hidden]: !searchFocused
				})}
			>
				<p className={styles['chat-list__category-title']}>
					<RiUserSharedFill />
					chatted ({existingChats.length})
				</p>
				{existingChats.length === 0 && (
					<p className={styles['chat-list__category-title']}>no chats here</p>
				)}
				{existingChats.map((chat, index) => (
					<div
						key={chat._id}
						ref={
							index === userState.searchResults.length - 1
								? lastSearchRef
								: null
						}
					>
						<ChatListItem chatId={chat._id} isSearchResult={false} />
					</div>
				))}
				{userState.status === 'loading' && showSearch && (
					<div className={styles.loading}>Searching users...</div>
				)}

				<p className={styles['chat-list__category-title']}>
					<RiUserSearchFill />
					not chatted ({noChatUsers.length})
				</p>
				{noChatUsers.length === 0 && (
					<p className={styles['chat-list__category-title']}>no users here</p>
				)}
				{noChatUsers.map((user, index) => (
					<div
						key={user._id}
						ref={
							index === userState.searchResults.length - 1
								? lastSearchRef
								: null
						}
					>
						<ChatListItem
							userId={user._id}
							isSearchResult={true}
							userData={user}
						/>
					</div>
				))}
			</ul>
		)
	}

	return (
		<div className={styles['chats-list-container']}>
			{renderChatsList()}
			{renderSearchResults()}
		</div>
	)
}

export default ChatList
