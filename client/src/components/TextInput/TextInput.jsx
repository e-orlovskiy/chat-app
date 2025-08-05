import cn from 'classnames'
import { useState } from 'react'
import { FaLock, FaLockOpen, FaSearch } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'
import { TbLockPassword, TbUser } from 'react-icons/tb'
import styles from './TextInput.module.css'

function TextInput({ value, onChange, onClick = null, ...props }) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const ICONS_MAP = {
		email: <MdAlternateEmail />,
		password: <TbLockPassword />,
		username: <TbUser />
	}

	const switchPasswordVisibility = () => {
		setIsPasswordVisible(prev => !prev)
	}

	return (
		<div className={cn(styles['input-container'])}>
			<span className={cn(styles['icon'])}>
				{(props.name === 'username' ||
					props.name === 'email' ||
					props.name === 'password') &&
					ICONS_MAP[props.name]}
			</span>
			<input
				{...props}
				value={value}
				onChange={onChange}
				type={props.type === 'password' && !isPasswordVisible ? 'password' : 'text'}
			/>
			{props.type === 'password' && (
				<span
					className={cn(styles['icon'], styles['password-icon'])}
					onClick={switchPasswordVisibility}
				>
					{isPasswordVisible ? <FaLockOpen /> : <FaLock />}
				</span>
			)}
			{props.name === 'search' && (
				<span
					className={cn(styles['icon'], styles['search-icon'])}
					onClick={onClick}
				>
					<FaSearch />
				</span>
			)}
		</div>
	)
}

export default TextInput
