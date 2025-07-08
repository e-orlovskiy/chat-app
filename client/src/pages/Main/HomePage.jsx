import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createChat, joinPublicChat, fetchChats } from '../../features/chat/chatSlice'
import { getAllUsers } from '../../features/users/usersSlice'
import styles from './MainPages.module.css'

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
			const ExistingChats = await dispatch(fetchChats()).unwrap()
			const ExistingChat = ExistingChats.find((el) => el.members.includes(user._id) && el.members.includes(otherUserId))
			if(ExistingChat){
				navigate(`/chat/${ExistingChat.id}`)
			}
			else{
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
		}
		} catch (err) {
			alert(err.message)
		}
	}

	return (
		<div className={styles["wrapper"]}>
			<span className={styles["header"]}>Добро пожаловать, {user.username}</span>
			<div className={styles['usersList']}>
				<h3>Пользователи:</h3>
				<ul>
					{users.map((el,i,arr) => 
						(i+1)%2!=0 ?
						(
						<li key={el._id}>
							<div onClick={() => startChat(el._id)}>
							{el.username} 
							</div>
							{arr[i+1] ?
							<div onClick={() => startChat(arr[i+1]._id)}>
							{arr[i+1].username} 
							</div> : null}
						</li> 
					) : null)}
				</ul>
			</div>
		</div>
	)
}

export default HomePage
