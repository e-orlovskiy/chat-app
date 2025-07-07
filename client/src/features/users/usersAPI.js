import axios from 'axios'
import { SERVER_URL } from '../config'

const USERS_URL = `${SERVER_URL}/users`
const config = { withCredentials: true }

export const fetchUsersAPI = async () =>
	axios
		.get(USERS_URL, config)
		.then(res => res.data)
		.catch(err => console.log(err))
