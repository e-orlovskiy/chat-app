import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearError, loginUser, setError } from '../../features/auth/authSlice'
import { validateLoginForm } from '../../utils/authValidators'
import Button from '../Button/Button'
import Modal from '../Modal/Modal'
import TextInput from '../TextInput/TextInput'
import styles from './Login.module.css'

const Login = ({ formData, setFormData }) => {
	const { email, password } = formData
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { error } = useSelector(state => state.auth)
	const [inactiveBtn, setInactiveBtn] = useState(false)
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
		setInactiveBtn(true)
		setModalContent({ message, type })
		setModalVisibility(true)

		setTimeout(() => {
			dispatch(clearError())
			setInactiveBtn(false)
			setModalVisibility(false)
		}, 3000)
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (error) return

		const validationError = validateLoginForm({ email, password })
		if (validationError && Object.values(validationError).some(error => error)) {
			const errors = Object.values(validationError)
			dispatch(setError(errors))
			return
		}

		try {
			await dispatch(loginUser({ email, password })).unwrap()
			showModal('Login successful', 'success')
			setTimeout(() => navigate('/'), 3000)
		} catch (err) {
			console.log(err)
		}
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
				<Button inactive={inactiveBtn} type='submit'>
					sign in
				</Button>
				<p className={cn(styles['message'])}>
					Don't have an account?{' '}
					<NavLink to='/auth/register' className={cn(styles['link'])}>
						Register
					</NavLink>
				</p>
			</form>

			{modalVisibility && (
				<Modal message={modalContent.message} type={modalContent.type} />
			)}
		</>
	)
}

export default Login
