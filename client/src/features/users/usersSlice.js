import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { normalizeError } from '../../utils/normalizeError'
import { searchUsersAPI, uploadUserAvatarAPI } from './usersAPI'

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

export const uploadUserAvatar = createAsyncThunk(
	'users/uploadUserAvatar',
	async (file, { dispatch, rejectWithValue }) => {
		try {
			const onProgress = percent => {
				dispatch(setUploadProgress(percent))
			}
			const data = await uploadUserAvatarAPI(file, onProgress)
			dispatch(setUploadProgress(100))
			return data
		} catch (error) {
			dispatch(setUploadProgress(0))
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
		status: 'idle',
		userAvatar: null,
		uploadUserAvatarStatus: 'idle',
		uploadUserAvatarProgress: 0
	},
	reducers: {
		resetSearch: state => {
			state.searchResults = []
			state.currentPage = 1
			state.hasMore = true
			state.status = 'idle'
		},
		setUploadProgress: (state, action) => {
			state.uploadUserAvatarProgress = action.payload
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
			.addCase(uploadUserAvatar.pending, state => {
				state.uploadUserAvatarStatus = 'loading'
				state.uploadUserAvatarProgress = 0
			})
			.addCase(uploadUserAvatar.fulfilled, (state, action) => {
				const { publicId, url, uploadedAt } = action.payload
				state.userAvatar = { publicId, url, uploadedAt }
				state.uploadUserAvatarStatus = 'succeeded'
				state.uploadUserAvatarProgress = 0
			})
			.addCase(uploadUserAvatar.rejected, (state, action) => {
				state.uploadUserAvatarStatus = 'failed'
				state.uploadUserAvatarProgress = 0
				state.error = action.payload
			})
	}
})

export const { resetSearch, setUploadProgress } = usersSlice.actions
export default usersSlice.reducer
