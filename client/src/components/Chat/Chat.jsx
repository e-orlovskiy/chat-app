import cn from 'classnames'
import ChatHeader from '../ChatHeader/ChatHeader'
import MessageBlock from '../MessageBlock/MessageBlock'
import styles from './Chat.module.css'

function Chat({ isOpen = true }) {
	return (
		<div className={cn(styles['chat-container'])}>
			{!isOpen && (
				<h2 className={styles['chat-container__title']}>
					start a conversation <br /> :)
				</h2>
			)}
			{isOpen && (
				<div className={cn(styles['chat-window'])}>
					<ChatHeader />
					<div className={styles['chat-window__underline']}></div>
					<div className={styles['chat-window__main']}>
						<MessageBlock />
					</div>
					<div className={styles['chat-window__message-input']}></div>
				</div>
			)}
		</div>
	)
}

export default Chat
