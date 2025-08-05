import cn from 'classnames'
import { useState } from 'react'
import { IoIosArrowDown, IoIosSettings } from 'react-icons/io'
import { MdDarkMode, MdLightMode, MdOutlineExitToApp } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../../context/socket/useSocket'
import { useTheme } from '../../context/theme/useTheme'
import { logout } from '../../features/auth/authSlice'
import styles from './Profile.module.css'

const statusOptions = [
	{ value: 'online', color: 'var(--green-color)' },
	{ value: 'busy', color: 'var(--red-color)' },
	{ value: 'offline', color: 'var(--input-text-light-color)' }
]

const Profile = () => {
	// States
	const [isSettingsDropDownOpen, setIsSettingsDropDownOpen] = useState(false)
	const [isStatusDropDownOpen, setIsStatusDropDownOpen] = useState(false)
	const [currentStatus, setCurrentStatus] = useState(statusOptions[0])

	// Selectors
	const { user } = useSelector(state => state.auth)
	const dispatch = useDispatch()
	const { theme, toggleTheme } = useTheme()
	const socket = useSocket()

	// Handlers
	const handleLogout = () => dispatch(logout())

	const handleToggleSettingsDropdown = () => setIsSettingsDropDownOpen(prev => !prev)
	const handleToggleStatusDropdown = e => {
		e.stopPropagation()
		setIsStatusDropDownOpen(prev => !prev)
	}

	const handleStatusChange = (status, e) => {
		e.stopPropagation()
		const selectedStatus = statusOptions.find(opt => opt.value === status)
		setCurrentStatus(selectedStatus)
		setIsStatusDropDownOpen(false)

		if (socket) {
			socket.emit('changeStatus', {
				userId: user._id,
				status
			})
		}
	}

	// Derived values
	const ThemeIcon = theme === 'light' ? MdDarkMode : MdLightMode
	const containerClasses = cn(styles['profile-container'])
	const settingsContainerClasses = cn(styles['settings-container'], {
		[styles.active]: isSettingsDropDownOpen
	})
	const settingsDropdownClasses = cn(styles['dropdown'], {
		[styles['is-open']]: isSettingsDropDownOpen
	})
	const statusDropdownClasses = cn(styles['dropdown'], {
		[styles['is-open']]: isStatusDropDownOpen
	})

	return (
		<div className={containerClasses}>
			{/* Settings dropdown */}
			<div
				className={settingsContainerClasses}
				onClick={handleToggleSettingsDropdown}
			>
				<IoIosSettings className={cn(styles['settings-icon'])} />
				<ul className={cn(settingsDropdownClasses, styles['settings-dropdown'])}>
					<li onClick={toggleTheme}>
						<ThemeIcon className={cn(styles['dropdown__icon'])} />
					</li>
					<li onClick={handleLogout}>
						<MdOutlineExitToApp className={cn(styles['dropdown__icon'])} />
					</li>
				</ul>
			</div>

			{/* User profile */}
			<div className={cn(styles['profile-avatar-container'])}>
				<div className={cn(styles['profile-avatar'])}>
					<span>{user.username[0].toUpperCase()}</span>
					<div
						className={cn(styles['status-indicator'])}
						style={{ backgroundColor: currentStatus.color }}
					/>
				</div>
			</div>

			{/* User info */}
			<div className={cn(styles['profile-info'])}>
				<p className={cn(styles['profile-name'])}>{user.username}</p>

				{/* Status dropdown */}
				<div className={cn(styles['status-container'])}>
					<div
						className={cn(styles['profile-status'])}
						onClick={handleToggleStatusDropdown}
					>
						{currentStatus.value}
						<IoIosArrowDown
							className={cn(styles['status-arrow'], {
								[styles['arrow-open']]: isStatusDropDownOpen
							})}
						/>
					</div>

					<ul className={cn(statusDropdownClasses, styles['status-dropdown'])}>
						{statusOptions.map(option => (
							<li
								key={option.value}
								className={cn(styles['status-option'], {
									[styles['active']]: option.value === currentStatus.value
								})}
								onClick={e => handleStatusChange(option.value, e)}
								style={{ '--status-color': option.color }}
							>
								{option.value}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Profile
