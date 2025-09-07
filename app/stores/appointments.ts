import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

			clearAllAppointments: () => set({ appointments: [] }),
		}),
		{
			name: 'play-doctor-appointments',
		},
	),
)
