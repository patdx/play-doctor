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
	'Common Cold - Runny nose and cough',
	'Fever - High temperature',
	'Ear Infection - Ear pain and discomfort',
	'Sore Throat - Pain when swallowing',
	'Stomach Ache - Tummy pain',
	'Allergies - Sneezing and itching',
	'Asthma - Wheezing and breathing problems',
	'Headache - Head pain',
	'Bruise - Purple mark from bump',
	'Cut - Minor scrape or cut',
	'Rash - Red, itchy skin',
	'Sunburn - Red, painful skin from sun',
	'Pink Eye - Red, itchy eyes',
	'Flu - Body aches and fever',
	'Cough - Persistent coughing',
] as const

export const TREATMENTS = [
	'Band-Aid Application',
	'Medicine (Prescribed)',
	'Rest and Fluids',
	'Warm Compress',
	'Cold Pack',
	'Saline Drops',
	'Antibiotic Ointment',
	'Pain Reliever',
	'Allergy Medicine',
	'Cough Syrup',
	'Eye Drops',
	'Inhaler Treatment',
	'Thermometer Check',
	'Blood Pressure Check',
] as const
