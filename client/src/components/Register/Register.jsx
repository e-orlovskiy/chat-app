import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { registerUser, setError } from '../../features/auth/authSlice'
import { validateRegisterForm } from '../../utils/authValidators'
import Button from '../Button/Button'
import TextInput from '../TextInput/TextInput'
import styles from './Register.module.css'

const Register = ({ formData, setFormData }) => {
	const { username, email, password } = formData
	const dispatch = useDispatch()

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async e => {
		e.preventDefault()

		const validationError = validateRegisterForm({ username, email, password })
		if (
			validationError &&
			Object.values(validationError).some(error => error)
		) {
			dispatch(
				setError({
					type: 'validation',
					message: Object.values(validationError)
				})
			)
			return
		}

		await dispatch(registerUser({ username, email, password })).unwrap()
	}

	return (
		<>
			<form className={cn(styles['form'])} onSubmit={handleSubmit}>
				<h2>Register</h2>
				<TextInput
					name='username'
					value={username}
					onChange={handleChange}
					placeholder='username'
				/>
				<TextInput
					name='email'
					value={email}
					onChange={handleChange}
					placeholder='email'
				/>
				<TextInput
					name='password'
					value={password}
					onChange={handleChange}
					type='password'
					placeholder='password'
				/>
				<Button inactive={false} type='submit'>
					sign up
				</Button>
				<p className={cn(styles['message'])}>
					Already have an account?{' '}
					<NavLink to='/auth/login' className={cn(styles['link'])}>
						Login
					</NavLink>
				</p>
			</form>
		</>
	)
}

export default Register
