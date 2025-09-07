import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { superjsonStorage } from '~/lib/storage'
import type { Appointment } from '~/types/medical'

interface AppointmentStore {
	appointments: Appointment[]
	addAppointment: (appointment: Appointment) => void
	updateAppointment: (id: string, updates: Partial<Appointment>) => void
	deleteAppointment: (id: string) => void
	getAppointment: (id: string) => Appointment | undefined
	getAppointmentsByDate: (date: Date) => Appointment[]
	getAppointmentsByPatient: (patientId: string) => Appointment[]
	getAppointmentsByStatus: (status: Appointment['status']) => Appointment[]
	checkInPatient: (id: string) => void
	startTreatment: (id: string) => void
	completeAppointment: (id: string) => void
	cancelAppointment: (id: string) => void
	addWalkInAppointment: (patientId: string, patientName: string, appointmentType: Appointment['type']) => void
	getTodayAppointments: () => Appointment[]
	getReadyForTreatment: () => Appointment[]
	clearAllAppointments: () => void
}

export const useAppointmentsStore = create<AppointmentStore>()(
	persist(
		(set, get) => ({
			appointments: [],

			addAppointment: (appointment) =>
				set((state) => ({
					appointments: [...state.appointments, appointment],
				})),

			updateAppointment: (id, updates) =>
				set((state) => ({
					appointments: state.appointments.map((appointment) =>
						appointment.id === id
							? { ...appointment, ...updates }
							: appointment,
					),
				})),

			deleteAppointment: (id) =>
				set((state) => ({
					appointments: state.appointments.filter(
						(appointment) => appointment.id !== id,
					),
				})),

			getAppointment: (id) =>
				get().appointments.find((appointment) => appointment.id === id),

			getAppointmentsByDate: (date) => {
				const targetDate = date.toDateString()
				return get().appointments.filter(
					(appointment) => appointment.date.toDateString() === targetDate,
				)
			},

			getAppointmentsByPatient: (patientId) =>
				get().appointments.filter(
					(appointment) => appointment.patientId === patientId,
				),

			getAppointmentsByStatus: (status) =>
				get().appointments.filter(
					(appointment) => appointment.status === status,
				),

			checkInPatient: (id) =>
				set((state) => ({
					appointments: state.appointments.map((appointment) =>
						appointment.id === id
							? { ...appointment, status: 'checked-in' as const }
							: appointment,
					),
				})),

			startTreatment: (id) =>
				set((state) => ({
					appointments: state.appointments.map((appointment) =>
						appointment.id === id
							? { ...appointment, status: 'in-progress' as const }
							: appointment,
					),
				})),

			completeAppointment: (id) =>
				set((state) => ({
					appointments: state.appointments.map((appointment) =>
						appointment.id === id
							? { ...appointment, status: 'completed' as const }
							: appointment,
					),
				})),

			cancelAppointment: (id) =>
				set((state) => ({
					appointments: state.appointments.map((appointment) =>
						appointment.id === id
							? { ...appointment, status: 'cancelled' as const }
							: appointment,
					),
				})),

			getTodayAppointments: () => {
				const today = new Date()
				return get().appointments.filter(
					(appointment) =>
						appointment.date.toDateString() === today.toDateString(),
				)
			},

			getReadyForTreatment: () => {
				const today = new Date()
				return get().appointments.filter(
					(appointment) =>
						appointment.date.toDateString() === today.toDateString() &&
						(appointment.status === 'checked-in' ||
							appointment.status === 'in-progress'),
				)
			},

			addWalkInAppointment: (patientId, patientName, appointmentType) => {
				const now = new Date()
				const timeString = now.toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
					hour12: true,
				})
				
				const walkInAppointment: Appointment = {
					id: `walkin-${Date.now()}`,
					patientId,
					patientName,
					date: now,
					time: timeString,
					type: appointmentType,
					status: 'checked-in',
					duration: 30,
					notes: 'Walk-in appointment',
				}
				
				set((state) => ({
					appointments: [...state.appointments, walkInAppointment],
				}))
			},

			clearAllAppointments: () => set({ appointments: [] }),
		}),
		{
			name: 'play-doctor-appointments',
			storage: superjsonStorage,
		},
	),
)
