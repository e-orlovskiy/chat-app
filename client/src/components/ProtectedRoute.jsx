import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { checkAuth } from '../features/auth/authSlice'

const ProtectedRoute = () => {
	const dispatch = useDispatch()
	const { user, status } = useSelector(state => state.auth)

	useEffect(() => {
		if (status === 'idle') dispatch(checkAuth())
	}, [dispatch, status])

	if (status === 'loading') return <p>Loading...</p>
	if (!user) return <Navigate to='/auth/login' replace />

	return <Outlet />
}

export default ProtectedRoute
