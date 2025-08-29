import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import Chat from '../components/Chat/Chat'
import GlobalNotificationHandler from '../components/GlobalNotificationHandler'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../layouts/MainLayout/MainLayout'
import Auth from '../pages/Auth/Auth'
import NotFound from '../pages/NotFound/NotFound'

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<>
				<Outlet />
				<GlobalNotificationHandler />
			</>
		),
		children: [
			{
				path: '/',
				element: <ProtectedRoute />,
				children: [
					{
						path: '/',
						element: <MainLayout />,
						children: [
							{
								path: 'chat/:chatId',
								element: <Chat />
							}
						]
					}
				]
			},
			{
				path: '/auth',
				element: <Auth />,
				children: [
					{ index: true, element: <Navigate to='login' replace /> },
					{ path: 'login', element: <Auth /> },
					{ path: 'register', element: <Auth /> }
				]
			},
			{
				path: '*',
				element: <NotFound />
			}
		]
	}
])
