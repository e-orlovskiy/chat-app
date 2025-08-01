import cn from 'classnames'
import Chat from '../../components/Chat/Chat'
import Sidebar from '../../components/Sidebar/Sidebar'
import styles from './MainLayout.module.css'

function MainLayout() {
	return (
		<div className={cn(styles['main-layout'])}>
			<div className={cn(styles['main-layout__container'])}>
				<Sidebar />
				<Chat />
			</div>
		</div>
	)
}

export default MainLayout
