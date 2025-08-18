import cn from 'classnames'
import { IoSend } from 'react-icons/io5'
import styles from './ChatInput.module.css'

function ChatInput({ messageText, setMessageText, onSendMessage }) {
	const handleSend = () => {
		if (messageText.trim()) {
			onSendMessage(messageText)
			setMessageText('')
		}
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter') handleSend()
	}

	return (
		<div className={cn(styles['chat-input'])}>
			<input
				className={cn(styles['chat-input__input'])}
				placeholder='Type your message...'
				value={messageText}
				onChange={e => setMessageText(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<div className={cn(styles['chat-input__controls'])}>
				<div className={cn(styles['chat-input__send'])} onClick={handleSend}>
					<IoSend />
				</div>
			</div>
		</div>
	)
}

export default ChatInput
