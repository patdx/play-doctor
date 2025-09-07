import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QueueEntry } from '~/types/medical'

interface QueueStore {
	queue: QueueEntry[]
	addToQueue: (
		entry: Omit<QueueEntry, 'id' | 'ticketNumber' | 'checkedInAt'>,
	) => void
	removeFromQueue: (id: string) => void
	updateQueueEntry: (id: string, updates: Partial<QueueEntry>) => void
	getQueueEntries: () => QueueEntry[]
	getNextInQueue: () => QueueEntry | null
	getQueueByPriority: (priority: QueueEntry['priority']) => QueueEntry[]
	getEstimatedWaitTime: (ticketNumber: number) => number
	clearQueue: () => void
}

export const useQueueStore = create<QueueStore>()(
	persist(
		(set, get) => ({
			queue: [],

			addToQueue: (entry) =>
				set((state) => {
					const nextTicketNumber =
						Math.max(...state.queue.map((q) => q.ticketNumber), 0) + 1
					const newEntry: QueueEntry = {
						...entry,
						id: Date.now().toString() + Math.random().toString(36).substring(2),
						ticketNumber: nextTicketNumber,
						checkedInAt: new Date(),
					}
					return {
						queue: [...state.queue, newEntry].sort((a, b) => {
							// Emergency priority first, then by ticket number
							if (a.priority === 'emergency' && b.priority !== 'emergency')
								return -1
							if (a.priority !== 'emergency' && b.priority === 'emergency')
								return 1
							if (a.priority === 'urgent' && b.priority === 'regular') return -1
							if (a.priority === 'regular' && b.priority === 'urgent') return 1
							return a.ticketNumber - b.ticketNumber
						}),
					}
				}),

			removeFromQueue: (id) =>
				set((state) => ({
					queue: state.queue.filter((entry) => entry.id !== id),
				})),

			updateQueueEntry: (id, updates) =>
				set((state) => ({
					queue: state.queue.map((entry) =>
						entry.id === id ? { ...entry, ...updates } : entry,
					),
				})),

			getQueueEntries: () => get().queue,

			getNextInQueue: () => {
				const queue = get().queue
				return queue.length > 0 ? queue[0] : null
			},

			getQueueByPriority: (priority) =>
				get().queue.filter((entry) => entry.priority === priority),

			getEstimatedWaitTime: (ticketNumber) => {
				const queue = get().queue
				const entryIndex = queue.findIndex(
					(entry) => entry.ticketNumber === ticketNumber,
				)
				if (entryIndex === -1) return 0

				// Calculate wait time based on average treatment time (15 minutes per patient)
				const averageTreatmentTime = 15
				return entryIndex * averageTreatmentTime
			},

			clearQueue: () => set({ queue: [] }),
		}),
		{
			name: 'play-doctor-queue',
			onRehydrateStorage: () => (state) => {
				if (state?.queue) {
					// Convert date strings back to Date objects after rehydration
					state.queue = state.queue.map((entry) => ({
						...entry,
						checkedInAt: new Date(entry.checkedInAt),
					}))
				}
			},
		},
	),
)
