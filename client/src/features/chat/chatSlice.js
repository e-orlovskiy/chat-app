import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	createOrGetChatAPI,
	getChatByIdAPI,
	getChatMessagesAPI,
	getUserChatsAPI
} from './chatAPI'

// 1. Users chats
export const getUserChats = createAsyncThunk(
	'chat/getUserChats',
	async ({ page, limit }, { rejectWithValue }) => {
		try {
			return await getUserChatsAPI(page, limit)
		} catch (err) {
			return rejectWithValue(err.message)
		}
	}
)

// 2. Create or get existing chat
export const createOrGetChat = createAsyncThunk(
	'chat/createOrGetChat',
	async ({ members }, { rejectWithValue }) => {
		try {
			return await createOrGetChatAPI(members)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

// 3. Get specific chat
export const getChatById = createAsyncThunk(
	'chat/getChatById',
	async ({ chatId }, { rejectWithValue }) => {
		try {
			return await getChatByIdAPI(chatId)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

// 4. Get chat messages
export const getChatMessages = createAsyncThunk(
	'chat/getChatMessages',
	async ({ chatId, page, limit }, { rejectWithValue }) => {
		try {
			return await getChatMessagesAPI(chatId, page, limit)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		chats: [],
		currentChat: null,
		messages: [],
		status: 'idle',
		error: null,
		currentPage: 1,
		messagesPage: 1,
		hasMore: true,
		messagesHasMore: true,
		loadingMore: false,
		messagesLoading: false,
		onlineUsers: [],
		typingUsers: []
	},
	reducers: {
		addMessage: (state, action) => {
			state.messages.push(action.payload)
		},
		resetMessages: state => {
			state.messages = []
			state.messagesPage = 1
			state.messagesHasMore = true
		},
		updateUserStatus: (state, action) => {
			const { userId, status } = action.payload
			if (status === 'online') {
				if (!state.onlineUsers.includes(userId)) {
					state.onlineUsers.push(userId)
				}
			} else {
				state.onlineUsers = state.onlineUsers.filter(user => user !== userId)
			}
		},
		setUserTyping: (state, action) => {
			const { userId, chatId, isTyping } = action.payload
			if (isTyping) {
				const typingUser = { userId, chatId }
				if (
					!state.typingUsers.find(
						user => user.userId === userId && user.chatId === chatId
					)
				) {
					state.typingUsers.push(typingUser)
				}
			} else {
				state.typingUsers = state.typingUsers.filter(
					user => !(user.userId === userId && user.chatId === chatId)
				)
			}
		},
		setCurrentChat: (state, action) => {
			state.currentChat = action.payload
			state.messages = []
		},
		resetChatState: state => {
			state.currentChat = null
			state.messages = []
			state.messagesHasMore = true
			state.messagesLoading = false
		},
		resetChats: state => {
			state.chats = []
			state.currentPage = 1
			state.hasMore = true
		}
	},
	extraReducers: builder => {
		builder
			// загрузка пользовательских чатов
			.addCase(getUserChats.pending, (state, action) => {
				if (action.meta.arg.page === 1) {
					state.status = 'loading'
					state.chats = []
				} else {
					state.loadingMore = true
				}
			})
			.addCase(getUserChats.fulfilled, (state, action) => {
				const { data, page, hasMore } = action.payload
				if (page === 1) {
					state.chats = data
				} else {
					state.chats = [...state.chats, ...data]
				}
				state.currentPage = page
				state.hasMore = hasMore
				state.status = 'succeeded'
				state.loadingMore = false
			})
			.addCase(getUserChats.rejected, (state, action) => {
				state.error = action.payload
				state.status = 'failed'
				state.loadingMore = false
			})
			// 2. Create or get chat
			.addCase(createOrGetChat.pending, state => {
				state.status = 'loading'
			})
			.addCase(createOrGetChat.fulfilled, (state, action) => {
				state.status = 'succeeded'
				const newChat = action.payload.data.chat
				const chatExists = state.chats.some(chat => chat._id === newChat._id)

				if (!chatExists) {
					state.chats.unshift(newChat)
				}

				state.currentChat = newChat
			})
			.addCase(createOrGetChat.rejected, (state, action) => {
				state.error = action.payload
				state.status = 'failed'
			})
			// 3. getChatById
			.addCase(getChatById.fulfilled, (state, action) => {
				state.status = 'succeeded'
				const newChat = action.payload.data.chat
				const chatExists = state.chats.some(chat => chat._id === newChat._id)

				if (!chatExists) {
					state.chats.unshift(newChat)
				}

				state.currentChat = newChat
			})
			// 4. getting messages
			.addCase(getChatMessages.pending, state => {
				state.messagesLoading = true
			})
			.addCase(getChatMessages.fulfilled, (state, action) => {
				const { data, page, hasMore } = action.payload
				if (page === 1) {
					state.messages = data
				} else {
					state.messages = [...data, ...state.messages]
				}
				state.messagesLoading = false
				state.messagesPage = page
				state.messagesHasMore = hasMore
			})
			.addCase(getChatMessages.rejected, (state, action) => {
				state.error = action.payload
				state.messagesLoading = false
			})
	}
})

export const {
	addMessage,
	resetMessages,
	setCurrentChat,
	resetChats,
	updateUserStatus,
	setUserTyping,
	resetChatState
} = chatSlice.actions
export default chatSlice.reducer
