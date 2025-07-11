import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	createChatAPI,
	fetchChatsAPI,
	fetchMessagesAPI,
	joinPrivateChatAPI,
	joinPublicChatAPI
} from './chatAPI'

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
	const response = await fetchChatsAPI()
	return response
})
export const fetchMessages = createAsyncThunk('chat/fetchMessages', async chatId => {
	const response = await fetchMessagesAPI(chatId)
	return response
})
export const createChat = createAsyncThunk('chat/createChat', async payload => {
	const response = await createChatAPI(payload)
	return response
})
export const joinPublicChat = createAsyncThunk(
	'chat/joinPublicChat',
	async chatId => {
		const response = await joinPublicChatAPI(chatId)
		return response
	}
)
export const joinPrivateChat = createAsyncThunk(
	'chat/joinPrivateChat',
	async ({ chatId, password }) => {
		const response = await joinPrivateChatAPI(chatId, password)
		return response
	}
)

const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		chats: [],
		currentChat: null,
		messages: [],
		status: 'idle'
	},
	reducers: {
		addMessage: (state, action) => {
			state.messages.push(action.payload)
		},
		setCurrentChat: (state, action) => {
			state.currentChat = action.payload
		}
	},
	extraReducers: builder => {
		builder
			.addCase(fetchChats.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchChats.fulfilled, (state, action) => {
				state.chats = action.payload
				state.status = 'succeeded'
			})
			.addCase(fetchMessages.fulfilled, (state, action) => {
				state.messages = action.payload
			})
			.addCase(createChat.fulfilled, (state, action) => {
				state.chats.push(action.payload)
			})
			.addCase(joinPublicChat.fulfilled, (state, action) => {
				console.log(action)
				state.currentChat = action.payload
			})
			.addCase(joinPublicChat.rejected, (state, action) => {
				console.log(action)
			})
			.addCase(joinPrivateChat.fulfilled, (state, action) => {
				state.currentChat = action.payload
			})
			.addCase(joinPrivateChat.rejected, (state, action) => {
				console.log(action)
			})
	}
})

export const { addMessage, setCurrentChat } = chatSlice.actions
export default chatSlice.reducer
