import cn from 'classnames'
import { formatDate } from '../../utils/formatTime'
import styles from './MessageBlock.module.css'

function MessageBlock({
	messageText,
	author,
	createdAt,
	updatedAt,
	own,
	isLastMessage = false
}) {
	const formattedCreatedAt = formatDate(createdAt)
	const formattedUpdatedAt = formatDate(updatedAt)
	const authorLabel = own ? 'You' : author || 'Unknown'

	return (
		<div
			className={cn(
				styles['message'],
				{ [styles['own']]: own },
				{ [styles['last-message']]: isLastMessage }
			)}
			tabIndex={0}
			title={authorLabel}
		>
			{isLastMessage ? (
				<img
					className={cn(styles['message__avatar'])}
					src='https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
					alt=''
				/>
			) : (
				<div className={cn(styles['message__temp-blank'])} />
			)}

			<div className={cn(styles['message__content'])}>
				<div className={cn(styles['message__text-container'])}>
					<span className={cn(styles['message__text'])}>{messageText}</span>
					<p className={cn(styles['message__date'])}>{formattedUpdatedAt}</p>
				</div>
			</div>
		</div>
	)
}

export default MessageBlock
