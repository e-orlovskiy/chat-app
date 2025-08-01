import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'

export const getUserChats = async (req, res, next) => {
	try {
		const currentUserId = req.user._id
		const page = Number(req.query.page) || 1
		const limit = Number(req.query.limit) || 10
		const skip = (page - 1) * limit

		const totalCount = await Chat.countDocuments({
			members: { $in: currentUserId }
		})

		const chats = await Chat.find({ members: { $in: currentUserId } })
			.skip(skip)
			.limit(limit)
			.populate('members', '_id username email')
			.sort({ updatedAt: -1 })

		const hasMore = skip + chats.length < totalCount

		res.json({
			data: chats,
			page,
			hasMore,
			totalCount
		})
	} catch (err) {
		next(err)
	}
}

export const createOrGetChat = async (req, res, next) => {
	try {
		const { members } = req.body

		if (!members || members.length < 2) {
			throw new Error('Для создания чата необходимо 2 участника')
		}

		if (members.length == 2) {
			const existingChat = await Chat.findOne({
				privacy: 'public',
				members: { $all: members }
			})

			if (existingChat) {
				return res.status(200).json({ data: existingChat })
			}
		}

		const chat = await Chat.create({ members })
		await User.updateMany({ _id: { $in: members } }, { $push: { chats: chat._id } })

		res.status(201).json({ data: chat })
	} catch (err) {
		next(err)
	}
}

export const createGroupChat = async (req, res, next) => {
	try {
		const { title, members } = req.body

		if (!members) {
			throw new Error('Для создания группы необходим хотя бы один участник')
		}

		const existingChat = await Chat.findOne({
			title,
			members: { $all: members }
		})

		if (existingChat) {
			return res.status(200).json({ data: existingChat })
		}

		const chat = await Chat.create({ title, members })
		await User.updateMany({ _id: { $in: members } }, { $push: { chats: chat._id } })

		res.status(201).json({ data: chat })
	} catch (err) {
		next(err)
	}
}

export const joinChat = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const userId = req.user._id

		const chat = await Chat.findById(chatId)

		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}

		if (chat.members.includes(userId)) {
			res.status(200).json({ data: { chatId: chat._id } })
		} else {
			chat.members.push(userId)
			await chat.save()
			res.status(200).json({ data: { chatId: chat._id } })
		}
	} catch (err) {
		next(err)
	}
}

export const getChatMessages = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const userId = req.user._id

		const chat = await Chat.findById(chatId)
		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}
		if (!chat.members.includes(userId)) {
			res.status(403)
			throw new Error('У вас нет доступа к этому чату')
		}

		const messages = await Message.find({ chat: chatId })

		res.status(200).json({ data: messages })
	} catch (err) {
		next(err)
	}
}

export const getChatById = async (req, res, next) => {
	try {
		const chat = await Chat.findById(req.params.id)
		if (!chat) throw new Error('Чат не найден')
		res.status(200).json({ data: chat })
	} catch (err) {
		next(err)
	}
}
