import cn from 'classnames'
import { memo } from 'react'
import styles from './ChatHeader.module.css'

const ChatHeader = memo(({ interlocutor }) => {
	return (
		<>
			<div className={styles['chat-window__header']}>
				<h2 className={styles['chat-window__title']}>
					{interlocutor
						? `Chat with ${interlocutor.username}`
						: 'Loading chat...'}
				</h2>
				<ul className={styles['chat-window__actions']}>
					<li className={cn(styles['chat-window__action'], styles['active'])}>
						Messages
					</li>
					<li className={styles['chat-window__action']}>Participants</li>
				</ul>
			</div>
			<div className={styles['chat-window__underline']}></div>
		</>
	)
})

export default memo(ChatHeader)
