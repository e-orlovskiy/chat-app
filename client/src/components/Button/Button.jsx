import cn from 'classnames'
import styles from './Button.module.css'

function Button({ children, onClick, inactive = false, ...props }) {
	const handleClick = e => {
		if (!inactive && onClick) {
			onClick(e)
		}
	}

	return (
		<button
			className={cn(styles.button, {
				[styles.inactive]: inactive
			})}
			onClick={handleClick}
			disabled={inactive}
			aria-disabled={inactive}
			{...props}
		>
			<span className={styles.content}>{children}</span>
			{inactive && <div className={styles.overlay} />}
		</button>
	)
}

export default Button
