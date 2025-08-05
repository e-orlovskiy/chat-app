import mongoose from 'mongoose'

const chatSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: false,
			trim: true,
			minlength: 3,
			maxlength: 50
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true
			}
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message'
			}
		]
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
)

const Chat = new mongoose.model('Chat', chatSchema)
export default Chat
