import { useState } from 'react'
import { Link } from 'react-router'
import { useAppointmentsStore } from '~/stores/appointments'

export function meta() {
	return [
		{ title: 'Appointments - Play Doctor' },
		{ name: 'description', content: 'Manage your appointment schedule' },
	]
}

export default function Appointments() {
	const appointments = useAppointmentsStore((state) => state.appointments)
	const [selectedDate, setSelectedDate] = useState(new Date())

	// Generate time slots for the day
	const timeSlots = []
	for (let hour = 9; hour <= 17; hour++) {
		for (let minute = 0; minute < 60; minute += 30) {
			const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
			timeSlots.push(time)
		}
	}

	// Filter appointments for selected date
	const todayAppointments = appointments.filter((apt) => {
		const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date)
		const selDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate)
		return aptDate.toDateString() === selDate.toDateString()
	})

	// Get appointment for specific time slot
	const getAppointmentForTimeSlot = (time: string) => {
		return todayAppointments.find((apt) => apt.time === time)
	}

	// Get appointment type color
	const getAppointmentColor = (type: string) => {
		switch (type) {
			case 'emergency':
				return 'bg-gentle-red text-gentle-red-dark border-gentle-red-dark'
			case 'vaccine':
				return 'bg-doctor-green text-white'
			case 'followup':
				return 'bg-fun-purple text-white'
			default:
				return 'bg-doctor-blue text-white'
		}
	}

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
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
							📅 Appointments
						</h1>
						<Link
							to="/appointments/new"
							className="rounded-full bg-happy-orange px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-happy-orange-dark"
						>
							+ Book Appointment
						</Link>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Calendar/Date Picker */}
					<div className="lg:col-span-1">
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-4 text-2xl font-bold text-text-dark">
								📆 Select Date
							</h2>

							{/* Simple date navigation */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<button
										onClick={() => {
											const yesterday = new Date(selectedDate)
											yesterday.setDate(yesterday.getDate() - 1)
											setSelectedDate(yesterday)
										}}
										className="rounded-full bg-soft-gray p-2 hover:bg-medical-blue"
									>
										←
									</button>
									<div className="text-center">
										<div className="text-lg font-bold text-text-dark">
											{formatDate(selectedDate)}
										</div>
									</div>
									<button
										onClick={() => {
											const tomorrow = new Date(selectedDate)
											tomorrow.setDate(tomorrow.getDate() + 1)
											setSelectedDate(tomorrow)
										}}
										className="rounded-full bg-soft-gray p-2 hover:bg-medical-blue"
									>
										→
									</button>
								</div>

								{/* Quick date buttons */}
								<div className="grid grid-cols-2 gap-2">
									<button
										onClick={() => setSelectedDate(new Date())}
										className="rounded-lg bg-doctor-blue px-4 py-2 text-white hover:bg-doctor-blue-dark"
									>
										Today
									</button>
									<button
										onClick={() => {
											const tomorrow = new Date()
											tomorrow.setDate(tomorrow.getDate() + 1)
											setSelectedDate(tomorrow)
										}}
										className="rounded-lg bg-doctor-green px-4 py-2 text-white hover:bg-doctor-green-dark"
									>
										Tomorrow
									</button>
								</div>
							</div>

							{/* Daily stats */}
							<div className="mt-6 space-y-2 rounded-lg bg-soft-gray p-4">
								<div className="flex justify-between text-sm">
									<span>Total Appointments:</span>
									<span className="font-bold">{todayAppointments.length}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Emergency Visits:</span>
									<span className="font-bold text-gentle-red-dark">
										{
											todayAppointments.filter((a) => a.type === 'emergency')
												.length
										}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Available Slots:</span>
									<span className="font-bold text-doctor-green-dark">
										{timeSlots.length - todayAppointments.length}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Schedule Grid */}
					<div className="lg:col-span-2">
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-6 text-2xl font-bold text-text-dark">
								🕐 Daily Schedule
							</h2>

							{/* Time slots */}
							<div className="space-y-2">
								{timeSlots.map((time) => {
									const appointment = getAppointmentForTimeSlot(time)
									return (
										<div key={time} className="flex items-center gap-4">
											<div className="w-16 text-right text-sm font-medium text-warm-gray">
												{time}
											</div>
											<div className="flex-1">
												{appointment ? (
													<div
														className={`rounded-lg border-2 p-3 ${getAppointmentColor(appointment.type)}`}
													>
														<div className="font-semibold">
															{appointment.patientName}
														</div>
														<div className="text-sm opacity-90">
															{appointment.type} - {appointment.duration} min
														</div>
														{appointment.notes && (
															<div className="mt-1 text-sm opacity-75">
																{appointment.notes}
															</div>
														)}
													</div>
												) : (
													<Link
														to={`/appointments/new?date=${selectedDate.toISOString().split('T')[0]}&time=${time}`}
														className="block rounded-lg border-2 border-dashed border-medical-blue p-3 text-center text-warm-gray transition-all duration-200 hover:border-doctor-blue hover:bg-medical-light"
													>
														+ Available
													</Link>
												)}
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>

				{/* Appointment Types Legend */}
				<div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
					<h3 className="mb-4 text-lg font-bold text-text-dark">
						Appointment Types
					</h3>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 rounded bg-doctor-blue"></div>
							<span className="text-sm">Checkup</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 rounded bg-gentle-red"></div>
							<span className="text-sm">Emergency</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 rounded bg-doctor-green"></div>
							<span className="text-sm">Vaccine</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 rounded bg-fun-purple"></div>
							<span className="text-sm">Follow-up</span>
						</div>
					</div>
				</div>

				{/* Today's Summary */}
				{todayAppointments.length > 0 && (
					<div className="mt-8 rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
						<div className="text-center text-white">
							<div className="mb-2 text-4xl">🎉</div>
							<p className="text-lg font-medium">
								You have {todayAppointments.length} patients to help today!
							</p>
							<p className="text-sm opacity-90">
								Remember to be gentle and make everyone smile! 😊
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
