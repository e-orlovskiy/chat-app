import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const GlobalErrorHandler = () => {
	const navigate = useNavigate()
	const authError = useSelector(state => state.auth.error)
	const chatError = useSelector(state => state.chat.error)

	useEffect(() => {
		if (authError?.type === 'auth' || chatError?.type === 'auth') {
			navigate('/auth/login', { replace: true })
		}
	}, [authError, chatError, navigate])

	return null
}

export default GlobalErrorHandler
