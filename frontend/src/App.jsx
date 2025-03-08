import './App.css'
import { useState } from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import DoctorDashboard from './components/DoctorDashboard'

function App() {
	const [isLoggedin, setIsLoggedin] = useState(true)
	const [isRegistered, setIsRegistered] = useState(true)

	// Handle navigation back to Register from Login
	const handleBackToRegister = () => {
		setIsRegistered(false) // Go back to Register
	}

	return (
		<Router>
			<div>
				<Routes>
					{/* Route to Register Page */}
					<Route
						path='/'
						element={
							!isRegistered ? (
								<Register setIsRegistered={setIsRegistered} />
							) : (
								<Navigate to='/login' />
							)
						}
					/>

					{/* Route to Login Page */}
					<Route
						path='/login'
						element={
							!isLoggedin ? (
								<Login
									setIsLoggedin={setIsLoggedin}
									setIsRegistered={handleBackToRegister}
								/>
							) : (
								<Navigate to='/dashboard' />
							)
						}
					/>

					{/* Route to Dashboard */}
					<Route
						path='/dashboard'
						element={
							isLoggedin ? <DoctorDashboard /> : <Navigate to='/login' />
						}
					/>

					{/* Redirect if the route doesn't match */}
					<Route path='*' element={<Navigate to='/' />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App
