import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadUserAvatar } from '../../features/users/usersSlice'
import styles from './UserAvatar.module.css'

function UserAvatar({ user = {}, currentStatus = {} }) {
	const dispatch = useDispatch()
	const inputRef = useRef(null)

	const [localPreview, setLocalPreview] = useState(null)

	const uploadProgress = useSelector(
		state => state.users.uploadUserAvatarProgress
	)
	const uploadStatus = useSelector(state => state.users.uploadUserAvatarStatus)
	const avatarUrl = useSelector(state => state.users?.userAvatar?.url)

	useEffect(() => {
		if (uploadStatus === 'succeeded') {
			if (
				localPreview &&
				localPreview.startsWith &&
				localPreview.startsWith('blob:')
			) {
				try {
					URL.revokeObjectURL(localPreview)
				} catch (e) {
					/* ignore */
				}
			}
			setLocalPreview(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uploadStatus])

	useEffect(() => {
		return () => {
			if (
				localPreview &&
				localPreview.startsWith &&
				localPreview.startsWith('blob:')
			) {
				try {
					URL.revokeObjectURL(localPreview)
				} catch (e) {
					/* ignore */
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleOpenPicker = () => {
		inputRef.current?.click()
	}

	const handleFileChange = e => {
		const f = e.target.files?.[0]
		if (!f) return

		const allowed = ['image/png', 'image/jpeg', 'image/webp']
		if (!allowed.includes(f.type)) {
			alert('Разрешены только PNG/JPEG/WebP')
			e.target.value = null
			return
		}
		const maxSize = 5 * 1024 * 1024
		if (f.size > maxSize) {
			alert('Максимальный размер 5MB')
			e.target.value = null
			return
		}

		const obj = URL.createObjectURL(f)
		setLocalPreview(obj)

		dispatch(uploadUserAvatar(f))

		e.target.value = null
	}

	const usernameFirst =
		user?.username && user.username[0] ? user.username[0].toUpperCase() : '?'

	return (
		<div className={cn(styles['user-avatar-container'])}>
			<div className={cn(styles['user-avatar'])}>
				{avatarUrl ? (
					<img
						className={cn(styles['user-avatar__img'])}
						src={avatarUrl}
						alt={`${user?.username || 'User'} avatar`}
					/>
				) : (
					<span>{usernameFirst}</span>
				)}
				<div
					className={cn(styles['status-indicator'])}
					style={{ backgroundColor: currentStatus?.color || 'gray' }}
				/>
			</div>

			<div style={{ marginTop: 8 }}>
				<input
					ref={inputRef}
					type='file'
					accept='image/png,image/jpeg,image/webp'
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
				<button
					type='button'
					onClick={handleOpenPicker}
					disabled={uploadStatus === 'loading'}
				>
					{uploadStatus === 'loading' ? 'Загрузка...' : 'Загрузить аватар'}
				</button>
			</div>

			{uploadProgress > 0 && uploadProgress < 100 && (
				<div style={{ marginTop: 8, width: 160 }}>
					<div
						style={{
							height: 8,
							background: '#eee',
							borderRadius: 4,
							overflow: 'hidden'
						}}
					>
						<div
							style={{
								width: `${uploadProgress}%`,
								height: '100%',
								background: '#4caf50',
								transition: 'width 200ms linear'
							}}
						/>
					</div>
					<div style={{ fontSize: 12, marginTop: 4 }}>{uploadProgress}%</div>
				</div>
			)}
		</div>
	)
}

export default UserAvatar
