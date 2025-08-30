import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { ImSpinner3 } from 'react-icons/im'
import { MdOutlineFileUpload } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { setError, uploadUserAvatar } from '../../features/auth/authSlice'
import { validateImage } from '../../utils/uploadImageValidators'
import styles from './UserAvatar.module.css'

function UserAvatar({ user = {}, currentStatus = {} }) {
	const dispatch = useDispatch()
	const inputRef = useRef(null)

	const [localPreview, setLocalPreview] = useState(null)

	const uploadStatus = useSelector(state => state.auth.uploadUserAvatarStatus)
	const avatarUrl = useSelector(state => state.auth.user?.avatar?.url)

	useEffect(() => {
		if (uploadStatus === 'succeeded') {
			if (
				localPreview &&
				localPreview.startsWith &&
				localPreview.startsWith('blob:')
			) {
				URL.revokeObjectURL(localPreview)
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
				URL.revokeObjectURL(localPreview)
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

		const validationError = validateImage(f)
		if (
			validationError &&
			Object.values(validationError).some(error => error)
		) {
			dispatch(setError({ type: 'validation', message: validationError }))
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
				<div>
					<input
						ref={inputRef}
						type='file'
						accept='image/png,image/jpeg,image/webp'
						style={{ display: 'none' }}
						onChange={handleFileChange}
					/>
					<button
						className={cn(styles['upload-avatar-button'], {
							[styles['loading']]: uploadStatus === 'loading'
						})}
						type='button'
						onClick={handleOpenPicker}
						disabled={uploadStatus === 'loading'}
					>
						{uploadStatus === 'loading' ? (
							<ImSpinner3 className={cn(styles['spinner'])} />
						) : (
							<MdOutlineFileUpload />
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default UserAvatar
