import cn from 'classnames'
import { useCallback, useEffect, useRef } from 'react'
import { RiUserSearchFill, RiUserSharedFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { getUserChats } from '../../features/chat/chatSlice'
import { searchUsers } from '../../features/users/usersSlice'
import ChatListItem from '../ChatListItem/ChatListItem'
import styles from './ChatList.module.css'

const PAGE_SIZE = 7

function ChatList({ searchFocused, searchTerm, inputValue }) {
	const showSearch = inputValue.length > 0
	const chatState = useSelector(state => state.chat)
	const userState = useSelector(state => state.users)

	const dispatch = useDispatch()
	const chatObserver = useRef()
	const searchObserver = useRef()

	useEffect(() => {
		if (!showSearch) {
			dispatch(getUserChats({ page: 1, limit: PAGE_SIZE }))
		}
	}, [showSearch, dispatch])

	useEffect(() => {
		if (showSearch && searchTerm) {
			dispatch(searchUsers({ username: searchTerm, page: 1, limit: PAGE_SIZE }))
		}
	}, [showSearch, searchTerm, dispatch])

	useEffect(() => {
		const allInterlocutors = userState.searchResults.map(user => user.id)
		const existingChats = chatState.chats.filter(chat => {
			return (
				allInterlocutors.includes(chat.members[0]._id) ||
				allInterlocutors.includes(chat.members[1]._id)
			)
		})
	}, [userState.searchResults, chatState.chats])

	const loadNextChatPage = useCallback(() => {
		if (chatState.status === 'loading' || !chatState.hasMore) return

		const nextPage = chatState.currentPage + 1
		dispatch(getUserChats({ page: nextPage, limit: PAGE_SIZE }))
	}, [chatState.status, chatState.hasMore, chatState.currentPage, dispatch])

	const loadNextSearchPage = useCallback(() => {
		if (userState.status === 'loading' || !userState.hasMore || !searchTerm)
			return

		const nextPage = userState.currentPage + 1
		dispatch(
			searchUsers({
				username: searchTerm,
				page: nextPage,
				limit: PAGE_SIZE
			})
		)
	}, [
		userState.status,
		userState.hasMore,
		userState.currentPage,
		searchTerm,
		dispatch
	])

	const lastChatRef = useCallback(
		node => {
			chatObserver.current?.disconnect()

			if (node && chatState.hasMore && chatState.status !== 'loading') {
				chatObserver.current = new IntersectionObserver(
					([entry]) => entry.isIntersecting && loadNextChatPage(),
					{ threshold: 0.1 }
				)
				chatObserver.current.observe(node)
			}
		},
		[chatState.hasMore, chatState.status, loadNextChatPage]
	)

	const lastSearchRef = useCallback(
		node => {
			searchObserver.current?.disconnect()

			if (node && userState.hasMore && userState.status !== 'loading') {
				searchObserver.current = new IntersectionObserver(
					([entry]) => entry.isIntersecting && loadNextSearchPage(),
					{ threshold: 0.1 }
				)
				searchObserver.current.observe(node)
			}
		},
		[userState.hasMore, userState.status, loadNextSearchPage]
	)

	useEffect(() => {
		return () => {
			chatObserver.current?.disconnect()
			searchObserver.current?.disconnect()
		}
	}, [])

	const renderChatsList = () => {
		const isEmpty =
			chatState.chats.length === 0 &&
			chatState.status === 'succeeded' &&
			!searchTerm

		if (isEmpty) {
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
		const isEmpty =
			userState.searchResults.length === 0 &&
			userState.status === 'succeeded' &&
			searchTerm

		if (isEmpty) return <div className={styles.noResults}>No users found</div>
		if (!searchTerm) return null

		const allInterlocutors = userState.searchResults.map(user => user.id)
		const existingChats = chatState.chats.filter(chat => {
			return (
				allInterlocutors.includes(chat.members[0]._id) ||
				allInterlocutors.includes(chat.members[1]._id)
			)
		})
		const noChatUsers = userState.searchResults.filter(user => {
			return !existingChats.some(chat => {
				return (
					chat.members[0]._id === user._id || chat.members[1]._id === user._id
				)
			})
		})

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
