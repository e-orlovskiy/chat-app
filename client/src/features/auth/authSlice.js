import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	checkAuthAPI,
	loginUserAPI,
	logoutAPI,
	registerUserAPI
} from './authAPI'

export const loginUser = createAsyncThunk(
	'auth/login',
	async ({ email, password }) => {
		return await loginUserAPI(email, password)
	}
)

export const registerUser = createAsyncThunk(
	'auth/register',
	async ({ username, email, password }) => {
		return await registerUserAPI(username, email, password)
	}
)

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
	return await checkAuthAPI()
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
	return await logoutAPI()
})

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		status: 'idle',
		error: null
	},
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload
		},
		setError: (state, action) => {
			state.error = action.payload
		},
		clearError: state => {
			state.error = null
		},
		fullReset: state => {
			state.user = null
			state.status = 'idle'
			state.error = null
		}
	},
	extraReducers: builder => {
		builder
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(checkAuth.pending, state => {
				state.status = 'loading'
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(checkAuth.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(logoutUser.pending, state => {
				state.status = 'loading'
			})
			.addCase(logoutUser.fulfilled, state => {
				state.user = null
				state.status = 'idle'
				state.error = null
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
			})
	}
})

export const { logout, setUser, clearError, setError, fullReset } =
	authSlice.actions
export default authSlice.reducer
