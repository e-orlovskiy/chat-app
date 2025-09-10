import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { loginUser, setError } from '../../features/auth/authSlice'
import { validateLoginForm } from '../../utils/authValidators'
import Button from '../Button/Button'
import TextInput from '../TextInput/TextInput'
import styles from './Login.module.css'

const Login = ({ formData, setFormData }) => {
	const { email, password } = formData
	const dispatch = useDispatch()

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const validationError = validateLoginForm({ email, password })

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

		await dispatch(loginUser({ email, password })).unwrap()
	}

	return (
		<>
			<form className={cn(styles['form'])} onSubmit={handleSubmit}>
				<h2>Login</h2>
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
					sign in
				</Button>
				<p className={cn(styles['message'])}>
					Don't have an account?{' '}
					<NavLink to='/auth/register' className={cn(styles['link'])}>
						Register
					</NavLink>
				</p>
			</form>
		</>
	)
}

export default Login
