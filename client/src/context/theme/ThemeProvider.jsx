import { useEffect, useState } from 'react'
import { ThemeContext } from './themeContext'

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem('theme')
		return savedTheme || 'light'
	})

	useEffect(() => {
		localStorage.setItem('theme', theme)
		document.body.className = theme
	}, [theme])

	const toggleTheme = () => {
		setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
	}

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}
