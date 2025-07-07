import axios from 'axios'
import { SERVER_URL } from '../config'

export const loginUserAPI = async (email, password) =>
	axios
		.post(`${SERVER_URL}/auth/login`, { email, password }, { withCredentials: true })
		.then(res => res.data)

export const registerUserAPI = async (username, email, password) =>
	axios
		.post(
			`${SERVER_URL}/auth/register`,
			{ username, email, password },
			{ withCredentials: true }
		)
		.then(res => res)
		.catch(res=> res)


export const checkAuthAPI = async () => {
	return axios
		.get(`${SERVER_URL}/auth/check-auth`, { withCredentials: true })
		.then(res => res.data)
}
