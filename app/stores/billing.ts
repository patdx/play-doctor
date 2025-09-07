import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { superjsonStorage } from '~/lib/storage'
import type { Bill } from '~/types/medical'

interface BillingStore {
	bills: Bill[]
	addBill: (bill: Bill) => void
	updateBill: (id: string, updates: Partial<Bill>) => void
	deleteBill: (id: string) => void
	getBill: (id: string) => Bill | undefined
	getBillsByPatient: (patientId: string) => Bill[]
	getBillsByStatus: (status: Bill['paymentStatus']) => Bill[]
	processBillPayment: (
		id: string,
		paymentMethod: 'cash' | 'card' | 'insurance',
	) => void
	getTotalRevenue: () => number
	clearAllBills: () => void
}

// Sample bills for demonstration
const getSampleBills = (): Bill[] => [
	{
		id: 'bill-1',
		patientId: 'sample-1',
		appointmentId: 'apt-1',
		items: [
			{
				id: 'item-1',
				description: 'Wellness Checkup',
				quantity: 1,
				unitPrice: 50,
				total: 50,
				category: 'consultation',
			},
			{
				id: 'item-2',
				description: 'Bandage',
				quantity: 2,
				unitPrice: 5,
				total: 10,
				category: 'treatment',
			},
		],
		subtotal: 60,
		discount: 5,
		total: 55,
		paymentStatus: 'pending',
		createdAt: new Date('2024-01-15'),
	},
]

export const useBillingStore = create<BillingStore>()(
	persist(
		(set, get) => ({
			bills: getSampleBills(),

			addBill: (bill) =>
				set((state) => ({
					bills: [...state.bills, { ...bill, createdAt: new Date() }],
				})),

			updateBill: (id, updates) =>
				set((state) => ({
					bills: state.bills.map((bill) =>
						bill.id === id ? { ...bill, ...updates } : bill,
					),
				})),

			deleteBill: (id) =>
				set((state) => ({
					bills: state.bills.filter((bill) => bill.id !== id),
				})),

			getBill: (id) => get().bills.find((bill) => bill.id === id),

			getBillsByPatient: (patientId) =>
				get().bills.filter((bill) => bill.patientId === patientId),

			getBillsByStatus: (status) =>
				get().bills.filter((bill) => bill.paymentStatus === status),

			processBillPayment: (id, paymentMethod) =>
				set((state) => ({
					bills: state.bills.map((bill) =>
						bill.id === id
							? { ...bill, paymentStatus: 'paid' as const, paymentMethod }
							: bill,
					),
				})),

			getTotalRevenue: () =>
				get()
					.bills.filter((bill) => bill.paymentStatus === 'paid')
					.reduce((total, bill) => total + bill.total, 0),

			clearAllBills: () => set({ bills: [] }),
		}),
		{
			name: 'play-doctor-billing',
			storage: superjsonStorage,
		},
	),
)
