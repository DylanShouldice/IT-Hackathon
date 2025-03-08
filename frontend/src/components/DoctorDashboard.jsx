import { useState } from 'react'

const patients = [
	{ id: 1, name: 'John Doe', reports: ['report1.pdf', 'report2.pdf'] },
	{ id: 2, name: 'Jane Smith', reports: ['report3.pdf'] },
	{ id: 3, name: 'Michael Brown', reports: ['report4.pdf', 'report5.pdf'] },
]

function PatientTable({ patients }) {
	const [selectedReports, setSelectedReports] = useState(null)

	const handleViewReports = (reports) => {
		setSelectedReports(reports)
	}

	const handleStartRecording = (patientId) => {
		const recordingWindow = window.open('', '', 'width=800,height=600')

		if (recordingWindow) {
			// You can modify this to load a recording page, or you can start recording in this window
			recordingWindow.document.write(
				'<h1>Recording for Patient ' + patientId + '</h1>'
			)
			recordingWindow.document.write('<p>Recording will start here...</p>')

			// Add actual recording logic here (e.g., MediaRecorder API, etc.)
			console.log(`Started recording for patient ID ${patientId}`)
		}
	}

	const handleStopRecording = (patientId) => {
		// Stop the recording in the new window or tab
		console.log(`Stopped recording for patient ID ${patientId}`)

		// You could either close the window after recording is finished
		window.close()
	}

	return (
		<div className='bg-white p-4 rounded-lg shadow-md'>
			<h2 className='text-lg font-semibold mb-4'>Patient Reports</h2>
			<table className='min-w-full table-auto'>
				<thead>
					<tr>
						<th className='px-4 py-2 text-left'>ID</th>
						<th className='px-4 py-2 text-left'>Patient Name</th>
						<th className='px-4 py-2 text-left'>Reports</th>
						<th className='px-4 py-2 text-left'>Recording</th>
					</tr>
				</thead>
				<tbody>
					{patients.map((patient) => (
						<tr key={patient.id}>
							<td className='px-4 py-2'>{patient.id}</td>
							<td className='px-4 py-2'>{patient.name}</td>
							<td className='px-4 py-2'>
								<button
									className='bg-transparent border border-gray-400 text-gray-800 py-1 px-2 rounded-sm text-sm flex items-center'
									onClick={() => handleViewReports(patient.reports)}>
									View Reports
								</button>
							</td>
							<td className='px-4 py-2'>
								<button
									className='bg-green-500 text-white py-1 px-2 rounded-sm text-sm'
									onClick={() => handleStartRecording(patient.id)}>
									Start Recording
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{selectedReports && (
				<div className='mt-4 bg-gray-100 p-4 rounded-lg'>
					<h3 className='text-lg font-semibold mb-2'>
						Reports for Selected Patient
					</h3>
					<ul>
						{selectedReports.map((report, index) => (
							<li key={index} className='mb-2'>
								<button
									className='bg-transparent border border-gray-400 text-gray-800 py-1 px-2 rounded-sm text-sm'
									onClick={() => window.open(report, '_blank')}>
									View {report}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

function QuickStats() {
	return (
		<div className='grid grid-cols-3 gap-4'>
			<div className='bg-white p-4 rounded-lg shadow-md'>
				<h2 className='text-lg font-semibold'>Total Consultations</h2>
				<p className='text-2xl font-bold'>{patients.length}</p>
			</div>
			<div className='bg-white p-4 rounded-lg shadow-md'>
				<h2 className='text-lg font-semibold'>New Patients</h2>
				<p className='text-2xl font-bold'>2</p>
			</div>
			<div className='bg-white p-4 rounded-lg shadow-md'>
				<h2 className='text-lg font-semibold'>Pending Reports</h2>
				<p className='text-2xl font-bold'>1</p>
			</div>
		</div>
	)
}

export default function DoctorDashboard() {
	return (
		<div className='flex min-h-screen bg-gray-100'>
			<div className='w-64 bg-gray-800 text-white p-4'>
				<h2 className='text-lg font-semibold'>Sidebar</h2>
			</div>
			<main className='flex-1 p-6 space-y-6'>
				<h1 className='text-2xl font-bold'>Doctor Dashboard</h1>
				<QuickStats />
				<PatientTable patients={patients} />
			</main>
		</div>
	)
}
