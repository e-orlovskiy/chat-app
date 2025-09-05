import cn from 'classnames'
import debounce from 'lodash.debounce'
import { useEffect, useMemo, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { setShowSidebarMobile } from '../../features/chat/chatSlice'
import useMediaQuery from '../../hooks/useMediaQuery'
import MyChats from '../MyChats/MyChats'
import Profile from '../Profile/Profile'
import TextInput from '../TextInput/TextInput'
import styles from './Sidebar.module.css'

function Sidebar() {
	const [inputValue, setInputValue] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [searchFocused, setSearchFocused] = useState(false)
	const { showSidebarMobile } = useSelector(state => state.chat)
	const dispatch = useDispatch()

	const isMobile = useMediaQuery('(max-width: 960px)')

	const handleToggleSidebar = () => {
		dispatch(setShowSidebarMobile(!showSidebarMobile))
	}

	const debouncedSearch = useMemo(
		() =>
			debounce(query => {
				setSearchTerm(query)
			}, 500),
		[]
	)

	useEffect(() => {}, [showSidebarMobile])

	useEffect(() => {
		return () => debouncedSearch.cancel()
	}, [debouncedSearch])

	useEffect(() => {
		if (searchTerm.length === 0) {
			setSearchFocused(false)
		} else {
			setSearchFocused(true)
		}
	}, [searchTerm])

	const handleChange = e => {
		const value = e.target.value
		setInputValue(value)
		debouncedSearch(value)
	}

	return (
		<div
			className={cn(styles['sidebar'], {
				[styles['active']]: isMobile && showSidebarMobile
			})}
		>
			<div className={styles['sidebar__header']}>
				<h1 className={cn(styles.title)}>Chat App</h1>
				<div
					className={cn(styles['sidebar__show-icon'])}
					onClick={handleToggleSidebar}
				>
					<IoClose />
				</div>
			</div>
			<div className={cn(styles.underline)}></div>
			<Profile />
			<TextInput
				type='search'
				name='search'
				placeholder='search'
				value={inputValue}
				onChange={handleChange}
			/>
			<MyChats
				searchFocused={searchFocused}
				searchTerm={searchTerm}
				inputValue={inputValue}
			/>
		</div>
	)
}

export default Sidebar
