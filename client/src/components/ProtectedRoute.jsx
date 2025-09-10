import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { getHasRefreshFailed, resetRefreshFlag } from '../api/axios'
import { checkAuth } from '../features/auth/authSlice'

const ProtectedRoute = () => {
	const dispatch = useDispatch()
	const { user, status, hasChecked } = useSelector(state => state.auth)

	useEffect(() => {
		if (!hasChecked && status === 'idle' && !getHasRefreshFailed()) {
			dispatch(checkAuth())
		}
	}, [dispatch, status, hasChecked])

	if (status === 'loading') {
		return <p>Loading...</p>
	}

	if (hasChecked && !user) {
		return <Navigate to='/auth/login' replace />
	}

	if (hasChecked && user) {
		resetRefreshFlag()
		return <Outlet />
	}

	return <p>Loading...</p>
}

export default ProtectedRoute
