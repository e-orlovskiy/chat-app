import cn from 'classnames'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSocketChat } from '../../hooks/useSocketChats'
import ChatHeader from '../ChatHeader/ChatHeader'
import ChatInput from '../ChatInput/ChatInput'
import MessageBlock from '../MessageBlock/MessageBlock'
import styles from './Chat.module.css'

function Chat({ isOpen = true }) {
	const { chatId } = useParams()
	const { joinChat, leaveChat } = useSocketChat()

	useEffect(() => {
		if (!chatId) return

		joinChat(chatId)

		return () => {
			leaveChat(chatId)
		}
	}, [chatId, joinChat, leaveChat])

	return (
		<div className={cn(styles['chat-container'])}>
			{!isOpen && (
				<h2 className={styles['chat-container__title']}>
					start a conversation <br /> :)
				</h2>
			)}
			{isOpen && (
				<>
					<ChatHeader />
					<p>current chat id: {chatId}</p>
					<div className={cn(styles['chat-window'])}>
						<div className={styles['chat-window__main']}>
							<MessageBlock />
						</div>

						<ChatInput />
					</div>
				</>
			)}
		</div>
	)
}

export default Chat
