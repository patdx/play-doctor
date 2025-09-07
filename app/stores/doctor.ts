import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { superjsonStorage } from '~/lib/storage'
import type { DoctorProgress, Badge } from '~/types/medical'

interface DoctorStore {
	progress: DoctorProgress
	addExperience: (amount: number) => void
	unlockBadge: (badge: Badge) => void
	incrementPatientsHelped: () => void
	incrementAppointments: () => void
	addSpecialization: (specialization: string) => void
	resetProgress: () => void
}

const getInitialProgress = (): DoctorProgress => ({
	level: 1,
	experience: 0,
	badges: [],
	patientsHelped: 0,
	totalAppointments: 0,
	specializations: [],
})

const EXPERIENCE_PER_LEVEL = 100

export const useDoctorStore = create<DoctorStore>()(
	persist(
		(set, get) => ({
			progress: getInitialProgress(),

			addExperience: (amount) =>
				set((state) => {
					const newExp = state.progress.experience + amount
					const newLevel = Math.floor(newExp / EXPERIENCE_PER_LEVEL) + 1
					return {
						progress: {
							...state.progress,
							experience: newExp,
							level: Math.max(newLevel, state.progress.level),
						},
					}
				}),

			unlockBadge: (badge) =>
				set((state) => {
					const existingBadge = state.progress.badges.find(
						(b) => b.id === badge.id,
					)
					if (existingBadge) return state

					return {
						progress: {
							...state.progress,
							badges: [
								...state.progress.badges,
								{ ...badge, unlockedAt: new Date() },
							],
						},
					}
				}),

			incrementPatientsHelped: () =>
				set((state) => ({
					progress: {
						...state.progress,
						patientsHelped: state.progress.patientsHelped + 1,
					},
				})),

			incrementAppointments: () =>
				set((state) => ({
					progress: {
						...state.progress,
						totalAppointments: state.progress.totalAppointments + 1,
					},
				})),

			addSpecialization: (specialization) =>
				set((state) => {
					if (state.progress.specializations.includes(specialization))
						return state

					return {
						progress: {
							...state.progress,
							specializations: [
								...state.progress.specializations,
								specialization,
							],
						},
					}
				}),

			resetProgress: () => set({ progress: getInitialProgress() }),
		}),
		{
			name: 'play-doctor-progress',
			storage: superjsonStorage,
		},
	),
)

// Badge definitions for achievements
export const AVAILABLE_BADGES = {
	FIRST_PATIENT: {
		id: 'first-patient',
		name: 'First Patient',
		description: 'Treated your very first patient!',
		icon: '🏥',
		rarity: 'common' as const,
	},
	SPEED_DOCTOR: {
		id: 'speed-doctor',
		name: 'Speed Doctor',
		description: 'Completed 10 appointments in one day',
		icon: '⚡',
		rarity: 'rare' as const,
	},
	HEART_HEALER: {
		id: 'heart-healer',
		name: 'Heart Healer',
		description: 'Used the stethoscope 50 times',
		icon: '💗',
		rarity: 'epic' as const,
	},
	MASTER_DOCTOR: {
		id: 'master-doctor',
		name: 'Master Doctor',
		description: 'Reached level 10',
		icon: '🎓',
		rarity: 'legendary' as const,
	},
}
