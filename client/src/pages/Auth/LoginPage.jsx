import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import { loginUser } from '../../features/auth/authSlice'
import styles from './AuthStyle.module.css'

const LoginPage = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState([])
	const [errsTimeout, setErrsTimeOut] = useState()

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			await dispatch(loginUser({ email, password })).unwrap()
			navigate('/')
		} catch (error) {
			setErrors(['Неверный email или пароль'])
			setErrsTimeOut(setTimeout(() => setErrors([]),2000))
		}
	}

	return (
		<div className={styles["wrapper"]}>
		<div className={styles["Errors"]}>
			<ul>
				{errors.map((el,i) => el==null ? null : <li onClick={(e) => {errors.splice(i,1); setErrors([...errors])}}><span>{el}</span></li>)}
			</ul>
		</div>
		<h2>Login</h2>
		<form onSubmit={(e) => handleSubmit(e)}>
		  <div className={styles["input-box"]}>
			<input type="text" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}/>
		  </div>
		  <div className={styles["input-box"]}>
			<input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
		  </div>
		  <div className={`${styles["input-box"]} ${styles["submit-button"]}`}>
			<input type="Submit" value="Login Now"/>
		  </div>
		  <div className={styles["text"]}>
			<h3>Don't have an account yet? <NavLink to="/register">Register now</NavLink></h3>
		  </div>
		</form>
	  </div>
	)
}

export default LoginPage
