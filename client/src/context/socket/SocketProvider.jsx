import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { SERVER_URL } from '../../api/config'
import SocketContext from './socketContext'

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null)
	const user = useSelector(state => state.auth.user)

	useEffect(() => {
		if (user && user._id) {
			const newSocket = io(SERVER_URL, {
				withCredentials: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 1000
			})
			setSocket(newSocket)

			return () => newSocket.close()
		}
	}, [user])

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	)
}
