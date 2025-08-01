import cn from 'classnames'
import { IoIosAdd } from 'react-icons/io'
import { LuSettings2 } from 'react-icons/lu'
import ChatList from '../ChatList/ChatList'
import styles from './MyChats.module.css'

function MyChats({ searchFocused, searchTerm, inputValue }) {
	return (
		<div className={cn(styles['chats-container'])}>
			<div className={cn(styles['chats-info'])}>
				{!searchFocused && <h4 className={cn(styles['chats-title'])}>chats</h4>}
				{searchFocused && (
					<h4 className={cn(styles['chats-title'], cn(styles['searchingDots']))}>searching</h4>
				)}
				<div className={cn(styles['chats-controls'])}>
					<IoIosAdd className={cn(styles['chat-controls__icon'])} />
					<LuSettings2 className={cn(styles['chat-controls__icon'])} />
				</div>
			</div>
			<ChatList searchFocused={searchFocused} searchTerm={searchTerm} inputValue={inputValue} />
		</div>
	)
}

export default MyChats
