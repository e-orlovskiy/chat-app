import api from '../../api/axios'

const config = { withCredentials: true }

export const loginUserAPI = async (email, password) => {
	const response = await api.post(
		`auth/login`,
		{ email, password },
		{ ...config }
	)
	return response.data
}

export const registerUserAPI = async (username, email, password) => {
	const response = await api.post(
		`auth/register`,
		{ username, email, password },
		{ ...config }
	)
	return response.data
}

export const checkAuthAPI = async () => {
	const response = await api.get(`auth/check-auth`, {
		...config
	})
	return response.data
}

export const logoutAPI = async () => {
	const response = await api.post(`auth/logout`, {}, { ...config })
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
