import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { TbMessageDots } from 'react-icons/tb'
import { useLocation } from 'react-router-dom'
import Login from '../../components/Login/Login'
import Register from '../../components/Register/Register'
import useMediaQuery from '../../hooks/useMediaQuery'
import styles from './Auth.module.css'

function Auth() {
	const [loginFormData, setLoginFormData] = useState({
		email: '',
		password: ''
	})
	const [registerFormData, setRegisterFormData] = useState({
		username: '',
		email: '',
		password: ''
	})
	const formsContRef = useRef(null)
	const location = useLocation()
	const isMobile = useMediaQuery('(max-width: 960px)')

	useEffect(() => {
		if (!formsContRef.current || isMobile) return

		if (location.pathname.includes('register')) {
			formsContRef.current.scrollLeft = 450
		} else {
			formsContRef.current.scrollLeft = 0
		}
	}, [location, isMobile])

	return (
		<div className={cn(styles['auth-container'])}>
			<div ref={formsContRef} className={cn(styles['forms-container'])}>
				{!isMobile ? (
					// desktop version
					<>
						<section className={cn(styles['section-1'], styles['section'])}>
							<Login formData={loginFormData} setFormData={setLoginFormData} />
						</section>
						<section className={cn(styles['section-2'], styles['section'])}>
							<h1>Chat App</h1>
							<TbMessageDots className={cn(styles['icon'])} />
						</section>
						<section className={cn(styles['section-3'], styles['section'])}>
							<Register
								formData={registerFormData}
								setFormData={setRegisterFormData}
							/>
						</section>
					</>
				) : (
					// mobile version
					<>
						{location.pathname.includes('login') ? (
							<>
								<section
									className={cn(styles['section'], styles['mobile-section'])}
								>
									<Login
										formData={loginFormData}
										setFormData={setLoginFormData}
									/>
								</section>
							</>
						) : (
							<>
								<section
									className={cn(styles['section'], styles['mobile-section'])}
								>
									<Register
										formData={registerFormData}
										setFormData={setRegisterFormData}
									/>
								</section>
							</>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default Auth
