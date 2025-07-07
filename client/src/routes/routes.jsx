import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import LoginPage from '../pages/Auth/LoginPage'
import RegisterPage from '../pages/Auth/RegisterPage'
import ChatPage from '../pages/Main/ChatPage'
import HomePage from '../pages/Main/HomePage'
export const router = createBrowserRouter([
	{
		path: '/',
		element: <ProtectedRoute />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/chat/:chatId', element: <ChatPage /> }
		]
	},
	{ path: '/login', element: <LoginPage /> },
	{ path: '/register', element: <RegisterPage /> }
])
