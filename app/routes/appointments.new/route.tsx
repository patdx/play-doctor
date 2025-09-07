import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import type { Appointment } from '~/types/medical'
import { usePatientsStore } from '~/stores/patients'
import { useAppointmentsStore } from '~/stores/appointments'
import { generateId } from '~/stores/patients'

export function meta() {
	return [
		{ title: 'Book Appointment - Play Doctor' },
		{ name: 'description', content: 'Schedule a new patient appointment' },
	]
}

export default function NewAppointment() {
	const navigate = useNavigate()
	const patients = usePatientsStore((state) => state.patients)
	const addAppointment = useAppointmentsStore((state) => state.addAppointment)
	const [selectedPatient, setSelectedPatient] = useState('')
	const [appointmentType, setAppointmentType] = useState<
		'checkup' | 'emergency' | 'vaccine' | 'followup'
	>('checkup')

	// Get URL params for pre-filled date/time
	const [prefilledDate, setPrefilledDate] = useState('')
	const [prefilledTime, setPrefilledTime] = useState('')

	useEffect(() => {
		// Get URL search params on client side
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search)
			const date = urlParams.get('date')
			const time = urlParams.get('time')
			if (date) setPrefilledDate(date)
			if (time) setPrefilledTime(time)
		}
	}, [])

	// Get duration based on appointment type
	const getDuration = (type: string) => {
		switch (type) {
			case 'emergency':
				return 60
			case 'vaccine':
				return 15
			case 'followup':
				return 30
			default:
				return 45
		}
	}

	// Get appointment type info
	const getAppointmentTypeInfo = (type: string) => {
		switch (type) {
			case 'emergency':
				return {
					icon: '🚨',
					description: 'Urgent medical attention needed',
					color: 'text-[--color-gentle-red-dark]',
				}
			case 'vaccine':
				return {
					icon: '💉',
					description: 'Fun immunity boosters!',
					color: 'text-[--color-doctor-green-dark]',
				}
			case 'followup':
				return {
					icon: '🔄',
					description: 'Check how the patient is doing',
					color: 'text-[--color-fun-purple-dark]',
				}
			default:
				return {
					icon: '🩺',
					description: 'Regular wellness visit',
					color: 'text-[--color-doctor-blue-dark]',
				}
		}
	}

	const selectedPatientData = patients.find((p) => p.id === selectedPatient)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const patientId = formData.get('patientId') as string
		const patientName = formData.get('patientName') as string
		const date = new Date(formData.get('date') as string)
		const time = formData.get('time') as string
		const type = formData.get('type') as
			| 'checkup'
			| 'emergency'
			| 'vaccine'
			| 'followup'
		const duration = parseInt(formData.get('duration') as string)
		const notes = (formData.get('notes') as string) || undefined

		const newAppointment: Appointment = {
			id: generateId(),
			patientId,
			patientName,
			date,
			time,
			type,
			status: 'scheduled',
			duration,
			notes,
		}

		addAppointment(newAppointment)
		navigate('/appointments')
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[--color-medical-light] to-[--color-doctor-blue]">
			<div className="container mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						to="/appointments"
						className="mb-4 inline-flex items-center text-[--color-text-dark] hover:text-[--color-doctor-blue]"
					>
						← Back to Appointments
					</Link>
					<h1 className="text-4xl font-bold text-[--color-text-dark]">
						📅 Book New Appointment
					</h1>
					<p className="mt-2 text-lg text-[--color-warm-gray]">
						Let's schedule some healing time for one of your patients!
					</p>
				</div>

				{/* Booking Form */}
				<div className="mx-auto max-w-2xl">
					<form
						onSubmit={handleSubmit}
						className="rounded-3xl bg-white p-8 shadow-xl"
					>
						{/* Patient Selection */}
						<div className="mb-6">
							<label className="mb-2 block text-lg font-semibold text-[--color-text-dark]">
								Which patient needs to visit?
							</label>
							{patients.length === 0 ? (
								<div className="rounded-2xl border-2 border-[--color-medical-blue] p-6 text-center">
									<div className="mb-2 text-4xl">😊</div>
									<p className="mb-4 text-[--color-warm-gray]">
										You need to add patients before booking appointments!
									</p>
									<Link
										to="/patients/new"
										className="inline-block rounded-full bg-[--color-doctor-green] px-6 py-2 font-semibold text-white hover:bg-[--color-doctor-green-dark]"
									>
										Add Your First Patient
									</Link>
								</div>
							) : (
								<select
									name="patientId"
									value={selectedPatient}
									onChange={(e) => setSelectedPatient(e.target.value)}
									required
									className="w-full rounded-2xl border-2 border-[--color-medical-blue] px-4 py-3 text-lg focus:border-[--color-doctor-blue] focus:outline-none"
								>
									<option value="">Choose a patient...</option>
									{patients.map((patient) => (
										<option key={patient.id} value={patient.id}>
											{patient.avatar} {patient.name} (Age {patient.age})
										</option>
									))}
								</select>
							)}
							{selectedPatientData && (
								<input
									type="hidden"
									name="patientName"
									value={selectedPatientData.name}
								/>
							)}
						</div>

						{/* Patient Preview */}
						{selectedPatientData && (
							<div className="mb-6 rounded-2xl bg-[--color-medical-light] p-4">
								<div className="flex items-center gap-4">
									<div
										className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
										style={{
											backgroundColor: `${selectedPatientData.favoriteColor}30`,
										}}
									>
										{selectedPatientData.avatar}
									</div>
									<div>
										<h3 className="font-semibold text-[--color-text-dark]">
											{selectedPatientData.name}
										</h3>
										<p className="text-[--color-warm-gray]">
											Age {selectedPatientData.age} • Last visit:{' '}
											{selectedPatientData.medicalHistory.length > 0
												? 'Recently'
												: 'First time!'}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Date and Time */}
						<div className="mb-6 grid gap-4 sm:grid-cols-2">
							<div>
								<label className="mb-2 block text-lg font-semibold text-[--color-text-dark]">
									Date
								</label>
								<input
									type="date"
									name="date"
									defaultValue={
										prefilledDate || new Date().toISOString().split('T')[0]
									}
									required
									className="w-full rounded-2xl border-2 border-[--color-medical-blue] px-4 py-3 text-lg focus:border-[--color-doctor-blue] focus:outline-none"
								/>
							</div>
							<div>
								<label className="mb-2 block text-lg font-semibold text-[--color-text-dark]">
									Time
								</label>
								<select
									name="time"
									defaultValue={prefilledTime}
									required
									className="w-full rounded-2xl border-2 border-[--color-medical-blue] px-4 py-3 text-lg focus:border-[--color-doctor-blue] focus:outline-none"
								>
									<option value="">Select time...</option>
									{Array.from({ length: 17 }, (_, i) => {
										const hour = Math.floor(i / 2) + 9
										const minute = i % 2 === 0 ? '00' : '30'
										const time = `${hour.toString().padStart(2, '0')}:${minute}`
										return (
											<option key={time} value={time}>
												{time}
											</option>
										)
									})}
								</select>
							</div>
						</div>

						{/* Appointment Type */}
						<div className="mb-6">
							<label className="mb-4 block text-lg font-semibold text-[--color-text-dark]">
								Type of Visit
							</label>
							<div className="grid gap-3 sm:grid-cols-2">
								{(['checkup', 'emergency', 'vaccine', 'followup'] as const).map(
									(type) => {
										const info = getAppointmentTypeInfo(type)
										return (
											<button
												key={type}
												type="button"
												onClick={() => setAppointmentType(type)}
												className={`rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
													appointmentType === type
														? 'border-[--color-doctor-blue] bg-[--color-medical-light] shadow-md'
														: 'border-[--color-soft-gray] hover:border-[--color-medical-blue]'
												}`}
											>
												<div className="flex items-center gap-3">
													<span className="text-2xl">{info.icon}</span>
													<div>
														<div
															className={`font-semibold capitalize ${info.color}`}
														>
															{type}
														</div>
														<div className="text-sm text-[--color-warm-gray]">
															{info.description}
														</div>
														<div className="text-sm font-medium text-[--color-text-dark]">
															{getDuration(type)} minutes
														</div>
													</div>
												</div>
											</button>
										)
									},
								)}
							</div>
							<input type="hidden" name="type" value={appointmentType} />
							<input
								type="hidden"
								name="duration"
								value={getDuration(appointmentType)}
							/>
						</div>

						{/* Notes */}
						<div className="mb-8">
							<label className="mb-2 block text-lg font-semibold text-[--color-text-dark]">
								Special Notes (Optional)
							</label>
							<textarea
								name="notes"
								rows={3}
								className="w-full rounded-2xl border-2 border-[--color-medical-blue] px-4 py-3 text-lg focus:border-[--color-doctor-blue] focus:outline-none"
								placeholder="Any special things to remember for this visit?"
							/>
						</div>

						{/* Submit Buttons */}
						<div className="flex gap-4">
							<Link
								to="/appointments"
								className="flex-1 rounded-2xl bg-[--color-warm-gray] py-4 text-center text-lg font-semibold text-white transition-all duration-300 hover:bg-gray-500"
							>
								Cancel
							</Link>
							<button
								type="submit"
								disabled={!selectedPatient || patients.length === 0}
								className="flex-1 rounded-2xl bg-[--color-doctor-green] py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[--color-doctor-green-dark] disabled:cursor-not-allowed disabled:opacity-50"
							>
								📅 Book Appointment
							</button>
						</div>
					</form>
				</div>

				{/* Helpful tip */}
				<div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white/20 p-6 text-center backdrop-blur-sm">
					<div className="mb-2 text-4xl">🌟</div>
					<p className="font-medium text-white">
						Tip: Emergency appointments take longer, but vaccines are quick!
					</p>
				</div>
			</div>
		</div>
	)
}
