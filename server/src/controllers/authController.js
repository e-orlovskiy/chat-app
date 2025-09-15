import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import { generateTokens } from '../utils/generateTokens.js'

export const register = async (req, res, next) => {
	try {
		const { username, email, password } = req.body
		const userExists = await User.findOne({ $or: [{ email }, { username }] })

		if (userExists) {
			console.log('test')
			res.status(400)
			throw new Error('User with this email and/or username already exists')
		}

		const user = new User({
			username,
			email,
			password
		})

		await user.save()

		const tokens = generateTokens(user._id)

		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
			httpOnly: true
		})

		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 500 * 60 * 1000, // 500 minutes (temp)
			httpOnly: true
		})

		return res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			avatar: user.avatar || null
		})
	} catch (err) {
		next(err)
	}
}

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email }).select('+password')

		if (!user) {
			res.status(400)
			throw new Error('Invalid email or password')
		}

		const isMatch = await user.correctPassword(password, user.password)
		console.log(isMatch)
		if (!isMatch) {
			res.status(400)
			throw new Error('Invalid email or password')
		}

		const tokens = generateTokens(user._id)
		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
			httpOnly: true
		})

		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 500 * 60 * 1000, // 500 minutes (temp)
			httpOnly: true
		})

		res.json({
			_id: user._id,
			username: user.username,
			email: user.email,
			avatar: user.avatar
		})
	} catch (err) {
		next(err)
	}
}

export const checkAuth = async (req, res, next) => {
	try {
		if (!req.user) {
			res.status(401)
			throw new Error('You are not authorized')
		}

		res.json({
			_id: req.user._id,
			username: req.user.username,
			email: req.user.email,
			avatar: req.user.avatar
		})
	} catch (err) {
		next(err)
	}
}

export const logout = async (req, res, next) => {
	try {
		res.clearCookie('refreshToken')
		res.clearCookie('accessToken')
		res.status(200).json({ message: 'You have successfully logged out' })
	} catch (err) {
		next(err)
	}
}

export const refreshToken = async (req, res, next) => {
	try {
		const { refreshToken } = req.cookies

		if (!refreshToken) {
			res.status(401)
			throw new Error('You are not authorized. Please log in again.')
		}

		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_TOKEN_SECRET
		)

		const user = await User.findById(decoded.id)

		if (!user) {
			res.status(401)
			throw new Error('You are not authorized. Please log in again.')
		}

		const tokens = generateTokens(user._id)

		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
			httpOnly: true
		})

		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 500 * 60 * 1000, // 500 minutes (temp)
			httpOnly: true
		})

		res.json({
			_id: user._id,
			username: user.username,
			email: user.email,
			avatar: user.avatar
		})
	} catch (error) {
		next(error)
	}
}
