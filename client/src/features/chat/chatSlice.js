import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { normalizeError } from '../../utils/normalizeError'
import { logoutUser } from '../auth/authSlice'
import {
	createOrGetChatAPI,
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
			return rejectWithValue(normalizeError(err))
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
			return rejectWithValue(normalizeError(error))
		}
	}
)

// 4. Get chat messages
export const getChatMessages = createAsyncThunk(
	'chat/getChatMessages',
	async ({ chatId, page = 1, limit = 20 }, { rejectWithValue }) => {
		try {
			return await getChatMessagesAPI(chatId, page, limit)
		} catch (error) {
			return rejectWithValue(normalizeError(error))
		}
	},
	{
		condition: ({ page = 1 }, { getState }) => {
			const state = getState().chat
			if (state.messagesLoading) return false
			if (page <= state.messagesPage && state.messages.length > 0) return false
			return true
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
		messagesPage: 0,
		hasMore: true,
		messagesHasMore: true,
		loadingMore: false,
		messagesLoading: false,
		onlineUsers: [],
		typingUsers: []
	},
	reducers: {
		addMessage: (state, action) => {
			const msg = action.payload
			state.messages.push(msg)

			// const msg = action.payload
			// if (!msg || !msg._id) {
			// 	console.error('Invalid message format:', msg)
			// 	return
			// }

			// const exists = state.messages.some(m => m._id === msg._id)
			// if (!exists) {
			// 	const index = state.messages.findIndex(
			// 		m => new Date(m.createdAt) > new Date(msg.createdAt)
			// 	)

			// 	if (index === -1) {
			// 		state.messages.push(msg)
			// 	} else {
			// 		state.messages.splice(index, 0, msg)
			// 	}
			// }
		},

		resetMessages: state => {
			state.messages = []
			state.messagesPage = 0
			state.messagesHasMore = true
			state.messagesLoading = false
			state.loadingMore = false
		},

		updateUserStatus: (state, action) => {
			const { userId, status } = action.payload
			if (status === 'online') {
				if (!state.onlineUsers.includes(userId)) state.onlineUsers.push(userId)
			} else {
				state.onlineUsers = state.onlineUsers.filter(u => u !== userId)
			}
		},

		setUserTyping: (state, action) => {
			const { userId, chatId, isTyping } = action.payload
			if (isTyping) {
				const typingUser = { userId, chatId }
				if (
					!state.typingUsers.find(
						u => u.userId === userId && u.chatId === chatId
					)
				) {
					state.typingUsers.push(typingUser)
				}
			} else {
				state.typingUsers = state.typingUsers.filter(
					u => !(u.userId === userId && u.chatId === chatId)
				)
			}
		},

		setCurrentChat: (state, action) => {
			state.currentChat = action.payload
			state.messages = []
			state.messagesPage = 0
		},

		resetChatState: state => {
			state.currentChat = null
			state.messages = []
			state.messagesHasMore = true
			state.messagesLoading = false
			state.messagesPage = 0
		},

		resetChats: state => {
			state.chats = []
			state.currentPage = 1
			state.hasMore = true
		},

		fullReset: state => {
			state.chats = []
			state.currentPage = 1
			state.hasMore = true
			state.currentChat = null
			state.messages = []
			state.messagesPage = 0
			state.messagesHasMore = true
			state.messagesLoading = false
			state.loadingMore = false
			state.onlineUsers = []
			state.typingUsers = []
		}
	},
	extraReducers: builder => {
		builder
			// logout
			.addCase(logoutUser.fulfilled, state => {
				chatSlice.caseReducers.fullReset(state)
			})
			// getUserChats
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
				if (page === 1) state.chats = data
				else state.chats = [...state.chats, ...data]
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

			// createOrGetChat
			.addCase(createOrGetChat.pending, state => {
				state.status = 'loading'
			})
			.addCase(createOrGetChat.fulfilled, (state, action) => {
				state.status = 'succeeded'
				const newChat = action.payload.data.chat
				const chatExists = state.chats.some(chat => chat._id === newChat._id)
				if (!chatExists) state.chats.unshift(newChat)
			})
			.addCase(createOrGetChat.rejected, (state, action) => {
				state.error = action.payload
				state.status = 'failed'
			})

			// getChatMessages
			.addCase(getChatMessages.pending, (state, action) => {
				const page = action.meta.arg.page || 1
				if (page === 1) state.messagesLoading = true
				else state.loadingMore = true
			})
			.addCase(getChatMessages.fulfilled, (state, action) => {
				const { data, page, hasMore } = action.payload
				if (page === 1) state.messages = data
				else state.messages = [...data, ...state.messages]
				state.messagesLoading = false
				state.loadingMore = false
				state.messagesPage = page
				state.messagesHasMore = hasMore
			})
			.addCase(getChatMessages.rejected, (state, action) => {
				state.error = action.payload
				state.messagesLoading = false
				state.loadingMore = false
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
	resetChatState,
	fullReset
} = chatSlice.actions
export default chatSlice.reducer
