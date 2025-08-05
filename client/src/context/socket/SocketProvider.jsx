import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { SERVER_URL } from '../../utils/config'
import SocketContext from './socketContext'

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null)

	useEffect(() => {
		const newSocket = io(SERVER_URL, { withCredentials: true })
		setSocket(newSocket)

		return () => newSocket.close()
	}, [])

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
