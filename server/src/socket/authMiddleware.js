import cookie from 'cookie'
import jwt from 'jsonwebtoken'

export const socketAuthMiddleware = (socket, next) => {
	try {
		const cookies = cookie.parse(socket.handshake.headers.cookie || '')
		const token = cookies.accessToken

		if (!token) {
			return next(new Error('Authentication error: token missing'))
		}

		const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
		socket.user = { id: decoded.id }

		next()
	} catch (err) {
		console.error('Socket auth error:', err.message)
		next(new Error('Authentication error'))
	}
}
