import cn from 'classnames'
import { useEffect, useState } from 'react'
import styles from './Modal.module.css'
function Modal({ message, type }) {
	const [visibleMessages, setVisibleMessages] = useState([])

	useEffect(() => {
		if (message) {
			if (Array.isArray(message)) {
				setVisibleMessages(message)
				return
			}
			const messages = message.split('\n').filter(msg => msg && msg.trim)
			setVisibleMessages(messages)
		} else {
			setVisibleMessages([])
		}
	}, [message])

	return (
		<div className={cn(styles['modal'], styles[type])}>
			<h3 className={cn(styles['title'])}>
				{type === 'error' ? 'Error!' : 'Success!'}
			</h3>
			<div className={cn(styles['messages-container'])}>
				{visibleMessages.map((msg, index) => (
					<p key={index + msg} className={cn(styles['message'])}>
						{msg}
					</p>
				))}
			</div>
		</div>
	)
}

export default Modal
