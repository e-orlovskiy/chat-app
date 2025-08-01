import cn from 'classnames'
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
					<div className={styles['chat-window__header']}>
						<h2 className={styles['chat-window__title']}>Chat with John Doe</h2>
					</div>
					<div className={styles['chat-window__underline']}></div>
					<div className={styles['chat-window__main']}></div>
					<div className={styles['chat-window__message-input']}></div>
				</div>
			)}
		</div>
	)
}

export default Chat
