import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
			trim: true,
			minlength: [3, 'Username must be at least 3 characters'],
			maxlength: [20, 'Username must be less than 20 characters'],
			index: true
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			trim: true,
			lowercase: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				'Invalid email format'
			],
			maxlength: [100, 'Email must be less than 100 characters']
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [6, 'Password must be at least 6 characters'],
			maxlength: [20, 'Password must be less than 20 characters'],
			select: false
		},
		chats: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Chat'
			}
		]
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: (doc, ret) => {
				delete ret.password
				return ret
			}
		},
		toObject: {
			virtuals: true
		}
	}
)

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// Проверка пароля
userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
	return await bcrypt.compare(candidatePassword, userPassword)
}

const User = new mongoose.model('User', userSchema)
export default User
