import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import MainLayout from './layouts/MainLayout.jsx'
import MainPage from './pages/Home/HomePage.jsx'
import Login from './pages/Auth/LoginPage.jsx'
import Register from './pages/Auth/RegisterPage.jsx'
import './index.css'
import store from './app/store'
import { Provider } from 'react-redux'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
        <MainLayout />
    ),
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/login',
        element: <Login/>,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)

