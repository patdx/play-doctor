export interface Patient {
	id: string
	name: string
	age: number
	favoriteColor: string
	avatar: string
	medicalHistory: MedicalRecord[]
	createdAt: Date
	updatedAt: Date
	isStarred?: boolean
}

export interface MedicalRecord {
	id: string
	patientId: string
	condition: string
	treatment: string
	notes: string
	visitDate: Date
	doctorName: string
}

export interface Appointment {
	id: string
	patientId: string
	patientName: string
	date: Date
	time: string
	type: AppointmentType
	status: AppointmentStatus
	notes?: string
	duration: number
}

export type AppointmentType = 'checkup' | 'emergency' | 'vaccine' | 'followup'
export type AppointmentStatus =
	| 'scheduled'
	| 'checked-in'
	| 'in-progress'
	| 'completed'
	| 'cancelled'

export interface QueueEntry {
	id: string
	patientId: string
	patientName: string
	priority: 'emergency' | 'urgent' | 'regular'
	estimatedWaitTime: number
	ticketNumber: number
	checkedInAt: Date
}

export interface Bill {
	id: string
	patientId: string
	appointmentId: string
	items: BillItem[]
	subtotal: number
	discount: number
	total: number
	paymentStatus: 'pending' | 'paid' | 'partial'
	paymentMethod?: 'cash' | 'card' | 'insurance'
	createdAt: Date
}

export interface BillItem {
	id: string
	description: string
	quantity: number
	unitPrice: number
	total: number
	category: 'consultation' | 'treatment' | 'medicine' | 'test'
}

export interface MedicalTool {
	id: string
	name: string
	description: string
	icon: string
	soundEffect?: string
	isUnlocked: boolean
}

export interface DoctorProgress {
	level: number
	experience: number
	badges: Badge[]
	patientsHelped: number
	totalAppointments: number
	specializations: string[]
}

export interface Badge {
	id: string
	name: string
	description: string
	icon: string
	unlockedAt: Date
	rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const AVATAR_OPTIONS = [
	'🐱',
	'🐶',
	'🐰',
	'🦊',
	'🐻',
	'🐼',
	'🐨',
	'🐯',
	'🦁',
	'🐸',
	'🐧',
	'🐴',
	'🦄',
	'🐷',
	'🐵',
	'🐮',
] as const

export const KID_FRIENDLY_CONDITIONS = [
	'Gigglitis - Too much laughing!',
	'Cookie Belly - Ate too many cookies',
	'Playground Scrape - Adventure battle wound',
	'Sleepy Head Syndrome - Not enough bedtime',
	'Happy Hiccups - Joy overload',
	'Tickle Fever - Contagious giggles',
	'Ice Cream Brain Freeze - Too much frozen goodness',
	'Superhero Exhaustion - Saving the world is tiring',
	'Homework Allergies - Needs more playtime',
	'Growing Pains - Getting bigger and stronger',
] as const

export const TREATMENTS = [
	'Magic Band-Aid Application',
	'Cheerful Medicine (Gummy Vitamins)',
	'Healing Hug Prescription',
	'Extra Bedtime Story Treatment',
	'Playground Rest Therapy',
	'Smile Medicine (3 times daily)',
	'Favorite Snack Cure',
	'Cartoon Watching Recovery',
	'Gentle Exercise Fun',
	'Family Time Healing',
] as const
