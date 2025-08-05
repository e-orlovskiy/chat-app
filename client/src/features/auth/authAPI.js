import axios from 'axios'
import { SERVER_URL } from '../../utils/config'

export const loginUserAPI = async (email, password) => {
	try {
		const response = await axios.post(
			`${SERVER_URL}/auth/login`,
			{ email, password },
			{
				withCredentials: true
			}
		)
		return response.data
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Login failed')
	}
}

export const registerUserAPI = async (username, email, password) => {
	try {
		const response = await axios.post(
			`${SERVER_URL}/auth/register`,
			{ username, email, password },
			{ withCredentials: true }
		)
		return response.data
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Registration failed')
	}
}

export const checkAuthAPI = async () => {
	try {
		const response = await axios.get(`${SERVER_URL}/auth/check-auth`, {
			withCredentials: true
		})
		return response.data
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Auth check failed')
	}
}
