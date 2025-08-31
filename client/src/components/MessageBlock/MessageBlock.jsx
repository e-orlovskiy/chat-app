import cn from 'classnames'
import { formatTime } from '../../utils/formatTime'
import styles from './MessageBlock.module.css'

function MessageBlock({
	messageText,
	author,
	avatar,
	createdAt,
	updatedAt,
	own,
	isLastMessage = false
}) {
	const formattedCreatedAt = formatTime(createdAt)
	const formattedUpdatedAt = formatTime(updatedAt)
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
					src={avatar}
					alt={author?.name}
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
