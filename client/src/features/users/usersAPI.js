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
