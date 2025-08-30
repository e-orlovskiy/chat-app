import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { normalizeError } from '../../utils/normalizeError'
import { searchUsersAPI } from './usersAPI'

export const searchUsers = createAsyncThunk(
	'users/searchUsers',
	async ({ username, page = 1, limit = 10 }, { rejectWithValue }) => {
		try {
			return await searchUsersAPI(username, page, limit)
		} catch (error) {
			return rejectWithValue(normalizeError(error))
		}
	}
)

const usersSlice = createSlice({
	name: 'users',
	initialState: {
		searchResults: [],
		error: null,
		currentPage: 1,
		hasMore: true,
		status: 'idle'
	},
	reducers: {
		resetSearch: state => {
			state.searchResults = []
			state.currentPage = 1
			state.hasMore = true
			state.status = 'idle'
		}
	},
	extraReducers: builder => {
		builder
			.addCase(searchUsers.pending, (state, action) => {
				if (action.meta.arg.page === 1) {
					state.searchResults = []
				}
				state.status = 'loading'
			})
			.addCase(searchUsers.fulfilled, (state, action) => {
				const { data, page, hasMore, totalCount } = action.payload
				console.log('searchUsers.fulfilled:', {
					data: data.length,
					page,
					hasMore,
					totalCount
				})

				if (page === 1) {
					state.searchResults = data
				} else {
					state.searchResults = [...state.searchResults, ...data]
				}
				state.currentPage = page
				state.hasMore = hasMore
				state.status = 'succeeded'
			})
			.addCase(searchUsers.rejected, (state, action) => {
				state.error = action.payload
				state.status = 'failed'
			})
	}
})

export const { resetSearch } = usersSlice.actions
export default usersSlice.reducer
