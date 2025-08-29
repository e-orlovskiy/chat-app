import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
	clearError as authClearError,
	clearNotification as authClearNotification,
	fullReset as authFullReset
} from '../features/auth/authSlice'
import {
	clearError as chatClearError,
	clearNotification as chatClearNotification,
	fullReset as chatFullReset
} from '../features/chat/chatSlice'
import Modal from './Modal/Modal'

const GlobalNotificationHandler = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const authError = useSelector(state => state.auth.error)
	const authNotification = useSelector(state => state.auth.notification)
	const chatError = useSelector(state => state.chat.error)
	const chatNotification = useSelector(state => state.chat.notification)

	useEffect(() => {
		const notification = authNotification || chatNotification
		const error = authError || chatError

		if (!notification && !error) return

		const timer = setTimeout(() => {
			if (authError) dispatch(authClearError())
			if (chatError) dispatch(chatClearError())
			if (authNotification) dispatch(authClearNotification())
			if (chatNotification) dispatch(chatClearNotification())

			if (authError?.type === 'auth' || chatError?.type === 'auth') {
				dispatch(authFullReset())
				dispatch(chatFullReset())
				navigate('/auth/login', { replace: true })
			}

			if (
				authNotification?.type === 'success' &&
				(authNotification.message.includes('Login') ||
					authNotification.message.includes('Registration'))
			) {
				navigate('/', { replace: true })
			}
		}, 3000)

		return () => clearTimeout(timer)
	}, [
		authError,
		chatError,
		authNotification,
		chatNotification,
		dispatch,
		navigate
	])

	const notification =
		authError || chatError || authNotification || chatNotification
	if (!notification) return null

	return (
		<Modal
			message={notification.message}
			type={authError || chatError ? 'error' : 'success'}
		/>
	)
}

export default GlobalNotificationHandler
