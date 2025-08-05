import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearError, registerUser, setError } from '../../features/auth/authSlice'
import { validateRegisterForm } from '../../utils/authValidators'
import Button from '../Button/Button'
import Modal from '../Modal/Modal'
import TextInput from '../TextInput/TextInput'
import styles from './Register.module.css'

const Register = ({ formData, setFormData }) => {
	const { username, email, password } = formData
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const error = useSelector(state => state.auth.error)
	const [modalVisibility, setModalVisibility] = useState(false)
	const [modalContent, setModalContent] = useState({ message: '', type: '' })

	useEffect(() => {
		if (error) showModal(error, 'error')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error])

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const showModal = (message, type) => {
		setModalContent({ message, type })
		setModalVisibility(true)

		setTimeout(() => {
			dispatch(clearError())
			setModalVisibility(false)
		}, 3000)
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (error) return

		const validationError = validateRegisterForm({ username, email, password })
		if (validationError && Object.values(validationError).some(error => error)) {
			const errors = Object.values(validationError)
			dispatch(setError(errors))
			return
		}

		try {
			await dispatch(registerUser({ username, email, password })).unwrap()
			showModal('Register successful', 'success')
			setTimeout(() => navigate('/'), 3000)
		} catch (err) {
			console.log(err)
		}
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
				<Button inactive={error} type='submit'>
					sign up
				</Button>
				<p className={cn(styles['message'])}>
					Already have an account?{' '}
					<NavLink to='/auth/login' className={cn(styles['link'])}>
						Login
					</NavLink>
				</p>
			</form>

			{modalVisibility && (
				<Modal message={modalContent.message} type={modalContent.type} />
			)}
		</>
	)
}

export default Register
