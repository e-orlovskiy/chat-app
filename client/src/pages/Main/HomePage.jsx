import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createChat, joinPublicChat } from '../../features/chat/chatSlice'
import { getAllUsers } from '../../features/users/usersSlice'

const HomePage = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { user } = useSelector(state => state.auth)
	const { users } = useSelector(state => state.users)

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				await dispatch(getAllUsers()).unwrap()
			} catch (err) {
				alert(err.message)
			}
		}
		fetchUsers()
	}, [dispatch])

	const startChat = async otherUserId => {
		try {
			const createdChat = await dispatch(
				createChat({
					title: 'unnamed',
					privacy: 'public',
					password: null,
					members: [user._id, otherUserId]
				})
			).unwrap()
			alert('Чат создан')
			console.log(createdChat)
			const chatId = createdChat._id
			await dispatch(joinPublicChat(chatId)).unwrap()
			navigate(`/chat/${chatId}`)
		} catch (err) {
			alert(err.message)
		}
	}

	return (
		<div>
			<h2>Добро пожаловать, {user.username}</h2>
			<h3>Пользователи:</h3>
			<ul>
				{users.map(u => (
					<li key={u._id}>
						{u.username} <button onClick={() => startChat(u._id)}>Чат</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default HomePage
