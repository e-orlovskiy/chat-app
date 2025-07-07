import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUsersAPI } from './usersAPI'

export const getAllUsers = createAsyncThunk('users/getAllUsers', async () => {
	return await fetchUsersAPI()
})

const usersSlice = createSlice({
	name: 'users',
	initialState: {
		users: [],
		status: 'idle',
		error: null
	},
	extraReducers: builder => {
		builder
			.addCase(getAllUsers.fulfilled, (state, action) => {
				state.users = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(getAllUsers.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.users = []
			})
			.addCase(getAllUsers.pending, state => {
				state.status = 'loading'
			})
	}
})

export default usersSlice.reducer
