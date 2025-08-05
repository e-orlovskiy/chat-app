import cn from 'classnames'
import styles from './MessageBlock.module.css'

function MessageBlock() {
	return (
		<div className={cn(styles['message'])}>
			<div className={cn(styles['message__author-and-date'])}>
				<p className={cn(styles['message__author'])}>John Doe</p>
				<p className={cn(styles['message__date'])}>12:34</p>
			</div>

			<div className={cn(styles['message__avatar-and-text'])}>
				<img
					className={cn(styles['message__avatar'])}
					src='https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
					alt=''
				/>
				<p className={cn(styles['message__text'])}>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, dignissimos
					recusandae quos nisi ad iusto est sapiente molestiae sit rem. Ipsa, reiciendis molestias
					dicta voluptatem voluptates odit necessitatibus impedit totam!
				</p>
			</div>
		</div>
	)
}

export default MessageBlock
