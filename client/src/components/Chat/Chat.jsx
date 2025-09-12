// components/Chat/Chat.js
import cn from 'classnames'
import { BsLayoutSidebarInset } from 'react-icons/bs'
import defaultAvatar from '../../assets/default-avatar.avif'
import { useChat } from '../../hooks/useChat'
import { groupMessages } from '../../utils/groupMessages'
import ChatHeader from '../ChatHeader/ChatHeader'
import ChatInput from '../ChatInput/ChatInput'
import MessageBlock from '../MessageBlock/MessageBlock'
import styles from './Chat.module.css'

function Chat() {
	const {
		currentChat,
		chatStatus,
		chatMessages,
		messageText,
		setMessageText,
		messagesEndRef,
		messagesTopRef,
		scrollContainerRef,
		handleToggleSidebar,
		handleSendMessage,
		currentUser
	} = useChat()

	if (chatStatus === 'loading') {
		return <div className={styles.loadingContainer}>Loading chat...</div>
	}

	return (
		<div className={cn(styles['chat-container'])}>
			{!currentChat ? (
				<>
					<div
						className={styles['chat-container__show-sidebar-mobile']}
						onClick={handleToggleSidebar}
					>
						<BsLayoutSidebarInset />
					</div>
					<h2 className={styles['chat-container__title']}>
						start a conversation <br /> :)
					</h2>
				</>
			) : (
				<>
					<ChatHeader chat={currentChat} />
					<div className={cn(styles['chat-window'])}>
						<div
							className={styles['chat-window__main']}
							ref={scrollContainerRef}
						>
							<div style={{ minHeight: '1px' }} ref={messagesTopRef} />

							{groupMessages(chatMessages, { thresholdMs: 5 * 60 * 1000 }).map(
								dateGroup => (
									<div key={dateGroup.dateKey} className={styles['date-group']}>
										<div className={styles['date-group__header']}>
											{dateGroup.dateLabel}
										</div>

										{dateGroup.userGroups.map(g =>
											g.messages.map((message, index) => {
												const isLastMessage = index === g.messages.length - 1
												const isFirstMessage = index === 0

												return (
													<MessageBlock
														key={message._id}
														messageText={message.text}
														author={message.author?.username || 'unknown'}
														avatar={
															message.author?.avatar?.url || defaultAvatar
														}
														createdAt={message.createdAt}
														updatedAt={message.updatedAt}
														own={message.author?._id === currentUser._id}
														isLastMessage={isLastMessage}
														isFirstMessage={isFirstMessage}
													/>
												)
											})
										)}
									</div>
								)
							)}

							<div ref={messagesEndRef} />
						</div>

						<ChatInput
							messageText={messageText}
							setMessageText={setMessageText}
							onSendMessage={handleSendMessage}
						/>
					</div>
				</>
			)}
		</div>
	)
}

export default Chat
