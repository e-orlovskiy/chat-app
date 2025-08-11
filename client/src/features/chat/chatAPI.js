import axios from 'axios'
import { SERVER_URL } from '../../utils/config'

const CHAT_URL = `${SERVER_URL}/chats`
const config = { withCredentials: true }

export const getChatByIdAPI = async chatId => {
	const res = await axios.get(`${CHAT_URL}/${chatId}`, config)
	return res.data
}

export const getUserChatsAPI = async (page = 1, limit = 10) => {
	try {
		const response = await axios.get(CHAT_URL, {
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
		const response = await axios.post(
			`${CHAT_URL}/create-or-get-chat`,
			{ members },
			config
		)
		return response.data
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to create chat')
	}
}

export const getChatMessagesAPI = async (chatId, page = 1, limit = 50) => {
	try {
		const response = await axios.get(`${CHAT_URL}/${chatId}/messages`, {
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
