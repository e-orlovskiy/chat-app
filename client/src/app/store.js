import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import chatReducer from '../features/auth/chatSlice.js'

const store = configureStore({
	reducer: {
		auth: authReducer,
		chat: chatReducer
	}
})

export default store