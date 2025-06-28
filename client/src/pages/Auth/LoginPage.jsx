import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import { loginUser } from '../../features/auth/authSlice'
import styles from './AuthStyle.module.css'

const LoginPage = () => {
//	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = async e => {
		e.preventDefault()
		
		const res = (await dispatch(loginUser({ email, password })).unwrap())
			//navigate('/home')
	}

	return (
		<div className={styles["wrapper"]}>
		<h2>Login</h2>
		<form onSubmit={(e) => handleSubmit(e)}>
		  <div className={styles["input-box"]}>
			<input type="text" placeholder="Enter your name"/>
		  </div>
		  <div className={styles["input-box"]}>
			<input type="text" placeholder="Enter your email"/>
		  </div>
		  <div className={styles["input-box"]}>
			<input type="password" placeholder="Enter your password"/>
		  </div>
		  <div className={`${styles["input-box"]} ${styles["submit-button"]}`}>
			<input type="Submit" value="Register Now"/>
		  </div>
		  <div className={styles["text"]}>
			<h3>Don't have an account yet? <NavLink to="/register">Register now</NavLink></h3>
		  </div>
		</form>
	  </div>
	)
}

export default LoginPage
