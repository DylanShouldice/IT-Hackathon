import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

function PatientTable({ doctorId }) {
	const [patients, setPatients] = useState([]) // Set initial state as an empty array
	const [selectedReports, setSelectedReports] = useState(null)
	const [recordingStatus, setRecordingStatus] = useState({})
	const recordingWindowsRef = useRef({}) // Store references to recording windows

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const response = await axios.get('http://localhost:8080/api/patients', {
					params: { doctorId },
				})
				setPatients(response.data)
			} catch (error) {
				console.error('Error fetching patients:', error)
			}
		}

		if (doctorId) {
			fetchPatients()
		}
	}, [doctorId])

	const handleViewReports = (reports) => {
		setSelectedReports(reports)
	}

	const handleStartRecording = (patientId) => {
		// Start recording for the given patient
		const recordingWindow = window.open('', '', 'width=800,height=600')

		if (recordingWindow) {
			// Store reference to the window
			recordingWindowsRef.current[patientId] = recordingWindow

			// Write the recording interface to the window
			recordingWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Recording for Patient ${patientId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .controls { margin: 20px 0; display: flex; gap: 10px; }
            button { padding: 8px 16px; border-radius: 4px; cursor: pointer; }
            .play { background-color: #4CAF50; color: white; border: none; }
            .pause { background-color: #FFC107; color: black; border: none; }
            .stop { background-color: #F44336; color: white; border: none; }
            .status { margin-top: 10px; font-weight: bold; }
            .visualizer { height: 60px; width: 100%; background-color: #f0f0f0; margin: 20px 0; }
            .audio-preview { margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Recording for Patient ${patientId}</h1>
          <div class="controls">
            <button class="play" id="playBtn">Start Recording</button>
            <button class="pause" id="pauseBtn" disabled>Pause</button>
            <button class="stop" id="stopBtn" disabled>Stop & Save</button>
          </div>
          <div class="status" id="status">Ready to record</div>
          <canvas id="visualizer" class="visualizer"></canvas>
          <div class="audio-preview" id="audioPreview"></div>
          
          <script>
            // WebRTC Audio Recording variables
            let mediaRecorder;
            let audioChunks = [];
            let audioBlob;
            let audioUrl;
            let stream;
            let audioContext;
            let analyser;
            let source;
            
            // Track recording state
            let isRecording = false;
            let isPaused = false;
            
            // Recording metadata
            let recordingData = {
              patientId: ${patientId},
              startTime: null,
              endTime: null,
              pausePoints: [],
              audioBlob: null
            };
            
            // Get elements
            const playBtn = document.getElementById('playBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            const stopBtn = document.getElementById('stopBtn');
            const statusEl = document.getElementById('status');
            const visualizer = document.getElementById('visualizer');
            const audioPreview = document.getElementById('audioPreview');
            const canvas = visualizer.getContext('2d');
            
            // Set up visualizer
            visualizer.width = visualizer.offsetWidth;
            visualizer.height = visualizer.offsetHeight;
            
            // Function to visualize audio
            function visualizeAudio() {
              if (!analyser) return;
              
              requestAnimationFrame(visualizeAudio);
              
              const bufferLength = analyser.frequencyBinCount;
              const dataArray = new Uint8Array(bufferLength);
              analyser.getByteTimeDomainData(dataArray);
              
              canvas.fillStyle = '#f0f0f0';
              canvas.fillRect(0, 0, visualizer.width, visualizer.height);
              canvas.lineWidth = 2;
              canvas.strokeStyle = '#4CAF50';
              canvas.beginPath();
              
              const sliceWidth = visualizer.width / bufferLength;
              let x = 0;
              
              for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * visualizer.height / 2;
                
                if (i === 0) {
                  canvas.moveTo(x, y);
                } else {
                  canvas.lineTo(x, y);
                }
                
                x += sliceWidth;
              }
              
              canvas.lineTo(visualizer.width, visualizer.height / 2);
              canvas.stroke();
            }
            
            // Start recording function
            async function startRecording() {
              try {
                // Request microphone access
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                // Set up audio context for visualization
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                analyser.fftSize = 2048;
                
                // Start visualizing
                visualizeAudio();
                
                // Create media recorder
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                // Handle data available event
                mediaRecorder.ondataavailable = (event) => {
                  audioChunks.push(event.data);
                };
                
                // Handle recording stop event
                mediaRecorder.onstop = () => {
                  // Create blob from chunks
                  audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                  audioUrl = URL.createObjectURL(audioBlob);
                  
                  // Add audio preview
                  audioPreview.innerHTML = \`
                    <audio controls src="\${audioUrl}"></audio>
                    <p>Preview of recorded audio</p>
                  \`;
                  
                  // Update recording data
                  recordingData.audioBlob = audioBlob;
                };
                
                // Start recording
                mediaRecorder.start();
                recordingData.startTime = new Date();
                isRecording = true;
                
                // Update UI
                statusEl.textContent = 'Recording...';
                playBtn.disabled = true;
                pauseBtn.disabled = false;
                stopBtn.disabled = false;
                
                // Notify parent window
                window.opener.postMessage({ 
                  type: 'recordingUpdate', 
                  patientId: ${patientId}, 
                  status: 'Recording...' 
                }, '*');
                
              } catch (error) {
                console.error('Error accessing microphone:', error);
                statusEl.textContent = 'Error: ' + error.message;
                window.opener.postMessage({ 
                  type: 'recordingUpdate', 
                  patientId: ${patientId}, 
                  status: 'Error: ' + error.message 
                }, '*');
              }
            }
            
            // Pause recording function
            function pauseRecording() {
              if (mediaRecorder && isRecording && !isPaused) {
                mediaRecorder.pause();
                isPaused = true;
                recordingData.pausePoints.push(new Date());
                
                // Update UI
                statusEl.textContent = 'Recording paused';
                pauseBtn.textContent = 'Resume';
                
                // Notify parent window
                window.opener.postMessage({ 
                  type: 'recordingUpdate', 
                  patientId: ${patientId}, 
                  status: 'Paused' 
                }, '*');
              } else if (mediaRecorder && isRecording && isPaused) {
                // Resume recording
                mediaRecorder.resume();
                isPaused = false;
                recordingData.pausePoints.push(new Date());
                
                // Update UI
                statusEl.textContent = 'Recording resumed...';
                pauseBtn.textContent = 'Pause';
                
                // Notify parent window
                window.opener.postMessage({ 
                  type: 'recordingUpdate', 
                  patientId: ${patientId}, 
                  status: 'Recording...' 
                }, '*');
              }
            }
            
            // Stop recording function
            function stopRecording() {
              if (mediaRecorder && isRecording) {
                // Stop the media recorder
                mediaRecorder.stop();
                recordingData.endTime = new Date();
                
                // Stop the media stream
                if (stream) {
                  stream.getTracks().forEach(track => track.stop());
                }
                
                isRecording = false;
                isPaused = false;
                
                // Update UI
                statusEl.textContent = 'Recording stopped. Preparing to save...';
                playBtn.disabled = false;
                pauseBtn.disabled = true;
                stopBtn.disabled = true;
                playBtn.textContent = 'Start New Recording';
                pauseBtn.textContent = 'Pause';
                
                // Give time for the ondataavailable and onstop events to complete
                setTimeout(() => {
                  sendRecordingToServer();
                }, 500);
              }
            }
            
            // Send recording to server
            function sendRecordingToServer() {
              if (!audioBlob) {
                statusEl.textContent = 'Error: No audio data available';
                return;
              }
              
              statusEl.textContent = 'Saving recording to server...';
              
              // Create FormData to send the audio file and metadata
              const formData = new FormData();
              formData.append('audio', audioBlob, 'patient_${patientId}_recording.webm');
              formData.append('patientId', '${patientId}');
              formData.append('startTime', recordingData.startTime.toISOString());
              formData.append('endTime', recordingData.endTime.toISOString());
              formData.append('pausePoints', JSON.stringify(recordingData.pausePoints.map(d => d.toISOString())));
              
              // Send to server
              const apiUrl = 'http://localhost:8080/api/recordings';
              
              fetch(apiUrl, {
                method: 'POST',
                body: formData
              })
              .then(response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error('Network response was not ok');
              })
              .then(data => {
                statusEl.textContent = 'Recording saved successfully!';
                window.opener.postMessage({ 
                  type: 'recordingUpdate', 
                  patientId: ${patientId}, 
                  status: 'Saved' 
                }, '*');
              })
              .catch(error => {
                console.error('Error:', error);
                statusEl.textContent = 'Error saving recording: ' + error.message;
                window.opener.postMessage({ 
                  type: 'recordingUpdate', 
                  patientId: ${patientId}, 
                  status: 'Error saving' 
                }, '*');
              });
            }
            
            // Event listeners
            playBtn.addEventListener('click', startRecording);
            pauseBtn.addEventListener('click', pauseRecording);
            stopBtn.addEventListener('click', stopRecording);
            
            // Listen for close event
            window.addEventListener('beforeunload', () => {
              // Clean up
              if (stream) {
                stream.getTracks().forEach(track => track.stop());
              }
              
              // Notify parent
              if (isRecording) {
                window.opener.postMessage({ 
                  type: 'recordingUpdate', 
                  patientId: ${patientId}, 
                  status: 'Window closed during recording' 
                }, '*');
              }
            });
          </script>
        </body>
        </html>
      `)

			recordingWindow.document.close()

			// Update recording status for that patient
			setRecordingStatus((prevStatus) => ({
				...prevStatus,
				[patientId]: 'Recording window opened',
			}))

			console.log(`Started recording interface for patient ID ${patientId}`)
		}
	}

	const handleStopRecording = (patientId) => {
		// Close the recording window if it exists
		if (recordingWindowsRef.current[patientId]) {
			recordingWindowsRef.current[patientId].close()
			delete recordingWindowsRef.current[patientId]

			// Update status
			setRecordingStatus((prevStatus) => ({
				...prevStatus,
				[patientId]: 'Window closed',
			}))

			console.log(`Closed recording for patient ID ${patientId}`)
		}
	}

	// Handle messages from recording windows
	useState(() => {
		const handleMessage = (event) => {
			// Check for recording update messages
			if (event.data && event.data.type === 'recordingUpdate') {
				const { patientId, status } = event.data

				// Update recording status
				setRecordingStatus((prevStatus) => ({
					...prevStatus,
					[patientId]: status,
				}))
			}
		}

		// Add event listener
		window.addEventListener('message', handleMessage)

		// Clean up
		return () => {
			window.removeEventListener('message', handleMessage)
		}
	}, [])

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
								{/* Recording controls */}
								<div className='flex items-center space-x-2'>
									{recordingWindowsRef.current[patient.id] ? (
										<button
											className='bg-red-500 text-white py-1 px-2 rounded-sm text-sm'
											onClick={() => handleStopRecording(patient.id)}>
											Close Recording
										</button>
									) : (
										<button
											className='bg-green-500 text-white py-1 px-2 rounded-sm text-sm'
											onClick={() => handleStartRecording(patient.id)}>
											Open Recorder
										</button>
									)}
								</div>

								{/* Show recording status */}
								{recordingStatus[patient.id] && (
									<p className='mt-1 text-sm'>
										Status: {recordingStatus[patient.id]}
									</p>
								)}
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
