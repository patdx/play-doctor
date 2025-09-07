import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { superjsonStorage } from '~/lib/storage'
import type { Patient } from '~/types/medical'

interface PatientStore {
	patients: Patient[]
	addPatient: (patient: Patient) => void
	updatePatient: (id: string, updates: Partial<Patient>) => void
	deletePatient: (id: string) => void
	toggleStarPatient: (id: string) => void
	getPatient: (id: string) => Patient | undefined
	searchPatients: (query: string) => Patient[]
	getPatientsByAge: (minAge?: number, maxAge?: number) => Patient[]
	getFavoritePatients: () => Patient[]
	clearAllPatients: () => void
}

// Sample data for first-time users
const getSamplePatients = (): Patient[] => [
	{
		id: 'sample-1',
		name: 'Bella the Bear',
		age: 8,
		favoriteColor: 'purple',
		avatar: '🐻',
		medicalHistory: [
			{
				id: 'history-1',
				patientId: 'sample-1',
				condition: 'Gigglitis - Too much laughing!',
				treatment: 'Magic Band-Aid Application',
				notes:
					'Patient was laughing so much they got dizzy! Applied a special healing band-aid.',
				visitDate: new Date('2024-01-10'),
				doctorName: 'Dr. Friendly',
			},
		],
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-10'),
		isStarred: true,
	},
	{
		id: 'sample-2',
		name: 'Charlie Cat',
		age: 6,
		favoriteColor: 'blue',
		avatar: '🐱',
		medicalHistory: [
			{
				id: 'history-2',
				patientId: 'sample-2',
				condition: 'Cookie Belly - Ate too many cookies',
				treatment: 'Gentle Exercise Fun',
				notes:
					'Patient enjoyed too many chocolate chip cookies. Prescribed fun playground activities!',
				visitDate: new Date('2024-01-08'),
				doctorName: 'Dr. Friendly',
			},
		],
		createdAt: new Date('2024-01-05'),
		updatedAt: new Date('2024-01-08'),
		isStarred: false,
	},
	{
		id: 'sample-3',
		name: 'Ruby Rabbit',
		age: 7,
		favoriteColor: 'pink',
		avatar: '🐰',
		medicalHistory: [],
		createdAt: new Date('2024-01-15'),
		updatedAt: new Date('2024-01-15'),
		isStarred: true,
	},
]

export const usePatientsStore = create<PatientStore>()(
	persist(
		(set, get) => ({
			patients: getSamplePatients(),

			addPatient: (patient) =>
				set((state) => ({
					patients: [
						...state.patients,
						{
							...patient,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				})),

			updatePatient: (id, updates) =>
				set((state) => ({
					patients: state.patients.map((patient) =>
						patient.id === id
							? { ...patient, ...updates, updatedAt: new Date() }
							: patient,
					),
				})),

			deletePatient: (id) =>
				set((state) => ({
					patients: state.patients.filter((patient) => patient.id !== id),
				})),

			toggleStarPatient: (id) =>
				set((state) => ({
					patients: state.patients.map((patient) =>
						patient.id === id
							? {
									...patient,
									isStarred: !patient.isStarred,
									updatedAt: new Date(),
								}
							: patient,
					),
				})),

			getPatient: (id) => get().patients.find((patient) => patient.id === id),

			searchPatients: (query) => {
				const lowercaseQuery = query.toLowerCase()
				return get().patients.filter(
					(patient) =>
						patient.name.toLowerCase().includes(lowercaseQuery) ||
						patient.avatar.includes(query) ||
						patient.favoriteColor.toLowerCase().includes(lowercaseQuery),
				)
			},

			getPatientsByAge: (minAge, maxAge) => {
				return get().patients.filter((patient) => {
					if (minAge && patient.age < minAge) return false
					if (maxAge && patient.age > maxAge) return false
					return true
				})
			},

			getFavoritePatients: () =>
				get().patients.filter((patient) => patient.isStarred),

			clearAllPatients: () => set({ patients: [] }),
		}),
		{
			name: 'play-doctor-patients',
			storage: superjsonStorage,
		},
	),
)

// Generate unique ID utility
export const generateId = (): string => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
