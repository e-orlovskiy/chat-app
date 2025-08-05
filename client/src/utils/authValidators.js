export const validateEmail = email => {
	const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	if (!email) return 'Email is required'
	if (email.length > 100) return 'Email must be less than 100 characters'
	if (!regExp.test(email)) return 'Invalid email format'
}

export const validatePassword = password => {
	if (!password) return 'Password is required'
	if (password.length < 6) return 'Password must be at least 6 characters'
	if (password.length > 20) return 'Password must be less than 20 characters'
	return null
}

export const validateUsername = username => {
	if (!username) return 'Username is required'
	if (username.length < 3) return 'Username must be at least 3 characters'
	if (username.length > 20) return 'Username must be less than 20 characters'
	return null
}

export const validateLoginForm = ({ email, password }) => ({
	email: validateEmail(email),
	password: validatePassword(password)
})

export const validateRegisterForm = ({ username, email, password }) => ({
	username: validateUsername(username),
	email: validateEmail(email),
	password: validatePassword(password)
})
