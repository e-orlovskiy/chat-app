import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../layouts/MainLayout/MainLayout'
import Auth from '../pages/Auth/Auth'
import NotFound from '../pages/NotFound/NotFound'
export const router = createBrowserRouter([
	{
		path: '/',
		element: <ProtectedRoute />,
		children: [
			{
				path: '/',
				element: <MainLayout />,
				children: [{ path: '/chat/:chatId', element: <div>TempChat</div> }]
			}
		]
	},
	{
		path: '/auth',
		element: <Auth />,
		children: [
			{ index: true, element: <Navigate to='/auth/login' replace /> },
			{ path: '/auth/login', element: <Auth /> },
			{ path: '/auth/register', element: <Auth /> }
		]
	},
	{
		path: '*',
		element: <NotFound />
	}
])
