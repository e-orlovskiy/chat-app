import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { getHasRefreshFailed, resetRefreshFlag } from '../api/axios'
import { checkAuth } from '../features/auth/authSlice'

const ProtectedRoute = () => {
	const dispatch = useDispatch()
	const { user, status } = useSelector(state => state.auth)

	useEffect(() => {
		if (status === 'idle' && !getHasRefreshFailed()) dispatch(checkAuth())
	}, [dispatch, status])

	if (status === 'loading' && !user) {
		return <p>Loading...</p>
	}
	if (status === 'failed' && !user) {
		return <Navigate to='/auth/login' replace />
	}
	if (status === 'succeeded' && !user) {
		return <Navigate to='/auth/login' replace />
	}
	if (status === 'succeeded' && user) {
		resetRefreshFlag()
		return <Outlet />
	}
}

export default ProtectedRoute
