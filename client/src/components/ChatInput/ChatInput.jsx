import cn from 'classnames'
import { IoSend } from 'react-icons/io5'
import styles from './ChatInput.module.css'

function ChatInput() {
	return (
		<div className={cn(styles['chat-input'])}>
			<input className={cn(styles['chat-input__input'])} placeholder='Type your message...' />
			<div className={cn(styles['chat-input__controls'])}>
				<div className={cn(styles['chat-input__send'])}>
					<IoSend />
				</div>
			</div>
		</div>
	)
}

export default ChatInput
