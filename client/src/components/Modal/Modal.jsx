import cn from 'classnames'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

function Modal({ type, message }) {
	const [visibleMessages, setVisibleMessages] = useState([])

	const modalRoot = document.getElementById('modal-root')

	useEffect(() => {
		if (message) {
			const messages = Array.isArray(message)
				? message
				: message.split('\n').filter(msg => msg && msg.trim)
			setVisibleMessages(messages)
		}
	}, [message])

	if (!modalRoot) return null

	return createPortal(
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
		</div>,
		modalRoot
	)
}

export default Modal
