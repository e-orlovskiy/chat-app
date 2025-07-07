
// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './app/store'
import { SocketProvider } from './context/SocketProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<SocketProvider>
				<App />
			</SocketProvider>
		</Provider>
	</React.StrictMode>
)

