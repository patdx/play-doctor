import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAppointmentsStore } from '~/stores/appointments'
import { usePatientsStore } from '~/stores/patients'
import { KID_FRIENDLY_CONDITIONS, TREATMENTS } from '~/types/medical'
import { generateId } from '~/stores/patients'

export function meta({ params }: { params: { id: string } }) {
	return [
		{ title: `Treatment - Play Doctor` },
		{ name: 'description', content: 'Treat patient and document visit' },
	]
}

export default function TreatmentDetail() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const getAppointment = useAppointmentsStore((state) => state.getAppointment)
	const updateAppointment = useAppointmentsStore(
		(state) => state.updateAppointment,
	)
	const completeAppointment = useAppointmentsStore(
		(state) => state.completeAppointment,
	)
	const getPatient = usePatientsStore((state) => state.getPatient)
	const updatePatient = usePatientsStore((state) => state.updatePatient)

	const appointment = getAppointment(id || '')
	const patient = appointment ? getPatient(appointment.patientId) : null

	const [treatmentData, setTreatmentData] = useState({
		condition: '',
		treatment: '',
		notes: '',
		prescription: '',
		followUpNeeded: false,
		followUpDate: '',
	})

	const [currentStep, setCurrentStep] = useState(1)
	const [vitals, setVitals] = useState({
		temperature: '98.6',
		weight: '',
		height: '',
		heartRate: '',
		bloodPressure: '',
	})

	useEffect(() => {
		if (!appointment) {
			navigate('/treatment')
		}
	}, [appointment, navigate])

	if (!appointment || !patient) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-medical-light to-doctor-blue">
				<div className="container mx-auto px-6 py-8">
					<div className="rounded-2xl bg-white p-12 text-center shadow-lg">
						<div className="mb-4 text-6xl">🏥</div>
						<h1 className="mb-4 text-2xl font-bold text-text-dark">
							Appointment Not Found
						</h1>
						<p className="mb-6 text-warm-gray">
							Sorry, we couldn't find this appointment.
						</p>
						<Link
							to="/treatment"
							className="inline-block rounded-full bg-doctor-green px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-doctor-green-dark"
						>
							Back to Treatment Room
						</Link>
					</div>
				</div>
			</div>
		)
	}

	const handleVitalsUpdate = (field: string, value: string) => {
		setVitals((prev) => ({ ...prev, [field]: value }))
	}

	const handleTreatmentSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Create medical record
		const medicalRecord = {
			id: generateId(),
			patientId: patient.id,
			condition: treatmentData.condition,
			treatment: treatmentData.treatment,
			notes: treatmentData.notes,
			visitDate: new Date(),
			doctorName: 'Dr. Friendly',
		}

		// Update patient with new medical record
		updatePatient(patient.id, {
			medicalHistory: [...patient.medicalHistory, medicalRecord],
		})

		// Complete the appointment
		completeAppointment(appointment.id)

		// Navigate back to treatment room
		navigate('/treatment')
	}

	const getStepTitle = () => {
		switch (currentStep) {
			case 1:
				return '🩺 Patient Check-in'
			case 2:
				return '🌡️ Vitals & Assessment'
			case 3:
				return '💊 Diagnosis & Treatment'
			case 4:
				return '📋 Summary & Complete'
			default:
				return 'Treatment'
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-medical-light to-doctor-blue">
			<div className="container mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						to="/treatment"
						className="mb-4 inline-flex items-center text-text-dark hover:text-doctor-blue"
					>
						← Back to Treatment Room
					</Link>
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold text-text-dark">
								{getStepTitle()}
							</h1>
							<p className="text-lg text-warm-gray">Treating {patient.name}</p>
						</div>
						<div className="text-right">
							<div className="text-lg font-semibold text-white">
								{appointment.time} • {appointment.type}
							</div>
							<div className="text-sm text-white/80">
								Step {currentStep} of 4
							</div>
						</div>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="mb-8">
					<div className="mb-2 flex items-center justify-between">
						{[1, 2, 3, 4].map((step) => (
							<div
								key={step}
								className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
									currentStep >= step
										? 'bg-doctor-green text-white'
										: 'bg-soft-gray text-warm-gray'
								}`}
							>
								{step}
							</div>
						))}
					</div>
					<div className="h-2 overflow-hidden rounded-full bg-soft-gray">
						<div
							className="h-full bg-doctor-green transition-all duration-300"
							style={{ width: `${(currentStep / 4) * 100}%` }}
						/>
					</div>
				</div>

				{/* Patient Info Card */}
				<div className="mb-8 rounded-3xl bg-white p-6 shadow-xl">
					<div className="flex items-center gap-4">
						<div
							className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
							style={{ backgroundColor: `${patient.favoriteColor}20` }}
						>
							{patient.avatar}
						</div>
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-text-dark">
								{patient.name}
							</h2>
							<div className="text-warm-gray">
								Age {patient.age} • {patient.favoriteColor} •{' '}
								{patient.medicalHistory.length} previous visits
							</div>
						</div>
						<div className="text-right">
							<div className="text-lg font-semibold text-doctor-blue">
								{appointment.type}
							</div>
							<div className="text-sm text-warm-gray">
								{appointment.duration} minutes
							</div>
						</div>
					</div>
				</div>

				{/* Treatment Steps */}
				<div className="mb-8">
					{currentStep === 1 && (
						<div className="rounded-2xl bg-white p-8 shadow-lg">
							<h3 className="mb-6 text-2xl font-bold text-text-dark">
								🩺 Patient Check-in
							</h3>
							<div className="space-y-6">
								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Reason for Visit
									</label>
									<div className="rounded-2xl bg-medical-light p-4">
										<p className="text-warm-gray">
											{appointment.notes || 'Regular checkup'}
										</p>
									</div>
								</div>

								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										How are you feeling today?
									</label>
									<div className="grid gap-3 sm:grid-cols-2">
										{[
											'Great!',
											'A little sick',
											'Not so good',
											'Really sick',
										].map((feeling) => (
											<button
												key={feeling}
												className="rounded-2xl border-2 border-medical-blue p-4 text-left transition-all duration-200 hover:border-doctor-blue hover:bg-medical-light"
											>
												<div className="text-lg">{feeling}</div>
											</button>
										))}
									</div>
								</div>

								<div className="flex justify-end">
									<button
										onClick={() => setCurrentStep(2)}
										className="rounded-full bg-doctor-green px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-doctor-green-dark"
									>
										Continue to Vitals →
									</button>
								</div>
							</div>
						</div>
					)}

					{currentStep === 2 && (
						<div className="rounded-2xl bg-white p-8 shadow-lg">
							<h3 className="mb-6 text-2xl font-bold text-text-dark">
								🌡️ Vitals & Assessment
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Temperature (°F)
									</label>
									<input
										type="text"
										value={vitals.temperature}
										onChange={(e) =>
											handleVitalsUpdate('temperature', e.target.value)
										}
										className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
										placeholder="98.6"
									/>
								</div>

								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Weight (lbs)
									</label>
									<input
										type="text"
										value={vitals.weight}
										onChange={(e) =>
											handleVitalsUpdate('weight', e.target.value)
										}
										className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
										placeholder="Weight"
									/>
								</div>

								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Height (in)
									</label>
									<input
										type="text"
										value={vitals.height}
										onChange={(e) =>
											handleVitalsUpdate('height', e.target.value)
										}
										className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
										placeholder="Height"
									/>
								</div>

								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Heart Rate
									</label>
									<input
										type="text"
										value={vitals.heartRate}
										onChange={(e) =>
											handleVitalsUpdate('heartRate', e.target.value)
										}
										className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
										placeholder="BPM"
									/>
								</div>
							</div>

							<div className="mt-6 flex justify-between">
								<button
									onClick={() => setCurrentStep(1)}
									className="rounded-full bg-warm-gray px-8 py-3 font-semibold text-white hover:bg-gray-500"
								>
									← Back
								</button>
								<button
									onClick={() => setCurrentStep(3)}
									className="rounded-full bg-doctor-green px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-doctor-green-dark"
								>
									Continue to Diagnosis →
								</button>
							</div>
						</div>
					)}

					{currentStep === 3 && (
						<div className="rounded-2xl bg-white p-8 shadow-lg">
							<h3 className="mb-6 text-2xl font-bold text-text-dark">
								💊 Diagnosis & Treatment
							</h3>
							<form onSubmit={handleTreatmentSubmit} className="space-y-6">
								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Condition
									</label>
									<select
										value={treatmentData.condition}
										onChange={(e) =>
											setTreatmentData({
												...treatmentData,
												condition: e.target.value,
											})
										}
										className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
										required
									>
										<option value="">Select a condition...</option>
										{KID_FRIENDLY_CONDITIONS.map((condition) => (
											<option key={condition} value={condition}>
												{condition}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Treatment
									</label>
									<select
										value={treatmentData.treatment}
										onChange={(e) =>
											setTreatmentData({
												...treatmentData,
												treatment: e.target.value,
											})
										}
										className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
										required
									>
										<option value="">Select a treatment...</option>
										{TREATMENTS.map((treatment) => (
											<option key={treatment} value={treatment}>
												{treatment}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Notes
									</label>
									<textarea
										value={treatmentData.notes}
										onChange={(e) =>
											setTreatmentData({
												...treatmentData,
												notes: e.target.value,
											})
										}
										className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
										rows={4}
										placeholder="Add notes about the visit..."
									/>
								</div>

								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Prescription (Fun play medicine)
									</label>
									<input
										type="text"
										value={treatmentData.prescription}
										onChange={(e) =>
											setTreatmentData({
												...treatmentData,
												prescription: e.target.value,
											})
										}
										className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
										placeholder="Magic bandaids, happy pills, etc."
									/>
								</div>

								<div className="flex justify-between">
									<button
										type="button"
										onClick={() => setCurrentStep(2)}
										className="rounded-full bg-warm-gray px-8 py-3 font-semibold text-white hover:bg-gray-500"
									>
										← Back
									</button>
									<button
										type="button"
										onClick={() => setCurrentStep(4)}
										className="rounded-full bg-doctor-green px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-doctor-green-dark"
									>
										Review & Complete →
									</button>
								</div>
							</form>
						</div>
					)}

					{currentStep === 4 && (
						<div className="rounded-2xl bg-white p-8 shadow-lg">
							<h3 className="mb-6 text-2xl font-bold text-text-dark">
								📋 Visit Summary
							</h3>
							<div className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<h4 className="mb-2 font-semibold text-text-dark">
											Patient
										</h4>
										<p className="text-warm-gray">{patient.name}</p>
									</div>
									<div>
										<h4 className="mb-2 font-semibold text-text-dark">
											Condition
										</h4>
										<p className="text-warm-gray">{treatmentData.condition}</p>
									</div>
									<div>
										<h4 className="mb-2 font-semibold text-text-dark">
											Treatment
										</h4>
										<p className="text-warm-gray">{treatmentData.treatment}</p>
									</div>
									<div>
										<h4 className="mb-2 font-semibold text-text-dark">
											Prescription
										</h4>
										<p className="text-warm-gray">
											{treatmentData.prescription || 'None'}
										</p>
									</div>
								</div>

								{treatmentData.notes && (
									<div>
										<h4 className="mb-2 font-semibold text-text-dark">Notes</h4>
										<div className="rounded-lg bg-medical-light p-4">
											<p className="text-warm-gray">{treatmentData.notes}</p>
										</div>
									</div>
								)}

								<div className="rounded-lg bg-doctor-green/10 p-6 text-center">
									<div className="mb-2 text-4xl">🎉</div>
									<h4 className="mb-2 text-lg font-semibold text-doctor-green">
										Ready to complete the visit!
									</h4>
									<p className="text-warm-gray">
										This will add the medical record to {patient.name}'s file
										and mark the appointment as completed.
									</p>
								</div>

								<div className="flex justify-between">
									<button
										onClick={() => setCurrentStep(3)}
										className="rounded-full bg-warm-gray px-8 py-3 font-semibold text-white hover:bg-gray-500"
									>
										← Back
									</button>
									<button
										onClick={handleTreatmentSubmit}
										className="rounded-full bg-doctor-green px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-doctor-green-dark"
									>
										✅ Complete Visit
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
