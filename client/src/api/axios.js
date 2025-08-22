import axios from 'axios'
import { SERVER_URL } from './config'

const api = axios.create({
	baseURL: SERVER_URL,
	withCredentials: true
})

let isRefreshing = false
let failedQueue = []
let hasRefreshFailed = false

const processQueue = (error = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) reject(error)
		else resolve()
	})
	failedQueue = []
}

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (hasRefreshFailed) {
			return Promise.reject(error)
		}

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url.includes('/auth/refresh')
		) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject, originalRequest })
				})
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				await api.post('/auth/refresh')
				isRefreshing = false
				processQueue()
				return api(originalRequest)
			} catch (refreshError) {
				isRefreshing = false
				processQueue(refreshError)

				hasRefreshFailed = true

				failedQueue = []

				return Promise.reject(refreshError)
			}
		}

		if (originalRequest._retry && hasRefreshFailed) {
			return Promise.reject(error)
		}

		return Promise.reject(error)
	}
)

export const resetRefreshFlag = () => {
	hasRefreshFailed = false
}

export default api
