import multer from 'multer' // если хочешь оставить локально, иначе убрать
import sharp from 'sharp'
import User from '../models/userModel.js'
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js'

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }
})

export const uploadUserAvatar = async (req, res) => {
	try {
		await new Promise((resolve, reject) => {
			upload.single('avatar')(req, res, err => {
				if (err) return reject(err)
				resolve()
			})
		})
	} catch (err) {
		console.error('Multer parsing error:', err)
		return res
			.status(400)
			.json({ message: 'Error parsing file', detail: err.message })
	}

	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' })
		}

		const allowed = ['image/jpeg', 'image/png', 'image/webp']
		if (!allowed.includes(req.file.mimetype)) {
			return res.status(400).json({ message: 'Invalid file type' })
		}

		const processedBuffer = await sharp(req.file.buffer)
			.rotate()
			.resize(512, 512, { fit: 'cover' })
			.png({ quality: 85 })
			.toBuffer()

		const userId = req.user?._id || req.user?.id
		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		const publicId = `avatars/user_${userId}`

		const result = await uploadBufferToCloudinary(processedBuffer, {
			public_id: publicId,
			folder: 'avatars',
			overwrite: true,
			invalidate: true,
			resource_type: 'image',
			transformation: { width: 512, height: 512, crop: 'fill', quality: 'auto' }
		})

		const user = await User.findById(userId)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		await user.save()

		return res.status(200).json({
			publicId: result.public_id,
			url: result.secure_url,
			uploadedAt: new Date()
		})
	} catch (error) {
		next(error)
	}
}

// search users
export const searchUsers = async (req, res, next) => {
	try {
		const { username, page = 1, limit = 10 } = req.query
		const pageNum = Number(page)
		const limitNum = Number(limit)

		if (!username?.trim()) {
			return res.json({
				data: [],
				page: pageNum,
				hasMore: false,
				totalCount: 0
			})
		}

		const skip = (pageNum - 1) * limitNum
		const query = {
			username: { $regex: username, $options: 'i' },
			_id: { $ne: req.user._id }
		}

		const [users, totalCount] = await Promise.all([
			User.find(query)
				.select('_id username email')
				.sort({ username: 1 })
				.skip(skip)
				.limit(limitNum),
			User.countDocuments(query)
		])

		const hasMore = skip + users.length < totalCount

		res.json({
			data: users,
			page: pageNum,
			hasMore,
			totalCount
		})
	} catch (error) {
		next(error)
	}
}
