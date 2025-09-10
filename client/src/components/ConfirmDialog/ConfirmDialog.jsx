import { createPortal } from 'react-dom'
import { IoClose } from 'react-icons/io5'
import defaultAvatar from '../../assets/default-avatar.avif'
import Button from '../Button/Button'
import styles from './ConfirmDialog.module.css'

function ConfirmDialog({
	message,
	onConfirm,
	onCancel,
	isOpen = false,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	user
}) {
	const modalRoot = document.getElementById('modal-root')

	if (!modalRoot || !isOpen) return null

	return createPortal(
		isOpen && (
			<div className={styles['dialog-wrapper']}>
				<div className={styles['dialog']}>
					<div className={styles['dialog__close-icon']} onClick={onCancel}>
						<IoClose />
					</div>
					<p className={styles['dialog__message']}>{message}</p>
					{user && (
						<div className={styles['dialog__user-info']}>
							<img
								className={styles['dialog__user-avatar']}
								src={user.avatar?.url || defaultAvatar}
								alt={user.name}
							/>
							<p className={styles['dialog__user-name']}>{user.name}</p>
						</div>
					)}
					<div className={styles['dialog__buttons']}>
						<Button className={styles['dialog__button']} onClick={onCancel}>
							{cancelText}
						</Button>
						<Button className={styles['dialog__button']} onClick={onConfirm}>
							{confirmText}
						</Button>
					</div>
				</div>
			</div>
		),
		modalRoot
	)
}

export default ConfirmDialog
