import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAppointmentsStore } from '~/stores/appointments'
import { usePatientsStore } from '~/stores/patients'

export function meta() {
	return [
		{ title: 'Patient Check-in - Play Doctor' },
		{ name: 'description', content: 'Check in patients and manage the waiting room' },
	]
}

export default function CheckIn() {
	const appointments = useAppointmentsStore((state) => state.appointments)
	const patients = usePatientsStore((state) => state.patients)
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [todayAppointments, setTodayAppointments] = useState([])

	// Filter appointments for today in useEffect to avoid re-renders
	useEffect(() => {
		const filtered = appointments.filter((apt) => {
			try {
				const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date)
				const selDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate)
				return aptDate.toDateString() === selDate.toDateString()
			} catch (error) {
				console.error('Error filtering appointments:', error)
				return false
			}
		})
		setTodayAppointments(filtered)
	}, [appointments, selectedDate])

	// Group appointments by status
	const scheduledAppointments = todayAppointments.filter(apt => apt.status === 'scheduled')
	const checkedInAppointments = todayAppointments.filter(apt => apt.status === 'checked-in')
	const inProgressAppointments = todayAppointments.filter(apt => apt.status === 'in-progress')

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
			case 'scheduled':
				return 'bg-soft-gray text-warm-gray'
			case 'checked-in':
				return 'bg-happy-orange text-white'
			case 'in-progress':
				return 'bg-doctor-green text-white'
			case 'completed':
				return 'bg-medical-blue text-white'
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
							🏥 Patient Check-in
						</h1>
						<div className="text-right">
							<div className="text-lg font-semibold text-white">
								{formatDate(selectedDate)}
							</div>
							<div className="text-sm text-white/80">
								{todayAppointments.length} total appointments
							</div>
						</div>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
					<div className="rounded-2xl bg-white p-6 text-center shadow-lg">
						<div className="text-3xl font-bold text-doctor-blue">
							{scheduledAppointments.length}
						</div>
						<div className="text-sm text-warm-gray">Scheduled</div>
					</div>
					<div className="rounded-2xl bg-white p-6 text-center shadow-lg">
						<div className="text-3xl font-bold text-happy-orange">
							{checkedInAppointments.length}
						</div>
						<div className="text-sm text-warm-gray">Waiting</div>
					</div>
					<div className="rounded-2xl bg-white p-6 text-center shadow-lg">
						<div className="text-3xl font-bold text-doctor-green">
							{inProgressAppointments.length}
						</div>
						<div className="text-sm text-warm-gray">In Treatment</div>
					</div>
					<div className="rounded-2xl bg-white p-6 text-center shadow-lg">
						<div className="text-3xl font-bold text-medical-blue">
							{todayAppointments.filter(apt => apt.status === 'completed').length}
						</div>
						<div className="text-sm text-warm-gray">Completed</div>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Scheduled Appointments */}
					<div className="lg:col-span-1">
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-4 text-2xl font-bold text-text-dark">
								📅 Scheduled Today
							</h2>
							<div className="space-y-3">
								{scheduledAppointments.length === 0 ? (
									<div className="rounded-lg bg-soft-gray p-4 text-center text-warm-gray">
										No scheduled appointments
									</div>
								) : (
									scheduledAppointments
										.sort((a, b) => a.time.localeCompare(b.time))
										.map((appointment) => {
											const patient = getPatientById(appointment.patientId)
											return (
												<div
													key={appointment.id}
													className={`rounded-lg border-2 p-4 ${getAppointmentColor(appointment.type)}`}
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															<div className="text-2xl">
																{patient?.avatar || '👤'}
															</div>
															<div>
																<div className="font-semibold text-text-dark">
																	{appointment.patientName}
																</div>
																<div className="text-sm text-warm-gray">
																	{appointment.time} • {appointment.type}
																</div>
															</div>
														</div>
														<button
															onClick={() => {
																// Simple check-in without store update for now
																console.log('Check in:', appointment.id)
															}}
															className="rounded-full bg-doctor-green px-4 py-2 text-sm font-medium text-white hover:bg-doctor-green-dark"
														>
															Check In
														</button>
													</div>
												</div>
											)
										})
								)}
							</div>
						</div>
					</div>

					{/* Waiting Room */}
					<div className="lg:col-span-1">
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-4 text-2xl font-bold text-text-dark">
								🪑 Waiting Room
							</h2>
							<div className="space-y-3">
								{checkedInAppointments.length === 0 ? (
									<div className="rounded-lg bg-soft-gray p-4 text-center text-warm-gray">
										No patients waiting
									</div>
								) : (
									checkedInAppointments
										.sort((a, b) => a.time.localeCompare(b.time))
										.map((appointment, index) => {
											const patient = getPatientById(appointment.patientId)
											return (
												<div
													key={appointment.id}
													className={`rounded-lg border-2 p-4 ${getAppointmentColor(appointment.type)}`}
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															<div className="text-2xl">
																{patient?.avatar || '👤'}
															</div>
															<div>
																<div className="font-semibold text-text-dark">
																	#{index + 1} {appointment.patientName}
																</div>
																<div className="text-sm text-warm-gray">
																	{appointment.time} • {appointment.type}
																</div>
															</div>
														</div>
														<Link
															to={`/treatment/${appointment.id}`}
															className="rounded-full bg-doctor-blue px-4 py-2 text-sm font-medium text-white hover:bg-doctor-blue-dark"
														>
															Start Treatment
														</Link>
													</div>
												</div>
											)
										})
								)}
							</div>
						</div>
					</div>

					{/* In Treatment */}
					<div className="lg:col-span-1">
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-4 text-2xl font-bold text-text-dark">
								🩺 In Treatment
							</h2>
							<div className="space-y-3">
								{inProgressAppointments.length === 0 ? (
									<div className="rounded-lg bg-soft-gray p-4 text-center text-warm-gray">
										No patients in treatment
									</div>
								) : (
									inProgressAppointments.map((appointment) => {
										const patient = getPatientById(appointment.patientId)
										return (
											<div
												key={appointment.id}
												className={`rounded-lg border-2 p-4 ${getAppointmentColor(appointment.type)}`}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<div className="text-2xl">
															{patient?.avatar || '👤'}
														</div>
														<div>
															<div className="font-semibold text-text-dark">
																{appointment.patientName}
															</div>
															<div className="text-sm text-warm-gray">
																{appointment.time} • {appointment.type}
															</div>
														</div>
													</div>
													<Link
														to={`/treatment/${appointment.id}`}
														className="rounded-full bg-doctor-green px-4 py-2 text-sm font-medium text-white hover:bg-doctor-green-dark"
													>
														Continue
													</Link>
												</div>
											</div>
										)
									})
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Doctor's Quick Actions */}
				<div className="mt-8 rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
					<h3 className="mb-4 text-xl font-bold text-white">
						⚡ Doctor's Quick Actions
					</h3>
					<div className="flex flex-wrap gap-4">
						<Link
							to="/treatment"
							className="rounded-full bg-white px-6 py-3 font-semibold text-doctor-blue shadow-lg transition-all duration-300 hover:scale-105"
						>
							🩺 Treatment Room
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
					</div>
				</div>
			</div>
		</div>
	)
}