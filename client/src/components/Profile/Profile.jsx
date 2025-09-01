import cn from 'classnames'
import { useState } from 'react'
import { IoIosArrowDown, IoIosSettings } from 'react-icons/io'
import { MdDarkMode, MdLightMode, MdOutlineExitToApp } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../../context/socket/useSocket'
import { useTheme } from '../../context/theme/useTheme'
import { logoutUser } from '../../features/auth/authSlice'
import UserAvatar from '../UserAvatar/UserAvatar'
import styles from './Profile.module.css'

const statusOptions = [
	{ value: 'online', color: 'var(--color-text-status-online)' },
	{ value: 'busy', color: 'var(--color-text-status-busy)' },
	{ value: 'offline', color: 'var(--color-text-status-offline)' }
]

const Profile = () => {
	const [isSettingsDropDownOpen, setIsSettingsDropDownOpen] = useState(false)
	const [isStatusDropDownOpen, setIsStatusDropDownOpen] = useState(false)
	const [currentStatus, setCurrentStatus] = useState(statusOptions[0])

	const { user } = useSelector(state => state.auth)
	const dispatch = useDispatch()
	const { theme, toggleTheme } = useTheme()
	const socket = useSocket()

	const navigate = useNavigate()

	const handleLogout = () => {
		navigate('/auth/login')
		dispatch(logoutUser())
	}

	const handleToggleSettingsDropdown = () =>
		setIsSettingsDropDownOpen(prev => !prev)
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
				<ul
					className={cn(settingsDropdownClasses, styles['settings-dropdown'])}
				>
					<li onClick={toggleTheme}>
						<ThemeIcon className={cn(styles['dropdown__icon'])} />
					</li>
					<li onClick={handleLogout}>
						<MdOutlineExitToApp className={cn(styles['dropdown__icon'])} />
					</li>
				</ul>
			</div>

			{/* User profile */}
			<UserAvatar user={user} currentStatus={currentStatus} />

			{/* User info */}
			<div className={cn(styles['profile-info'])}>
				<p className={cn(styles['profile-name'])}>{user.username}</p>

				{/* Status dropdown */}
				<div className={cn(styles['status-container'])}>
					<div
						className={cn(
							styles['profile-status'],
							cn(styles[currentStatus.value])
						)}
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
								className={cn(
									styles['status-option'],
									{
										[styles['active']]: option.value === currentStatus.value
									},
									cn(styles[option.value])
								)}
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
