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
			throw new Error(
				'Пользователь с таким email и(-или) username уже зарегистрирован'
			)
		}

		const user = new User({
			username,
			email,
			password
		})

		await user.save()

		const tokens = generateTokens(user._id)

		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
			httpOnly: true
		})

		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 500 * 60 * 1000, // 500 минут
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
			throw new Error('Неверный email или пароль')
		}

		const isMatch = await user.correctPassword(password, user.password)
		console.log(isMatch)
		if (!isMatch) {
			res.status(400)
			throw new Error('Неверный email или пароль')
		}

		const tokens = generateTokens(user._id)
		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
			httpOnly: true
		})

		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 500 * 60 * 1000, // 500 минут
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
			throw new Error('Вы не авторизованы')
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
		res.status(200).json({ message: 'Вы успешно вышли из аккаунта' })
	} catch (err) {
		next(err)
	}
}

export const refreshToken = async (req, res, next) => {
	try {
		const { refreshToken } = req.cookies

		if (!refreshToken) {
			res.status(401)
			throw new Error('Вы не авторизованы. Пожалуйста, войдите снова.')
		}

		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_TOKEN_SECRET
		)

		const user = await User.findById(decoded.id)

		if (!user) {
			res.status(401)
			throw new Error('Вы не авторизованы. Пожалуйста, войдите снова.')
		}

		const tokens = generateTokens(user._id)

		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
			httpOnly: true
		})

		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 500 * 60 * 1000, // 500 минут
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
