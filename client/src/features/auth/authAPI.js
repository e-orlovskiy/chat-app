import api from '../../api/axios'

export const loginUserAPI = async (email, password) => {
	try {
		const response = await api.post(
			`auth/login`,
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
		const response = await api.post(
			`auth/register`,
			{ username, email, password },
			{ withCredentials: true }
		)
		return response.data
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Registration failed')
	}
}

export const checkAuthAPI = async () => {
	const response = await api.get(`auth/check-auth`, {
		withCredentials: true
	})
	return response.data
}

export const logoutAPI = async () => {
	try {
		const response = await api.post(
			`auth/logout`,
			{},
			{
				withCredentials: true
			}
		)
		return response.data
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Logout failed')
	}
}
