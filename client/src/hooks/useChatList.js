import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserChats } from '../features/chat/chatSlice'
import { searchUsers } from '../features/users/usersSlice'

const PAGE_SIZE = 7

export function useChatList(searchTerm, inputValue) {
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

	const loadNextChatPage = useCallback(() => {
		if (chatState.status === 'loading' || !chatState.hasMore) return
		dispatch(
			getUserChats({ page: chatState.currentPage + 1, limit: PAGE_SIZE })
		)
	}, [chatState.status, chatState.hasMore, chatState.currentPage, dispatch])

	const loadNextSearchPage = useCallback(() => {
		if (userState.status === 'loading' || !userState.hasMore || !searchTerm)
			return
		dispatch(
			searchUsers({
				username: searchTerm,
				page: userState.currentPage + 1,
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
			if (chatObserver.current) chatObserver.current.disconnect()

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
			if (searchObserver.current) searchObserver.current.disconnect()

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

	const allInterlocutors = userState.searchResults.map(user => user.id)
	const existingChats = chatState.chats.filter(
		chat =>
			allInterlocutors.includes(chat.members[0]._id) ||
			allInterlocutors.includes(chat.members[1]._id)
	)
	const noChatUsers = userState.searchResults.filter(
		user =>
			!existingChats.some(
				chat =>
					chat.members[0]._id === user._id || chat.members[1]._id === user._id
			)
	)

	return {
		showSearch,
		chatState,
		userState,
		lastChatRef,
		lastSearchRef,
		existingChats,
		noChatUsers,
		isEmptyChats:
			chatState.chats.length === 0 &&
			chatState.status === 'succeeded' &&
			!searchTerm,
		isEmptySearch:
			userState.searchResults.length === 0 &&
			userState.status === 'succeeded' &&
			searchTerm
	}
}
