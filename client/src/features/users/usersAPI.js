import api from '../../api/axios'

const config = { withCredentials: true }

export const searchUsersAPI = async (username, page = 1, limit = 7) => {
	if (!username || username.trim() === '') {
		return { data: [], page, hasMore: false }
	}

	const response = await api.get('users/search', {
		...config,
		params: { username, page, limit }
	})
	return response.data
}

export const uploadUserAvatarAPI = async (file, onUploadProgress) => {
	const fd = new FormData()
	fd.append('avatar', file)

	const response = await api.post('users/avatar', fd, {
		...config,
		onUploadProgress: progressEvent => {
			if (!progressEvent) return
			if (progressEvent.total) {
				const percent = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				)
				if (typeof onUploadProgress === 'function') onUploadProgress(percent)
			} else {
				if (typeof onUploadProgress === 'function') onUploadProgress(0)
			}
		}
	})

	return response.data
}
