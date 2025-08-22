// main.jsx
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './app/store'
import { SocketProvider } from './context/socket/SocketProvider.jsx'
import { ThemeProvider } from './context/theme/ThemeProvider.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<ThemeProvider>
			<SocketProvider>
				<App />
			</SocketProvider>
		</ThemeProvider>
	</Provider>
)
