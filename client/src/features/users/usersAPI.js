import axios from 'axios'
import { SERVER_URL } from '../../utils/config'

const USERS_URL = `${SERVER_URL}/users`
const config = { withCredentials: true }

export const searchUsersAPI = async (username, page = 1, limit = 7) => {
	if (!username || username.trim() === '') {
		return { data: [], page, hasMore: false }
	}
	try {
		const response = await axios.get(`${USERS_URL}/search`, {
			...config,
			params: { username, page, limit }
		})
		return response.data
	} catch (err) {
		throw new Error(err.response?.data?.message || 'User search failed')
	}
}
