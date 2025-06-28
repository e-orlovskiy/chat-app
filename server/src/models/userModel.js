import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Пользователь должен иметь имя'],
			unique: [true,'Пользователь с таким именем уже существует'],
			trim: true,
			minlength: [3,'Имя должно быть длиннее 3 символов'],
			maxlength: [20,'Имя должно быть короче 20 символов']
		},
		email: {
			type: String,
			required: [true, 'Пользователь должен иметь email'],
			unique: [true,'Пользователь с таким email уже существует'],
			trim: true,
			lowercase: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				'Пожалуйста, введите корректный email'
			]
		},
		password: {
			type: String,
			required: [true, 'Пользователь должен иметь пароль'],
			minlength: [6,'Пароль должен быть длиннее 6 символов'],
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

// Хеширование пароля перед сохранением
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
