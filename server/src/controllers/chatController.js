import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'

export const getUserChats = async (req, res, next) => {
	try {
		const currentUserId = req.user._id
		const page = Number(req.query.page) || 1
		const limit = Number(req.query.limit) || 10
		const skip = (page - 1) * limit

		// Используем агрегацию для получения чатов с последним сообщением
		const aggregation = await Chat.aggregate([
			{
				$match: {
					members: { $in: [currentUserId] }
				}
			},
			{
				$sort: { updatedAt: -1 }
			},
			{
				$skip: skip
			},
			{
				$limit: limit
			},
			{
				$lookup: {
					from: 'messages',
					let: { chatId: '$_id' },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$chat', '$$chatId'] }
							}
						},
						{
							$sort: { createdAt: -1 }
						},
						{
							$limit: 1
						},
						{
							$project: {
								text: 1,
								author: 1,
								date: 1,
								createdAt: 1
							}
						}
					],
					as: 'lastMessage'
				}
			},
			{
				$unwind: {
					path: '$lastMessage',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'members',
					foreignField: '_id',
					as: 'members'
				}
			},
			{
				$project: {
					'members.password': 0,
					'members.email': 0
				}
			}
		])

		const totalCount = await Chat.countDocuments({
			members: { $in: currentUserId }
		})

		const hasMore = skip + aggregation.length < totalCount

		res.json({
			data: aggregation,
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

		const existingChat = await Chat.findOne({
			members: { $all: members, $size: members.length }
		}).populate('members', 'username')

		if (existingChat) {
			const interlocutor = existingChat.members.find(
				member => member._id.toString() !== req.user._id.toString()
			)

			return res.status(200).json({
				success: true,
				data: {
					chat: existingChat,
					interlocutor: interlocutor
				}
			})
		}

		const newChat = await Chat.create({ members })

		await User.updateMany(
			{ _id: { $in: members } },
			{ $addToSet: { chats: newChat._id } }
		)

		const populatedChat = await Chat.findById(newChat._id).populate(
			'members',
			'username'
		)

		// Получаем информацию о собеседнике для нового чата
		const interlocutor = populatedChat.members.find(
			member => member._id.toString() !== req.user._id.toString()
		)

		res.status(201).json({
			success: true,
			data: {
				chat: populatedChat,
				interlocutor: interlocutor
			}
		})
	} catch (err) {
		next(err)
	}
}

// возможно будет реализовано в будущем
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
		await User.updateMany(
			{ _id: { $in: members } },
			{ $push: { chats: chat._id } }
		)

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

export const getChatById = async (req, res, next) => {
	try {
		const { chatId } = req.params
		const userId = req.user._id

		const chat = await Chat.findById(chatId).populate('members', 'username')

		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}

		const isMember = chat.members.some(
			member => member._id.toString() === userId.toString()
		)

		if (!isMember) {
			res.status(403)
			throw new Error('У вас нет доступа к этому чату')
		}

		const interlocutor = chat.members.find(
			member => member._id.toString() !== userId.toString()
		)

		res.status(200).json({
			success: true,
			data: {
				chat,
				interlocutor: interlocutor || null
			}
		})
	} catch (err) {
		next(err)
	}
}

export const getChatMessages = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const userId = req.user._id
		const page = Number(req.query.page) || 1
		const limit = Number(req.query.limit) || 25
		const skip = (page - 1) * limit

		const chat = await Chat.findById(chatId)

		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}

		if (!chat.members.includes(userId)) {
			res.status(403)
			throw new Error('У вас нет доступа к этому чату')
		}

		const totalCount = await Message.countDocuments({ chat: chatId })

		const messages = await Message.find({ chat: chatId })
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 })
			.populate('author', 'username avatar _id')

		const hasMore = totalCount > skip + limit

		res
			.status(200)
			.json({ data: messages.reverse(), hasMore, page, totalCount })
	} catch (err) {
		next(err)
	}
}
