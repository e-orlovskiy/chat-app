import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const generateTokens = id => {
	const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
	})
	const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
	})
	return { accessToken, refreshToken }
}
