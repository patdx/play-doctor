import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAppointmentsStore } from '~/stores/appointments'
import { usePatientsStore } from '~/stores/patients'
import type { AppointmentType } from '~/types/medical'

export function meta() {
	return [
		{ title: 'Walk-in Registration - Play Doctor' },
		{
			name: 'description',
			content: 'Register walk-in patients for immediate care',
		},
	]
}

export default function WalkInRegistration() {
	const navigate = useNavigate()
	const patients = usePatientsStore((state) => state.patients)
	const addWalkInAppointment = useAppointmentsStore(
		(state) => state.addWalkInAppointment,
	)

	const [selectedPatientId, setSelectedPatientId] = useState('')
	const [appointmentType, setAppointmentType] =
		useState<AppointmentType>('checkup')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!selectedPatientId) {
			alert('Please select a patient')
			return
		}

		setIsSubmitting(true)

		const selectedPatient = patients.find((p) => p.id === selectedPatientId)
		if (!selectedPatient) {
			alert('Patient not found')
			setIsSubmitting(false)
			return
		}

		// Add walk-in appointment
		addWalkInAppointment(
			selectedPatientId,
			selectedPatient.name,
			appointmentType,
		)

		// Navigate to check-in page
		navigate('/checkin')
	}

	const appointmentTypes: {
		value: AppointmentType
		label: string
		emoji: string
	}[] = [
		{ value: 'checkup', label: 'Regular Checkup', emoji: '🩺' },
		{ value: 'emergency', label: 'Emergency', emoji: '🚨' },
		{ value: 'vaccine', label: 'Vaccination', emoji: '💉' },
		{ value: 'followup', label: 'Follow-up Visit', emoji: '📋' },
	]

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
					<h1 className="text-4xl font-bold text-text-dark">
						🚶‍♂️ Walk-in Registration
					</h1>
					<p className="mt-2 text-lg text-white">
						Register a patient for immediate care without an appointment
					</p>
				</div>

				<div className="mx-auto max-w-2xl">
					{/* Registration Form */}
					<div className="rounded-2xl bg-white p-8 shadow-xl">
						<form onSubmit={handleSubmit}>
							{/* Patient Selection */}
							<div className="mb-6">
								<label className="mb-3 block text-lg font-semibold text-text-dark">
									Select Patient
								</label>
								{patients.length === 0 ? (
									<div className="rounded-lg bg-soft-gray p-4">
										<p className="mb-4 text-center text-warm-gray">
											No patients found. You need to add patients first.
										</p>
										<Link
											to="/patients/new"
											className="block w-full rounded-full bg-doctor-green px-6 py-3 text-center font-semibold text-white hover:bg-doctor-green-dark"
										>
											➕ Add New Patient
										</Link>
									</div>
								) : (
									<>
										<select
											value={selectedPatientId}
											onChange={(e) => setSelectedPatientId(e.target.value)}
											className="w-full rounded-lg border-2 border-soft-gray bg-white p-4 text-lg focus:border-doctor-blue focus:outline-none"
											required
										>
											<option value="">Choose a patient...</option>
											{patients.map((patient) => (
												<option key={patient.id} value={patient.id}>
													{patient.avatar} {patient.name} (Age {patient.age})
												</option>
											))}
										</select>
										<div className="mt-3">
											<Link
												to="/patients/new"
												className="inline-flex items-center text-doctor-blue hover:text-doctor-blue-dark"
											>
												➕ Add New Patient
											</Link>
										</div>
									</>
								)}
							</div>

							{/* Appointment Type */}
							<div className="mb-6">
								<label className="mb-3 block text-lg font-semibold text-text-dark">
									Type of Visit
								</label>
								<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
									{appointmentTypes.map((type) => (
										<label
											key={type.value}
											className={`cursor-pointer rounded-lg border-2 p-4 transition duration-300 ${
												appointmentType === type.value
													? 'border-doctor-blue bg-doctor-blue/10'
													: 'border-soft-gray bg-white hover:border-doctor-blue'
											}`}
										>
											<input
												type="radio"
												name="appointmentType"
												value={type.value}
												checked={appointmentType === type.value}
												onChange={(e) =>
													setAppointmentType(e.target.value as AppointmentType)
												}
												className="sr-only"
											/>
											<div className="flex items-center gap-3">
												<span className="text-2xl">{type.emoji}</span>
												<div>
													<div className="font-semibold text-text-dark">
														{type.label}
													</div>
													{type.value === 'emergency' && (
														<div className="text-sm text-gentle-red">
															High Priority
														</div>
													)}
												</div>
											</div>
										</label>
									))}
								</div>
							</div>

							{/* Submit Button */}
							<div className="flex gap-4">
								<button
									type="submit"
									disabled={isSubmitting || !selectedPatientId}
									className="flex-1 rounded-full bg-doctor-green px-8 py-4 text-lg font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-doctor-green-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
								>
									{isSubmitting ? (
										'Adding to Queue...'
									) : (
										<>🏥 Add to Waiting Room</>
									)}
								</button>
								<Link
									to="/checkin"
									className="rounded-full bg-white px-6 py-4 font-semibold text-doctor-blue shadow-lg transition duration-300 hover:scale-105 hover:bg-soft-gray"
								>
									View Queue
								</Link>
							</div>
						</form>
					</div>

					{/* Quick Info */}
					<div className="mt-8 rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
						<h3 className="mb-4 text-xl font-bold text-white">
							ℹ️ How Walk-ins Work
						</h3>
						<ul className="space-y-2 text-white">
							<li>• Walk-in patients are added directly to the waiting room</li>
							<li>• Emergency cases get priority treatment</li>
							<li>• Patients will be seen in order of arrival</li>
							<li>• No appointment time needed - seen when available</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
