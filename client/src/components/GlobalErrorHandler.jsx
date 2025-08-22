// GlobalErrorHandler.jsx
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const GlobalErrorHandler = () => {
	const navigate = useNavigate()
	const authError = useSelector(state => state.auth.error)
	const chatError = useSelector(state => state.chat.error)

	useEffect(() => {
		console.log('test')
		if (authError?.includes('401') || chatError?.includes('401')) {
			navigate('/auth/login', { replace: true })
		}
	}, [authError, chatError, navigate])

	return null
}

export default GlobalErrorHandler
