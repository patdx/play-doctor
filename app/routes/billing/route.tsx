import { useState } from 'react'
import { Link } from 'react-router'
import type { Bill } from '~/types/medical'
import { useBillingStore } from '~/stores/billing'
import { usePatientsStore } from '~/stores/patients'

export function meta() {
	return [
		{ title: 'Billing Center - Play Doctor' },
		{
			name: 'description',
			content: 'Practice with play money and fun billing',
		},
	]
}

export default function Billing() {
	const bills = useBillingStore((state) => state.bills)
	const patients = usePatientsStore((state) => state.patients)
	const processBillPaymentStore = useBillingStore(
		(state) => state.processBillPayment,
	)
	const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
	const [paymentMethod, setPaymentMethod] = useState<
		'cash' | 'card' | 'insurance'
	>('cash')

	const processBillPayment = (
		bill: Bill,
		method: 'cash' | 'card' | 'insurance',
	) => {
		processBillPaymentStore(bill.id, method)
		setSelectedBill({ ...bill, paymentStatus: 'paid', paymentMethod: method })
	}

	const getBillStatusColor = (status: string) => {
		switch (status) {
			case 'paid':
				return 'bg-doctor-green text-white'
			case 'partial':
				return 'bg-happy-orange text-white'
			default:
				return 'bg-gentle-red text-gentle-red-dark'
		}
	}

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'consultation':
				return '🩺'
			case 'treatment':
				return '💊'
			case 'medicine':
				return '💉'
			case 'test':
				return '🔬'
			default:
				return '📋'
		}
	}

	const getPatientName = (patientId: string) => {
		const patient = patients.find((p) => p.id === patientId)
		return patient ? patient.name : 'Unknown Patient'
	}

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
							💰 Billing Center
						</h1>
						<button
							onClick={() => console.log('Create new bill - coming soon!')}
							className="rounded-full bg-happy-orange px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-happy-orange-dark"
						>
							+ Create New Bill
						</button>
					</div>
					<p className="mt-2 text-lg text-warm-gray">
						Practice handling play money and receipts like a real medical
						office!
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Bills List */}
					<div className="lg:col-span-2">
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-6 text-2xl font-bold text-text-dark">
								📄 Patient Bills
							</h2>

							{bills.length === 0 ? (
								<div className="py-12 text-center">
									<div className="mb-4 text-6xl">💳</div>
									<h3 className="mb-2 text-xl font-bold text-text-dark">
										No Bills Yet!
									</h3>
									<p className="mb-6 text-warm-gray">
										Start treating patients to generate your first medical
										bills.
									</p>
									<Link
										to="/appointments/new"
										className="inline-block rounded-full bg-doctor-green px-6 py-3 font-semibold text-white hover:bg-doctor-green-dark"
									>
										Schedule First Appointment
									</Link>
								</div>
							) : (
								<div className="space-y-4">
									{bills.map((bill) => (
										<div
											key={bill.id}
											onClick={() => setSelectedBill(bill)}
											className={`cursor-pointer rounded-xl border-2 p-4 transition duration-200 ${
												selectedBill?.id === bill.id
													? 'border-doctor-blue bg-medical-light shadow-md'
													: 'border-soft-gray hover:border-medical-blue hover:shadow-sm'
											}`}
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="mb-2 flex items-center gap-3">
														<h3 className="font-semibold text-text-dark">
															{getPatientName(bill.patientId)}
														</h3>
														<span
															className={`rounded-full px-3 py-1 text-sm font-medium ${getBillStatusColor(bill.paymentStatus)}`}
														>
															{bill.paymentStatus}
														</span>
													</div>
													<div className="mb-2 text-sm text-warm-gray">
														Bill #{bill.id.slice(-6)} •{' '}
														{bill.createdAt.toLocaleDateString()}
													</div>
													<div className="flex items-center gap-4 text-sm">
														<span>{bill.items.length} services</span>
														<span className="font-bold text-text-dark">
															Total: ${bill.total}
														</span>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Bill Details / Payment */}
					<div className="lg:col-span-1">
						{selectedBill ? (
							<div className="space-y-6">
								{/* Bill Details */}
								<div className="rounded-2xl bg-white p-6 shadow-lg">
									<div className="mb-4 flex items-center justify-between">
										<h2 className="text-xl font-bold text-text-dark">
											Bill Details
										</h2>
										<span
											className={`rounded-full px-3 py-1 text-sm font-medium ${getBillStatusColor(selectedBill.paymentStatus)}`}
										>
											{selectedBill.paymentStatus}
										</span>
									</div>

									<div className="space-y-4">
										<div>
											<h3 className="mb-2 font-semibold text-text-dark">
												Patient: {getPatientName(selectedBill.patientId)}
											</h3>
											<p className="text-sm text-warm-gray">
												Bill #{selectedBill.id.slice(-6)} •{' '}
												{selectedBill.createdAt.toLocaleDateString()}
											</p>
										</div>

										<div>
											<h4 className="mb-2 font-medium text-text-dark">
												Services:
											</h4>
											<div className="space-y-2">
												{selectedBill.items.map((item) => (
													<div
														key={item.id}
														className="flex items-center justify-between text-sm"
													>
														<div className="flex items-center gap-2">
															<span>{getCategoryIcon(item.category)}</span>
															<span>{item.description}</span>
															{item.quantity > 1 && (
																<span className="text-warm-gray">
																	x{item.quantity}
																</span>
															)}
														</div>
														<span className="font-medium">${item.total}</span>
													</div>
												))}
											</div>
										</div>

										<div className="border-t pt-4">
											<div className="mb-1 flex justify-between text-sm">
												<span>Subtotal:</span>
												<span>${selectedBill.subtotal}</span>
											</div>
											{selectedBill.discount > 0 && (
												<div className="mb-1 flex justify-between text-sm text-doctor-green-dark">
													<span>Discount:</span>
													<span>-${selectedBill.discount}</span>
												</div>
											)}
											<div className="flex justify-between border-t pt-2 text-lg font-bold">
												<span>Total:</span>
												<span>${selectedBill.total}</span>
											</div>
										</div>
									</div>
								</div>

								{/* Payment Processing */}
								{selectedBill.paymentStatus === 'pending' && (
									<div className="rounded-2xl bg-white p-6 shadow-lg">
										<h3 className="mb-4 text-lg font-bold text-text-dark">
											💳 Process Payment
										</h3>

										<div className="space-y-4">
											<div>
												<label className="mb-2 block text-sm font-medium text-text-dark">
													Payment Method:
												</label>
												<div className="grid grid-cols-3 gap-2">
													{(['cash', 'card', 'insurance'] as const).map(
														(method) => (
															<button
																key={method}
																onClick={() => setPaymentMethod(method)}
																className={`rounded-lg p-3 text-sm font-medium transition ${
																	paymentMethod === method
																		? 'bg-doctor-blue text-white'
																		: 'bg-soft-gray hover:bg-medical-blue'
																}`}
															>
																{method === 'cash' && '💵'}
																{method === 'card' && '💳'}
																{method === 'insurance' && '🏥'}
																<div className="mt-1 capitalize">{method}</div>
															</button>
														),
													)}
												</div>
											</div>

											<button
												onClick={() =>
													processBillPayment(selectedBill, paymentMethod)
												}
												className="w-full rounded-xl bg-doctor-green py-3 font-semibold text-white transition-colors hover:bg-doctor-green-dark"
											>
												💰 Collect ${selectedBill.total}
											</button>
										</div>
									</div>
								)}

								{/* Payment Success */}
								{selectedBill.paymentStatus === 'paid' && (
									<div className="bg-opacity-20 rounded-2xl bg-doctor-green p-6 text-center">
										<div className="mb-2 text-4xl">✅</div>
										<h3 className="mb-2 font-bold text-doctor-green-dark">
											Payment Received!
										</h3>
										<p className="text-sm text-text-dark">
											${selectedBill.total} paid via{' '}
											{selectedBill.paymentMethod}
										</p>
										<div className="mt-4">
											<button className="rounded-lg bg-doctor-green px-4 py-2 text-sm text-white hover:bg-doctor-green-dark">
												🖨️ Print Receipt
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="rounded-2xl bg-white p-6 shadow-lg">
								<div className="py-8 text-center">
									<div className="mb-4 text-6xl">💰</div>
									<h3 className="mb-2 text-lg font-bold text-text-dark">
										Select a Bill
									</h3>
									<p className="text-warm-gray">
										Choose a patient bill from the list to view details and
										process payment.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
