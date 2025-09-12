import cn from 'classnames'
import { memo, useMemo } from 'react'
import { BsLayoutSidebarInset } from 'react-icons/bs'
import { TbTableOptions } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { setShowSidebarMobile } from '../../features/chat/chatSlice'
import styles from './ChatHeader.module.css'

const ChatHeader = memo(({ chat }) => {
	const dispatch = useDispatch()
	const showSidebarMobile = useSelector(state => state.chat.showSidebarMobile)
	const currentUser = useSelector(state => state.auth.user)

	const interlocutor = useMemo(() => {
		if (!chat?.members || !currentUser) return null
		return chat.members.find(member => member._id !== currentUser._id) || null
	}, [chat, currentUser])

	const handleToggleSidebar = () => {
		dispatch(setShowSidebarMobile(!showSidebarMobile))
	}

	return (
		<>
			<div className={styles['chat-window__header']}>
				<div className={styles['chat-window__title-container']}>
					<div
						className={styles['chat-window__show-sidebar-mobile']}
						onClick={handleToggleSidebar}
					>
						<BsLayoutSidebarInset />
					</div>
					<h2 className={styles['chat-window__title']}>
						{interlocutor ? interlocutor?.username : 'Loading chat...'}
					</h2>
				</div>
				<div className={styles['chat-window__actions-icon']}>
					<TbTableOptions />
				</div>
				<ul className={styles['chat-window__actions']}>
					<li className={cn(styles['chat-window__action'], styles['active'])}>
						Messages
					</li>
					<li
						className={cn(
							styles['chat-window__action'],
							styles['participants']
						)}
					>
						Participants
					</li>
				</ul>
			</div>
			<div className={styles['chat-window__underline']}></div>
		</>
	)
})

export default memo(ChatHeader)
