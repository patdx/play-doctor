import { Link, useParams } from 'react-router'
import { useState } from 'react'
import type { Patient } from '~/types/medical'
import { usePatientsStore } from '~/stores/patients'
import { useAppointmentsStore } from '~/stores/appointments'
import { KID_FRIENDLY_CONDITIONS, TREATMENTS } from '~/types/medical'
import { generateId } from '~/stores/patients'

export function meta({ params }: { params: { id: string } }) {
	return [
		{ title: `${params.id} - Patient Details - Play Doctor` },
		{
			name: 'description',
			content: 'View patient details and medical history',
		},
	]
}

export default function PatientDetail() {
	const { id } = useParams<{ id: string }>()
	const getPatient = usePatientsStore((state) => state.getPatient)
	const updatePatient = usePatientsStore((state) => state.updatePatient)
	const getAppointmentsByPatient = useAppointmentsStore(
		(state) => state.getAppointmentsByPatient,
	)

	const patient = getPatient(id || '')
	const patientAppointments = patient
		? getAppointmentsByPatient(patient.id)
		: []

	const [showAddRecord, setShowAddRecord] = useState(false)
	const [newRecord, setNewRecord] = useState({
		condition: '',
		treatment: '',
		notes: '',
	})

	if (!patient) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-medical-light to-doctor-blue">
				<div className="container mx-auto px-6 py-8">
					<div className="rounded-2xl bg-white p-12 text-center shadow-lg">
						<div className="mb-4 text-6xl">🏥</div>
						<h1 className="mb-4 text-2xl font-bold text-text-dark">
							Patient Not Found
						</h1>
						<p className="mb-6 text-warm-gray">
							Sorry, we couldn't find this patient in our records.
						</p>
						<Link
							to="/patients"
							className="inline-block rounded-full bg-doctor-green px-8 py-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-doctor-green-dark"
						>
							Back to Patients
						</Link>
					</div>
				</div>
			</div>
		)
	}

	const handleAddRecord = (e: React.FormEvent) => {
		e.preventDefault()
		if (!newRecord.condition || !newRecord.treatment) return

		const medicalRecord = {
			id: generateId(),
			patientId: patient.id,
			condition: newRecord.condition,
			treatment: newRecord.treatment,
			notes: newRecord.notes,
			visitDate: new Date(),
			doctorName: 'Dr. Friendly',
		}

		updatePatient(patient.id, {
			medicalHistory: [...patient.medicalHistory, medicalRecord],
		})

		setNewRecord({ condition: '', treatment: '', notes: '' })
		setShowAddRecord(false)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-medical-light to-doctor-blue">
			<div className="container mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						to="/patients"
						className="mb-4 inline-flex items-center text-text-dark hover:text-doctor-blue"
					>
						← Back to Patients
					</Link>
					<div className="flex items-center justify-between">
						<h1 className="text-4xl font-bold text-text-dark">
							Patient Details
						</h1>
					</div>
				</div>

				{/* Patient Info Card */}
				<div className="mb-8 rounded-3xl bg-white p-8 shadow-xl">
					<div className="flex flex-col items-center sm:flex-row sm:items-start">
						{/* Patient Avatar */}
						<div
							className="mb-4 flex h-24 w-24 items-center justify-center rounded-full text-5xl shadow-lg sm:mr-8 sm:mb-0"
							style={{ backgroundColor: `${patient.favoriteColor}20` }}
						>
							{patient.avatar}
						</div>

						{/* Patient Details */}
						<div className="flex-1 text-center sm:text-left">
							<h2 className="mb-2 text-3xl font-bold text-text-dark">
								{patient.name}
							</h2>
							<div className="mb-4 text-lg text-warm-gray">
								<span className="mr-4">Age {patient.age}</span>
								<span className="mr-4">•</span>
								<span>Loves {patient.favoriteColor}</span>
							</div>
							<div className="mb-4 flex flex-wrap gap-2">
								<span className="rounded-full bg-doctor-green px-4 py-2 text-sm font-medium text-white">
									😊 Feeling Great!
								</span>
								<span className="rounded-full bg-medical-blue px-4 py-2 text-sm font-medium text-white">
									📅 {patientAppointments.length} appointments
								</span>
								<span className="rounded-full bg-happy-orange px-4 py-2 text-sm font-medium text-white">
									🎂 Joined {patient.createdAt.toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Medical History Section */}
				<div className="mb-8">
					<div className="mb-6 flex items-center justify-between">
						<h3 className="text-2xl font-bold text-text-dark">
							🏥 Medical History
						</h3>
						<button
							onClick={() => setShowAddRecord(!showAddRecord)}
							className="rounded-full bg-doctor-green px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-doctor-green-dark"
						>
							{showAddRecord ? 'Cancel' : '+ Add Visit Record'}
						</button>
					</div>

					{/* Add Record Form */}
					{showAddRecord && (
						<div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
							<form onSubmit={handleAddRecord} className="space-y-4">
								<div>
									<label className="mb-2 block text-lg font-semibold text-text-dark">
										Condition
									</label>
									<select
										value={newRecord.condition}
										onChange={(e) =>
											setNewRecord({ ...newRecord, condition: e.target.value })
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
										value={newRecord.treatment}
										onChange={(e) =>
											setNewRecord({ ...newRecord, treatment: e.target.value })
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
										value={newRecord.notes}
										onChange={(e) =>
											setNewRecord({ ...newRecord, notes: e.target.value })
										}
										className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
										rows={3}
										placeholder="Add any additional notes about the visit..."
									/>
								</div>

								<button
									type="submit"
									className="w-full rounded-2xl bg-doctor-green py-4 text-lg font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-doctor-green-dark"
								>
									🎉 Add Medical Record
								</button>
							</form>
						</div>
					)}

					{/* Medical Records List */}
					{patient.medicalHistory.length === 0 ? (
						<div className="rounded-2xl bg-white p-12 text-center shadow-lg">
							<div className="mb-4 text-6xl">📋</div>
							<h3 className="mb-4 text-xl font-bold text-text-dark">
								No Medical Records Yet
							</h3>
							<p className="text-warm-gray">
								This patient hasn't had any visits yet. Add their first medical
								record!
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{patient.medicalHistory
								.slice()
								.reverse()
								.map((record) => (
									<div
										key={record.id}
										className="rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:shadow-xl"
									>
										<div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
											<div className="mb-4 sm:mb-0">
												<h4 className="mb-2 text-xl font-bold text-text-dark">
													{record.condition}
												</h4>
												<p className="mb-2 text-warm-gray">
													<strong>Treatment:</strong> {record.treatment}
												</p>
												{record.notes && (
													<p className="text-warm-gray">
														<strong>Notes:</strong> {record.notes}
													</p>
												)}
											</div>
											<div className="text-right">
												<div className="mb-1 text-sm text-warm-gray">
													{record.visitDate.toLocaleDateString()}
												</div>
												<div className="text-sm font-medium text-doctor-blue">
													Dr. {record.doctorName}
												</div>
											</div>
										</div>
									</div>
								))}
						</div>
					)}
				</div>

				{/* Appointment History */}
				<div className="mb-8">
					<div className="mb-6 flex items-center justify-between">
						<h3 className="text-2xl font-bold text-text-dark">
							📅 Appointment History
						</h3>
						<Link
							to="/appointments/new"
							state={{ patientId: patient.id }}
							className="rounded-full bg-doctor-blue px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-doctor-blue-dark"
						>
							+ Schedule Appointment
						</Link>
					</div>

					{patientAppointments.length === 0 ? (
						<div className="rounded-2xl bg-white p-12 text-center shadow-lg">
							<div className="mb-4 text-6xl">📅</div>
							<h3 className="mb-4 text-xl font-bold text-text-dark">
								No Appointments Yet
							</h3>
							<p className="text-warm-gray">
								This patient hasn't scheduled any appointments yet.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{patientAppointments
								.slice()
								.sort((a, b) => {
									const dateA =
										a.date instanceof Date ? a.date : new Date(a.date)
									const dateB =
										b.date instanceof Date ? b.date : new Date(b.date)
									return dateB.getTime() - dateA.getTime()
								})
								.map((appointment) => (
									<div
										key={appointment.id}
										className="rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:shadow-xl"
									>
										<div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
											<div className="mb-4 sm:mb-0">
												<h4 className="mb-2 text-xl font-bold text-text-dark">
													{appointment.type.charAt(0).toUpperCase() +
														appointment.type.slice(1)}
												</h4>
												<p className="mb-2 text-warm-gray">
													<strong>Date:</strong>{' '}
													{(appointment.date instanceof Date
														? appointment.date
														: new Date(appointment.date)
													).toLocaleDateString()}{' '}
													at {appointment.time}
												</p>
												<p className="mb-2 text-warm-gray">
													<strong>Duration:</strong> {appointment.duration}{' '}
													minutes
												</p>
												{appointment.notes && (
													<p className="text-warm-gray">
														<strong>Notes:</strong> {appointment.notes}
													</p>
												)}
											</div>
											<div className="flex flex-col items-end gap-2">
												<span
													className={`rounded-full px-3 py-1 text-xs font-medium ${
														appointment.status === 'completed'
															? 'bg-doctor-green text-white'
															: appointment.status === 'in-progress'
																? 'bg-doctor-blue text-white'
																: appointment.status === 'checked-in'
																	? 'bg-happy-orange text-white'
																	: appointment.status === 'cancelled'
																		? 'bg-gentle-red text-white'
																		: 'bg-soft-gray text-warm-gray'
													}`}
												>
													{appointment.status}
												</span>
												{appointment.status === 'scheduled' && (
													<Link
														to="/checkin"
														className="text-sm text-doctor-blue hover:text-doctor-blue-dark"
													>
														Check-in →
													</Link>
												)}
												{(appointment.status === 'checked-in' ||
													appointment.status === 'in-progress') && (
													<Link
														to={`/treatment/${appointment.id}`}
														className="text-sm text-doctor-green hover:text-doctor-green-dark"
													>
														Continue Treatment →
													</Link>
												)}
											</div>
										</div>
									</div>
								))}
						</div>
					)}
				</div>

				{/* Quick Actions */}
				<div className="rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
					<h3 className="mb-4 text-xl font-bold text-white">
						⚡ Quick Actions
					</h3>
					<div className="flex flex-wrap gap-4">
						<Link
							to="/appointments/new"
							state={{ patientId: patient.id }}
							className="rounded-full bg-white px-6 py-3 font-semibold text-doctor-blue shadow-lg transition duration-300 hover:scale-105"
						>
							📅 Schedule Appointment
						</Link>
						<Link
							to="/medical-tools"
							state={{ patientId: patient.id }}
							className="rounded-full bg-white px-6 py-3 font-semibold text-doctor-blue shadow-lg transition duration-300 hover:scale-105"
						>
							🩺 Use Medical Tools
						</Link>
						<Link
							to="/billing"
							state={{ patientId: patient.id }}
							className="rounded-full bg-white px-6 py-3 font-semibold text-doctor-blue shadow-lg transition duration-300 hover:scale-105"
						>
							💰 Create Bill
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
