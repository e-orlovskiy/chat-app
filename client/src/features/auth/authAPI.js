import axios from 'axios'
const API_URL = 'http://localhost:3000/auth'

export const loginUserAPI = async (email, password) =>
	axios
		.post(`${API_URL}/login`, { email, password }, { withCredentials: true })
		.then(res => res.data)

export const registerUserAPI = async (username, email, password) =>
	axios
		.post(
			`${API_URL}/register`,
			{ username, email, password },
			{ withCredentials: true }
		)
		.then(res => res)
		.catch(res=> res)
