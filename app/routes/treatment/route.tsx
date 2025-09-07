import { useState } from 'react'
import { Link } from 'react-router'
import { useAppointmentsStore } from '~/stores/appointments'
import { usePatientsStore } from '~/stores/patients'
import type { Appointment } from '~/types/medical'

export function meta() {
	return [
		{ title: 'Treatment Room - Play Doctor' },
		{ name: 'description', content: 'Doctor\'s treatment room for seeing patients' },
	]
}

export default function TreatmentRoom() {
	const appointments = useAppointmentsStore((state) => state.appointments)
	const getReadyForTreatment = useAppointmentsStore((state) => state.getReadyForTreatment)
	const patients = usePatientsStore((state) => state.patients)
	const [selectedDate, setSelectedDate] = useState(new Date())

	// Get today's appointments
	const todayAppointments = appointments.filter((apt) => {
		const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date)
		const selDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate)
		return aptDate.toDateString() === selDate.toDateString()
	})

	// Get patients who are ready for treatment
	const readyForTreatment = getReadyForTreatment()

	const getPatientById = (patientId: string) => {
		return patients.find(p => p.id === patientId)
	}

	const getAppointmentColor = (type: string) => {
		switch (type) {
			case 'emergency':
				return 'border-gentle-red bg-gentle-red/10'
			case 'vaccine':
				return 'border-doctor-green bg-doctor-green/10'
			case 'followup':
				return 'border-fun-purple bg-fun-purple/10'
			default:
				return 'border-doctor-blue bg-doctor-blue/10'
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'checked-in':
				return 'bg-happy-orange text-white'
			case 'in-progress':
				return 'bg-doctor-green text-white'
			default:
				return 'bg-soft-gray text-warm-gray'
		}
	}

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		})
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-medical-light to-doctor-blue">
			<div className="container mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						to="/"
						className="mb-4 inline-flex items-center text-text-dark hover:text-doctor-blue"
					>
						← Back to Clinic
					</Link>
					<div className="flex items-center justify-between">
						<h1 className="text-4xl font-bold text-text-dark">
							🩺 Doctor's Treatment Room
						</h1>
						<div className="text-right">
							<div className="text-lg font-semibold text-white">
								{formatDate(selectedDate)}
							</div>
							<div className="text-sm text-white/80">
								{readyForTreatment.length} patients ready
							</div>
						</div>
					</div>
				</div>

				{/* Doctor's Welcome */}
				<div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
					<div className="flex items-center gap-4">
						<div className="text-6xl">👨‍⚕️</div>
						<div>
							<h2 className="text-2xl font-bold text-text-dark">
								Welcome, Doctor!
							</h2>
							<p className="text-warm-gray">
								You have {readyForTreatment.length} patient{readyForTreatment.length !== 1 ? 's' : ''} ready to see today.
								{readyForTreatment.length === 0 && ' Take a break or check the waiting room!'}
							</p>
						</div>
					</div>
				</div>

				{/* Ready for Treatment */}
				<div className="mb-8">
					<h2 className="mb-4 text-2xl font-bold text-text-dark">
						👂 Ready to See Patients
					</h2>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{readyForTreatment.length === 0 ? (
							<div className="col-span-full rounded-2xl bg-white p-12 text-center shadow-lg">
								<div className="mb-4 text-6xl">🏥</div>
								<h3 className="mb-4 text-xl font-bold text-text-dark">
									No Patients Ready
								</h3>
								<p className="mb-6 text-warm-gray">
									No patients are currently ready for treatment. Check the waiting room or see if anyone needs to be checked in.
								</p>
								<div className="flex justify-center gap-4">
									<Link
										to="/checkin"
										className="rounded-full bg-doctor-green px-6 py-3 font-semibold text-white hover:bg-doctor-green-dark"
									>
										🏥 Check-in Room
									</Link>
									<Link
										to="/patients"
										className="rounded-full bg-doctor-blue px-6 py-3 font-semibold text-white hover:bg-doctor-blue-dark"
									>
										👥 All Patients
									</Link>
								</div>
							</div>
						) : (
							readyForTreatment
								.sort((a, b) => {
									// Emergency appointments first, then by time
									if (a.type === 'emergency' && b.type !== 'emergency') return -1
									if (a.type !== 'emergency' && b.type === 'emergency') return 1
									return a.time.localeCompare(b.time)
								})
								.map((appointment) => {
									const patient = getPatientById(appointment.patientId)
									return (
										<div
											key={appointment.id}
											className={`rounded-2xl border-2 p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${getAppointmentColor(appointment.type)}`}
										>
											<div className="flex flex-col items-center text-center">
												<div className="mb-4 text-5xl">
													{patient?.avatar || '👤'}
												</div>
												<h3 className="mb-2 text-xl font-bold text-text-dark">
													{appointment.patientName}
												</h3>
												<div className="mb-2 text-sm text-warm-gray">
													Age {patient?.age || 'Unknown'} • {patient?.favoriteColor || 'Unknown'}
												</div>
												<div className="mb-4">
													<span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}>
														{appointment.status === 'checked-in' ? 'Waiting' : 'In Progress'}
													</span>
												</div>
												<div className="mb-4 text-sm text-warm-gray">
													<div className="font-medium">{appointment.time}</div>
													<div className="capitalize">{appointment.type}</div>
													{appointment.notes && (
														<div className="mt-2 text-xs italic">
															"{appointment.notes}"
														</div>
													)}
												</div>
												<Link
													to={`/treatment/${appointment.id}`}
													className="w-full rounded-full bg-doctor-green px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-doctor-green-dark"
												>
													{appointment.status === 'in-progress' ? 'Continue Treatment' : 'Start Treatment'}
												</Link>
											</div>
										</div>
									)
								})
						)}
					</div>
				</div>

				{/* Today's Summary */}
				<div className="grid gap-6 md:grid-cols-2">
					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h3 className="mb-4 text-lg font-bold text-text-dark">
							📊 Today's Progress
						</h3>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-warm-gray">Total Appointments:</span>
								<span className="font-bold text-text-dark">{todayAppointments.length}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-warm-gray">Completed:</span>
								<span className="font-bold text-doctor-green">
									{todayAppointments.filter(apt => apt.status === 'completed').length}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-warm-gray">In Progress:</span>
								<span className="font-bold text-doctor-blue">
									{todayAppointments.filter(apt => apt.status === 'in-progress').length}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-warm-gray">Waiting:</span>
								<span className="font-bold text-happy-orange">
									{todayAppointments.filter(apt => apt.status === 'checked-in').length}
								</span>
							</div>
						</div>
					</div>

					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h3 className="mb-4 text-lg font-bold text-text-dark">
							🚨 Emergency Cases
						</h3>
						<div className="space-y-3">
							{todayAppointments.filter(apt => apt.type === 'emergency').length === 0 ? (
								<div className="text-center text-warm-gray">
									No emergency cases today
								</div>
							) : (
								todayAppointments
									.filter(apt => apt.type === 'emergency')
									.map((apt) => {
										const patient = getPatientById(apt.patientId)
										return (
											<div key={apt.id} className="flex items-center justify-between rounded-lg bg-gentle-red/10 p-3">
												<div className="flex items-center gap-2">
													<span>{patient?.avatar || '👤'}</span>
													<span className="font-medium">{apt.patientName}</span>
												</div>
												<span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(apt.status)}`}>
													{apt.status}
												</span>
											</div>
										)
									})
							)}
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mt-8 rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
					<h3 className="mb-4 text-xl font-bold text-white">
						⚡ Quick Actions
					</h3>
					<div className="flex flex-wrap gap-4">
						<Link
							to="/checkin"
							className="rounded-full bg-white px-6 py-3 font-semibold text-doctor-blue shadow-lg transition-all duration-300 hover:scale-105"
						>
							🏥 Check-in Room
						</Link>
						<Link
							to="/patients"
							className="rounded-full bg-white px-6 py-3 font-semibold text-doctor-blue shadow-lg transition-all duration-300 hover:scale-105"
						>
							👥 All Patients
						</Link>
						<Link
							to="/appointments"
							className="rounded-full bg-white px-6 py-3 font-semibold text-doctor-blue shadow-lg transition-all duration-300 hover:scale-105"
						>
							📅 Schedule
						</Link>
						<Link
							to="/medical-tools"
							className="rounded-full bg-white px-6 py-3 font-semibold text-doctor-blue shadow-lg transition-all duration-300 hover:scale-105"
						>
							🩺 Medical Tools
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}