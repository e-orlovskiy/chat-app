import User from '../models/userModel.js'

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
			User.find(query).select('_id username email').sort({ username: 1 }).skip(skip).limit(limitNum),
			User.countDocuments(query)
		])

		const hasMore = skip + users.length < totalCount

		res.json({
			data: users,
			page: pageNum,
			hasMore,
			totalCount
		})
	} catch (err) {
		next(err)
	}
}
