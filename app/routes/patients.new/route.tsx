import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AVATAR_OPTIONS } from '~/types/medical'
import type { Patient } from '~/types/medical'
import { generateId, usePatientsStore } from '~/stores/patients'
import { useDoctorStore, AVAILABLE_BADGES } from '~/stores/doctor'
import { Input } from '~/components/ui/input'

export function meta() {
	return [
		{ title: 'Add New Patient - Play Doctor' },
		{ name: 'description', content: 'Register a new patient for your clinic' },
	]
}

export default function NewPatient() {
	const [selectedAvatar, setSelectedAvatar] = useState('🐱')
	const [selectedColor, setSelectedColor] = useState('blue')
	const navigate = useNavigate()
	const addPatient = usePatientsStore((state) => state.addPatient)
	const addExperience = useDoctorStore((state) => state.addExperience)
	const incrementPatientsHelped = useDoctorStore(
		(state) => state.incrementPatientsHelped,
	)
	const unlockBadge = useDoctorStore((state) => state.unlockBadge)
	const patientsCount = usePatientsStore((state) => state.patients.length)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const name = formData.get('name') as string
		const age = parseInt(formData.get('age') as string)

		if (!name || !age) return

		const newPatient: Patient = {
			id: generateId(),
			name,
			age,
			favoriteColor: selectedColor,
			avatar: selectedAvatar,
			medicalHistory: [],
			createdAt: new Date(),
			updatedAt: new Date(),
			isStarred: false,
		}

		// Add patient and gamification
		addPatient(newPatient)
		addExperience(10)
		incrementPatientsHelped()

		// Award first patient badge
		if (patientsCount === 0) {
			unlockBadge({
				...AVAILABLE_BADGES.FIRST_PATIENT,
				unlockedAt: new Date(),
			})
		}

		navigate('/patients')
	}

	const colors = [
		{ name: 'blue', value: '#4FC3F7', bg: 'bg-blue-400' },
		{ name: 'green', value: '#66BB6A', bg: 'bg-green-400' },
		{ name: 'purple', value: '#BA68C8', bg: 'bg-purple-400' },
		{ name: 'pink', value: '#F48FB1', bg: 'bg-pink-400' },
		{ name: 'orange', value: '#FFB74D', bg: 'bg-orange-400' },
		{ name: 'yellow', value: '#FFEB3B', bg: 'bg-yellow-400' },
		{ name: 'red', value: '#FFCDD2', bg: 'bg-red-300' },
	]

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
					<h1 className="text-4xl font-bold text-text-dark">
						👶 Add New Patient
					</h1>
					<p className="mt-2 text-lg text-warm-gray">
						Let's create a colorful medical record for your new patient!
					</p>
				</div>

				{/* Registration Form */}
				<div className="mx-auto max-w-2xl">
					<form
						onSubmit={handleSubmit}
						className="rounded-3xl bg-white p-8 shadow-xl"
					>
						{/* Patient Preview */}
						<div className="mb-8 text-center">
							<div
								className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full text-5xl shadow-lg"
								style={{
									backgroundColor:
										colors.find((c) => c.name === selectedColor)?.value + '40',
								}}
							>
								{selectedAvatar}
							</div>
							<p className="text-warm-gray">
								This is how your patient will look!
							</p>
						</div>

						{/* Patient Name */}
						<div className="mb-6">
							<label className="mb-2 block text-lg font-semibold text-text-dark">
								Patient Name
							</label>
							<Input
								name="name"
								required
								className="w-full rounded-2xl border-2 border-medical-blue py-3 text-lg focus:border-doctor-blue"
								placeholder="Enter a fun name like 'Bella the Bear'"
							/>
						</div>

						{/* Age */}
						<div className="mb-6">
							<label className="mb-2 block text-lg font-semibold text-text-dark">
								Age
							</label>
							<input
								type="number"
								name="age"
								required
								min="3"
								max="99"
								className="w-full rounded-2xl border-2 border-medical-blue px-4 py-3 text-lg focus:border-doctor-blue focus:outline-none"
								placeholder="How old is your patient?"
							/>
						</div>

						{/* Avatar Selection */}
						<div className="mb-6">
							<label className="mb-4 block text-lg font-semibold text-text-dark">
								Choose an Avatar
							</label>
							<div className="grid grid-cols-8 gap-3">
								{AVATAR_OPTIONS.map((avatar) => (
									<button
										key={avatar}
										type="button"
										onClick={() => setSelectedAvatar(avatar)}
										className={`rounded-2xl p-3 text-3xl transition duration-200 hover:scale-110 ${
											selectedAvatar === avatar
												? 'bg-doctor-blue shadow-lg'
												: 'bg-soft-gray hover:bg-medical-blue'
										}`}
									>
										{avatar}
									</button>
								))}
							</div>
							<input type="hidden" name="avatar" value={selectedAvatar} />
						</div>

						{/* Favorite Color */}
						<div className="mb-8">
							<label className="mb-4 block text-lg font-semibold text-text-dark">
								Favorite Color
							</label>
							<div className="grid grid-cols-7 gap-3">
								{colors.map((color) => (
									<button
										key={color.name}
										type="button"
										onClick={() => setSelectedColor(color.name)}
										className={`rounded-2xl p-4 transition duration-200 hover:scale-110 ${
											selectedColor === color.name
												? 'shadow-lg ring-4 ring-text-dark'
												: 'hover:shadow-md'
										} ${color.bg}`}
										title={color.name}
									>
										{selectedColor === color.name && (
											<div className="text-lg text-white">✓</div>
										)}
									</button>
								))}
							</div>
							<input type="hidden" name="favoriteColor" value={selectedColor} />
						</div>

						{/* Submit Buttons */}
						<div className="flex gap-4">
							<Link
								to="/patients"
								className="flex-1 rounded-2xl bg-warm-gray py-4 text-center text-lg font-semibold text-white transition duration-300 hover:bg-gray-500"
							>
								Cancel
							</Link>
							<button
								type="submit"
								className="flex-1 rounded-2xl bg-doctor-green py-4 text-lg font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-doctor-green-dark"
							>
								🎉 Add Patient
							</button>
						</div>
					</form>
				</div>

				{/* Fun Tip */}
				<div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white/20 p-6 text-center backdrop-blur-sm">
					<div className="mb-2 text-4xl">💡</div>
					<p className="font-medium text-white">
						Tip: Give your patients fun names like "Captain Cookie" or "Princess
						Giggles"!
					</p>
				</div>
			</div>
		</div>
	)
}
