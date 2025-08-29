import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { normalizeError } from '../../utils/normalizeError'
import {
	checkAuthAPI,
	loginUserAPI,
	logoutAPI,
	registerUserAPI
} from './authAPI'

export const loginUser = createAsyncThunk(
	'auth/login',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			return await loginUserAPI(email, password)
		} catch (error) {
			console.log(error)
			return rejectWithValue(normalizeError(error))
		}
	}
)

export const registerUser = createAsyncThunk(
	'auth/register',
	async ({ username, email, password }, { rejectWithValue }) => {
		try {
			return await registerUserAPI(username, email, password)
		} catch (error) {
			return rejectWithValue(normalizeError(error))
		}
	}
)

export const checkAuth = createAsyncThunk(
	'auth/checkAuth',
	async (_, { rejectWithValue }) => {
		try {
			return await checkAuthAPI()
		} catch (error) {
			return rejectWithValue(normalizeError(error))
		}
	}
)

export const logoutUser = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			return await logoutAPI()
		} catch (error) {
			return rejectWithValue(normalizeError(error))
		}
	}
)

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		status: 'idle',
		error: null,
		notification: null
	},
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload
		},
		setError: (state, action) => {
			state.error = action.payload
		},
		setNotification: (state, action) => {
			state.notification = action.payload
		},
		clearError: state => {
			state.error = null
		},
		clearNotification: state => {
			state.notification = null
		},
		fullReset: state => {
			state.user = null
			state.status = 'idle'
			state.error = null
			state.notification = null
		}
	},
	extraReducers: builder => {
		builder
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
				state.notification = {
					message: 'Login successful',
					type: 'success'
				}
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.error = action.payload
				state.status = 'failed'
				state.user = null
				state.notification = null
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
				state.notification = {
					message: 'Registration successful',
					type: 'success'
				}
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.error = action.payload
				state.status = 'failed'
				state.user = null
				state.notification = null
			})
			.addCase(checkAuth.pending, state => {
				state.status = 'loading'
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
				state.notification = null
			})
			.addCase(checkAuth.rejected, (state, action) => {
				state.error = action.payload
				state.status = 'failed'
				state.user = null
				state.notification = null
			})
			.addCase(logoutUser.pending, state => {
				state.status = 'loading'
			})
			.addCase(logoutUser.fulfilled, state => {
				state.user = null
				state.status = 'idle'
				state.error = null
				state.notification = null
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.error = action.payload
				state.status = 'failed'
				state.notification = null
			})
	}
})

export const {
	logout,
	setUser,
	clearError,
	setError,
	fullReset,
	setNotification,
	clearNotification
} = authSlice.actions
export default authSlice.reducer
