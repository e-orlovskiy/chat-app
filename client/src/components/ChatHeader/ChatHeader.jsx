import cn from 'classnames'
import styles from './ChatHeader.module.css'

function ChatHeader() {
	return (
		<div className={styles['chat-window__header']}>
			<h2 className={styles['chat-window__title']}>Chat with John Doe</h2>
			<ul className={styles['chat-window__actions']}>
				<li className={cn(styles['chat-window__action'], styles['active'])}>Messages</li>
				<li className={styles['chat-window__action']}>Participants</li>
			</ul>
		</div>
	)
}

export default ChatHeader
