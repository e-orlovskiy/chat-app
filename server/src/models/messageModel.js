import mongoose from 'mongoose'

const messageSchema = mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Chat',
			required: true
		},
		text: {
			type: String,
			required: [true, 'Сообщение не должно быть пустым'],
			trim: true,
			minlength: 1,
			maxlength: 400
		},
		date: {
			type: Date,
			default: Date.now
		},
		content: {
			type: String
		}
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
)

const Message = new mongoose.model('Message', messageSchema)
export default Message
