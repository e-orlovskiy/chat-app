import axios from 'axios'
import { SERVER_URL } from './config'

const api = axios.create({
	baseURL: SERVER_URL,
	withCredentials: true
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error = null) => {
	failedQueue.forEach(({ resolve, reject, originalRequest }) => {
		if (error) reject(error)
		else resolve(api(originalRequest))
	})
	failedQueue = []
}

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
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
			} catch (err) {
				isRefreshing = false
				processQueue(err)
				return Promise.reject(err)
			}
		}

		return Promise.reject(error)
	}
)

export default api
