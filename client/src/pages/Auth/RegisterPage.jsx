import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate,NavLink } from 'react-router-dom'
import { registerUser } from '../../features/auth/authSlice'
import styles from './AuthStyle.module.css'

const RegisterPage = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [secondPassword, setSecondPassword] = useState('')
	const [password, setFirstPassword] = useState('')
	const [errors, setErrors] = useState([])
	const [errsTimeout, setErrsTimeOut] = useState()

	const handleSubmit = async e => {
		e.preventDefault()
			if(password != secondPassword){
				console.log('wrwgtwegwgwgw')
				errors.push('Пароли не совпадают')
			}
		const res = await dispatch(registerUser({ username, email, password })).unwrap()
		
		if(res.code){
			errors.push(res.response.data.message.username  ? res.response.data.message.username.message : null)
			errors.push(res.response.data.message.email ? res.response.data.message.email.message : null)
			errors.push(res.response.data.message.password  ? res.response.data.message.password.message : null)
			if(errors[0] == null && errors[1] == null && errors[2] == null) {
				errors.length=0
				errors.push('Пользователь с таким именем и/или email уже существует')
			}
			setErrors([...errors])
			console.log(errors)
			setErrsTimeOut(setTimeout(() => setErrors([]),2000))
		}
		else{
		navigate('/')
		}
	}

	return (
	<div className={styles["wrapper"]}>
	<div className={styles["Errors"]}>
		<ul>
			{errors.map((el,i) => el==null ? null : <li onClick={(e) => {errors.splice(i,1); setErrors([...errors])}}><span>{el}</span></li>)}
		</ul>
	</div>
    <h2>Registration</h2>
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className={styles["input-box"]}>
        <input type="text" placeholder="Enter your name" onChange={(e) => setUsername(e.target.value)}/>
      </div>
      <div className={styles["input-box"]}>
        <input type="text" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className={styles["input-box"]}>
        <input type="password" placeholder="Create password" onChange={(e) => setFirstPassword(e.target.value)} />
      </div>
      <div className={styles["input-box"]}>
        <input type="password" placeholder="Confirm password" onChange={(e) => setSecondPassword(e.target.value)} />
      </div>
      <div className={`${styles["input-box"]} ${styles["submit-button"]}`}>
        <input type="Submit" value="Register Now"/>
      </div>
      <div className={styles["text"]}>
        <h3>Already have an account? <NavLink to="/login">Login now</NavLink></h3>
      </div>
    </form>
  </div>
	)
}

export default RegisterPage
