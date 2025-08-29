import api from '../../api/axios'

export const loginUserAPI = async (email, password) => {
	const response = await api.post(
		`auth/login`,
		{ email, password },
		{
			withCredentials: true
		}
	)
	return response.data
}

export const registerUserAPI = async (username, email, password) => {
	const response = await api.post(
		`auth/register`,
		{ username, email, password },
		{ withCredentials: true }
	)
	return response.data
}

export const checkAuthAPI = async () => {
	const response = await api.get(`auth/check-auth`, {
		withCredentials: true
	})
	return response.data
}

export const logoutAPI = async () => {
	const response = await api.post(
		`auth/logout`,
		{},
		{
			withCredentials: true
		}
	)
	return response.data
}
