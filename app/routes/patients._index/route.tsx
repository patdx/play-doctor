import { Link } from 'react-router'
import { useState, useMemo } from 'react'
import type { Patient } from '~/types/medical'
import { usePatientsStore } from '~/stores/patients'

export function meta() {
	return [
		{ title: 'My Patients - Play Doctor' },
		{ name: 'description', content: 'View and manage all your patients' },
	]
}

export default function Patients() {
	const patients = usePatientsStore((state) => state.patients)
	const getFavoritePatients = usePatientsStore(
		(state) => state.getFavoritePatients,
	)
	const toggleStarPatient = usePatientsStore((state) => state.toggleStarPatient)

	const [searchQuery, setSearchQuery] = useState('')
	const [showFavorites, setShowFavorites] = useState(false)
	const [ageFilter, setAgeFilter] = useState('')

	// Filter patients based on search and filters
	const filteredPatients = useMemo(() => {
		let result = patients

		if (showFavorites) {
			result = getFavoritePatients()
		}

		if (searchQuery) {
			result = result.filter(
				(patient) =>
					patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					patient.avatar.includes(searchQuery) ||
					patient.favoriteColor
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			)
		}

		if (ageFilter) {
			const [min, max] = ageFilter.split('-').map(Number)
			result = result.filter((patient) => {
				if (ageFilter === '11+') return patient.age >= 11
				return patient.age >= min && patient.age <= max
			})
		}

		return result
	}, [patients, searchQuery, showFavorites, ageFilter, getFavoritePatients])

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
							👥 My Patients
						</h1>
						<Link
							to="/patients/new"
							className="rounded-full bg-happy-orange px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-happy-orange-dark"
						>
							+ Add New Patient
						</Link>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex-1">
							<input
								type="text"
								placeholder="Search patients by name..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full rounded-full border-2 border-medical-blue px-4 py-2 text-lg focus:border-doctor-blue focus:outline-none"
							/>
						</div>
						<div className="flex gap-4">
							<select
								value={ageFilter}
								onChange={(e) => setAgeFilter(e.target.value)}
								className="rounded-full border-2 border-medical-blue px-4 py-2 focus:border-doctor-blue focus:outline-none"
							>
								<option value="">All Ages</option>
								<option value="5-7">Ages 5-7</option>
								<option value="8-10">Ages 8-10</option>
								<option value="11+">Ages 11+</option>
							</select>
							<button
								onClick={() => setShowFavorites(!showFavorites)}
								className={`rounded-full px-4 py-2 text-white transition-colors ${
									showFavorites
										? 'bg-fun-purple-dark'
										: 'bg-fun-purple hover:bg-fun-purple-dark'
								}`}
							>
								⭐ {showFavorites ? 'All' : 'Favorites'}
							</button>
						</div>
					</div>
				</div>

				{/* Patients Grid */}
				{filteredPatients.length === 0 ? (
					<div className="rounded-2xl bg-white p-12 text-center shadow-lg">
						<div className="mb-4 text-6xl">🏥</div>
						<h2 className="mb-4 text-2xl font-bold text-text-dark">
							No Patients Yet!
						</h2>
						<p className="mb-6 text-warm-gray">
							Start your medical practice by adding your first patient.
						</p>
						<Link
							to="/patients/new"
							className="inline-block rounded-full bg-doctor-green px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-doctor-green-dark"
						>
							Add Your First Patient
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{filteredPatients.map((patient) => (
							<PatientCard
								key={patient.id}
								patient={patient}
								toggleStar={toggleStarPatient}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

function PatientCard({
	patient,
	toggleStar,
}: {
	patient: Patient
	toggleStar: (id: string) => void
}) {
	return (
		<Link
			to={`/patients/${patient.id}`}
			className="group transform rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
		>
			{/* Patient Avatar and Star */}
			<div className="mb-4 flex items-start justify-between">
				<div
					className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
					style={{ backgroundColor: `${patient.favoriteColor}20` }}
				>
					{patient.avatar}
				</div>
				<button
					onClick={(e) => {
						e.preventDefault()
						toggleStar(patient.id)
					}}
					className="text-2xl transition-transform hover:scale-110"
				>
					{patient.isStarred ? '⭐' : '☆'}
				</button>
			</div>

			{/* Patient Info */}
			<div className="mb-4">
				<h3 className="text-xl font-bold text-text-dark group-hover:text-doctor-blue">
					{patient.name}
				</h3>
				<p className="text-warm-gray">
					Age {patient.age} • Loves {patient.favoriteColor}
				</p>
			</div>

			{/* Patient Stats */}
			<div className="flex justify-between text-sm text-warm-gray">
				<span>{patient.medicalHistory.length} visits</span>
				<span>Joined {patient.createdAt.toLocaleDateString()}</span>
			</div>

			{/* Health Status Indicator */}
			<div className="mt-4 flex items-center justify-center rounded-full bg-doctor-green py-2 font-medium text-white">
				😊 Feeling Great!
			</div>
		</Link>
	)
}
