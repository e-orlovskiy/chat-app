import api from '../../api/axios'

const config = { withCredentials: true }

export const getChatByIdAPI = async chatId => {
	const res = await api.get(`chats/${chatId}`, config)
	return res.data
}

export const getUserChatsAPI = async (page = 1, limit = 10) => {
	try {
		const response = await api.get('chats', {
			...config,
			params: { page, limit }
		})
		return response.data
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Failed to fetch user chats')
	}
}

export const createOrGetChatAPI = async members => {
	try {
		const response = await api.post(
			`chats/create-or-get-chat`,
			{ members },
			config
		)
		return response.data
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to create chat')
	}
}

export const getChatMessagesAPI = async (chatId, page = 1, limit = 25) => {
	try {
		const response = await api.get(`chats/${chatId}/messages`, {
			...config,
			params: { page, limit }
		})
		return response.data
	} catch (error) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch chat messages'
		)
	}
}
