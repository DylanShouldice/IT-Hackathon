import React, { useState } from 'react'
import axios from 'axios'

const RegisterForm = ({ setIsRegistered }) => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		height: '',
		age: '',
		allergies: '',
		diet: '',
		gender: '',
	})
	const [confirmPassword, setConfirmPassword] = useState('')

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (formData.password !== confirmPassword) {
			alert('Passwords do not match')
			return
		}

		try {
			const response = await axios.post(
				'http://localhost:8080/register',
				formData
			)
			localStorage.setItem('token', response.data.token)
			alert('Register successful!')
			setIsRegistered(true)
		} catch (error) {
			alert('Register failed')
		}
	}

	return (
		<div className='min-h-screen flex'>
			<div className='hidden lg:flex w-1/2 relative'>
				<div className="absolute inset-0 bg-cover bg-center bg-[url('/doctorpatient.webp')]"></div>
				<div className='absolute inset-0 backdrop-blur-md bg-transparent'></div>
				<div className='flex flex-col items-center justify-center w-full h-full z-10 relative'>
					<h1 className='text-white text-4xl font-bold'>MediScribe</h1>
					<p className='text-white mt-4 text-lg text-left mx-5'>
						Letting Doctors Focus on Patients instead of Paperwork
					</p>
				</div>
			</div>
			<div className='flex flex-col items-center justify-center w-full lg:w-1/2 p-6 bg-gradient-to-br from-white to-gray-50'>
				<div className='w-full max-w-md sm:max-w-2xl px-8 py-10 bg-white rounded-2xl shadow-lg'>
					<div className='lg:hidden mb-8 text-center'>
						<h1 className='text-3xl font-bold text-indigo-600'>MediScribe</h1>
						<p className='text-gray-600 mt-2 text-sm'>
							Letting Doctors Focus on Patients instead of Paperwork
						</p>
					</div>

					<h2 className='text-3xl font-bold mb-6 text-gray-800'>
						Create Account
					</h2>
					<p className='text-gray-600 mb-8'>
						Are you a patient trying to access your medical records?{' '}
						<a
							href='#'
							className='text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:underline transition-colors duration-200'>
							Click here
						</a>
					</p>

					<form onSubmit={handleSubmit} className='space-y-5'>
						<div>
							<label
								htmlFor='firstName'
								className='block text-sm font-medium text-gray-700 mb-1'>
								First Name
							</label>
							<div className='relative'>
								<input
									type='lastName'
									className='block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900'
									id='email'
									name='email'
									value={formData.firstName}
									onChange={handleInputChange}
									placeholder='John'
									required
									aria-required='true'
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor='lastName'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Last Name
							</label>
							<div className='relative'>
								<input
									type='lastName'
									className='block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900'
									id='lastName'
									name='lastName'
									value={formData.lastName}
									onChange={handleInputChange}
									placeholder='Doe'
									required
									aria-required='true'
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Email
							</label>
							<div className='relative'>
								<input
									type='email'
									className='block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleInputChange}
									placeholder='your.email@example.com'
									required
									aria-required='true'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Password
							</label>
							<div className='relative'>
								<input
									type='password'
									className='block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900'
									id='password'
									name='password'
									value={formData.password}
									onChange={handleInputChange}
									placeholder='Create a strong password'
									required
									aria-required='true'
									minLength='8'
								/>
							</div>
							<p className='mt-1 text-xs text-gray-500'>
								Must be at least 8 characters
							</p>
						</div>
						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Confirm Password
							</label>
							<div className='relative'>
								<input
									type='password'
									className='block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900'
									id='password'
									name='password'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder='Create a strong password'
									required
									aria-required='true'
									minLength='8'
								/>
							</div>
							<p className='mt-1 text-xs text-gray-500'>
								Must be at least 8 characters
							</p>
						</div>

						{/* Submit button */}
						<button
							type='submit'
							className='w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mt-6'
							aria-label='Register account'>
							Create My Account
						</button>

						{/* Login link */}
						<div className='mt-6 text-center'>
							<p className='text-gray-600'>
								Already have an account?{' '}
								<button
									type='button'
									onClick={() => setIsRegistered(true)}
									className='text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:underline transition-colors duration-200'>
									Sign in
								</button>
							</p>
						</div>
					</form>
				</div>

				{/* Footer note */}
				<p className='mt-8 text-center text-xs text-gray-500'>
					By creating an account, you agree to our{' '}
					<a
						href='#'
						className='text-indigo-600 hover:text-indigo-800 underline'>
						Terms of Service
					</a>{' '}
					and{' '}
					<a
						href='#'
						className='text-indigo-600 hover:text-indigo-800 underline'>
						Privacy Policy
					</a>
				</p>
			</div>
		</div>
	)
}

export default RegisterForm
