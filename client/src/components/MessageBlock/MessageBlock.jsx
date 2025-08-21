import cn from 'classnames'
import { formatDate } from '../../utils/formatTime'
import styles from './MessageBlock.module.css'

function MessageBlock({ messageText, author, createdAt, updatedAt, own }) {
	const formattedCreatedAt = formatDate(createdAt)
	const formattedUpdatedAt = formatDate(updatedAt)

	return (
		<div className={cn(styles['message'], { [styles['own']]: own })}>
			<img
				className={cn(styles['message__avatar'])}
				src='https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
				alt=''
			/>
			<div className={cn(styles['message__content'])}>
				<div className={cn(styles['message__author-and-date'])}>
					<p className={cn(styles['message__author'])}>
						{own ? 'You,' : `${author},`}
					</p>
					<p className={cn(styles['message__date'])}>{formattedCreatedAt}</p>
				</div>

				<p className={cn(styles['message__text'])}>{messageText}</p>
			</div>
		</div>
	)
}

export default MessageBlock
