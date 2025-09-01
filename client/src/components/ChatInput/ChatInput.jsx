import cn from 'classnames'
import { useEffect, useRef } from 'react'
import { IoSend } from 'react-icons/io5'
import styles from './ChatInput.module.css'

function ChatInput({ messageText, setMessageText, onSendMessage }) {
	const textareaRef = useRef(null)

	const handleSend = () => {
		if (messageText.trim()) {
			onSendMessage(messageText)
			setMessageText('')
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto'
			}
		}
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height =
				Math.min(textareaRef.current.scrollHeight, 100) + 'px'
		}
	}, [messageText])

	const isSendDisabled = !messageText.trim()

	return (
		<div className={cn(styles['chat-input'])}>
			<textarea
				ref={textareaRef}
				className={cn(styles['chat-input__input'])}
				placeholder='Message...'
				value={messageText}
				onChange={e => setMessageText(e.target.value)}
				onKeyDown={handleKeyDown}
				rows={1}
			/>
			<div className={cn(styles['chat-input__controls'])}>
				<button
					className={cn(styles['chat-input__send'])}
					onClick={handleSend}
					disabled={isSendDisabled}
					type='button'
				>
					<IoSend />
				</button>
			</div>
		</div>
	)
}

export default ChatInput
