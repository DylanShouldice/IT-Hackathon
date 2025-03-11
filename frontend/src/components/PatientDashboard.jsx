import { useState } from 'react'
import axios from 'axios'
const PatientDashboard = () => {
	const [reports, setReports] = useState([])
	const userId = localStorage.getItem('userId')
	const handleReports = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8080/user_id=${userId}reports`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			)
		} catch (error) {
			console.error('Error fetching reports:', error)
			alert('Error fetching reports!')
		}
	}
	return (
		<div>
			<h1 className='text-2xl sm:text-3xl'>Patient Dashboard</h1>
			<div className='flex flex-row space-x-4'></div>
		</div>
	)
}

export default PatientDashboard
