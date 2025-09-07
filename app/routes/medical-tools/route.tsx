import { useState } from 'react'
import { Link } from 'react-router'
import type { MedicalTool } from '~/types/medical'
import { KID_FRIENDLY_CONDITIONS, TREATMENTS } from '~/types/medical'

export function meta() {
	return [
		{ title: 'Medical Tools - Play Doctor' },
		{
			name: 'description',
			content: 'Use medical tools to examine and treat patients',
		},
	]
}

export default function MedicalTools() {
	const [selectedTool, setSelectedTool] = useState<string | null>(null)
	const [diagnosis, setDiagnosis] = useState<string | null>(null)
	const [treatment, setTreatment] = useState<string | null>(null)

	const medicalTools: MedicalTool[] = [
		{
			id: 'stethoscope',
			name: 'Stethoscope',
			description: 'Listen to heartbeats and breathing sounds',
			icon: '🩺',
			soundEffect: 'lub-dub, lub-dub',
			isUnlocked: true,
		},
		{
			id: 'thermometer',
			name: 'Thermometer',
			description: 'Check if patients have a fever',
			icon: '🌡️',
			soundEffect: 'beep beep!',
			isUnlocked: true,
		},
		{
			id: 'blood-pressure',
			name: 'Blood Pressure Cuff',
			description: 'Measure blood pressure',
			icon: '🩸',
			soundEffect: 'whoosh... puff!',
			isUnlocked: true,
		},
		{
			id: 'scale',
			name: 'Weight Scale',
			description: 'See how much patients weigh',
			icon: '⚖️',
			soundEffect: 'ding!',
			isUnlocked: true,
		},
		{
			id: 'reflex-hammer',
			name: 'Reflex Hammer',
			description: 'Test reflexes with gentle taps',
			icon: '🔨',
			soundEffect: 'tap tap',
			isUnlocked: true,
		},
		{
			id: 'flashlight',
			name: 'Bright Flashlight',
			description: 'Look in ears, nose, and throat',
			icon: '🔦',
			soundEffect: 'click... ahhh!',
			isUnlocked: true,
		},
		{
			id: 'bandages',
			name: 'Bandages',
			description: 'Apply bandages to cuts and scrapes',
			icon: '🩹',
			soundEffect: 'rip... stick!',
			isUnlocked: true,
		},
		{
			id: 'medicine',
			name: 'Medicine',
			description: 'Give patients medicine',
			icon: '💊',
			soundEffect: 'gulp',
			isUnlocked: true,
		},
	]

	const handleToolClick = (tool: MedicalTool) => {
		setSelectedTool(tool.id)

		// Simulate using the tool with random diagnosis
		setTimeout(() => {
			const randomCondition =
				KID_FRIENDLY_CONDITIONS[
					Math.floor(Math.random() * KID_FRIENDLY_CONDITIONS.length)
				]
			const randomTreatment =
				TREATMENTS[Math.floor(Math.random() * TREATMENTS.length)]
			setDiagnosis(randomCondition)
			setTreatment(randomTreatment)
		}, 1500)
	}

	const resetExamination = () => {
		setSelectedTool(null)
		setDiagnosis(null)
		setTreatment(null)
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
					<h1 className="text-4xl font-bold text-text-dark">
						🩺 Medical Tool Kit
					</h1>
					<p className="mt-2 text-lg text-warm-gray">
						Choose your medical tools to examine and help patients feel
						better!
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Medical Tools Grid */}
					<div className="lg:col-span-2">
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-6 text-2xl font-bold text-text-dark">
								🧰 Choose Your Tool
							</h2>
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
								{medicalTools.map((tool) => (
									<button
										key={tool.id}
										onClick={() => handleToolClick(tool)}
										disabled={!tool.isUnlocked || selectedTool !== null}
										className={`group rounded-2xl p-6 text-center transition-all duration-300 ${
											selectedTool === tool.id
												? 'scale-105 bg-doctor-blue text-white shadow-xl'
												: tool.isUnlocked
													? 'bg-soft-gray hover:scale-105 hover:bg-medical-blue hover:shadow-lg'
													: 'cursor-not-allowed bg-gray-200 opacity-50'
										}`}
									>
										<div className="mb-2 text-4xl group-hover:animate-bounce">
											{tool.icon}
										</div>
										<h3 className="mb-1 text-sm font-semibold">{tool.name}</h3>
										<p className="text-xs opacity-75">{tool.description}</p>
										{selectedTool === tool.id && (
											<div className="mt-2 animate-pulse text-xs font-medium">
												{tool.soundEffect}
											</div>
										)}
									</button>
								))}
							</div>

							{selectedTool && !diagnosis && (
								<div className="mt-8 text-center">
									<div className="inline-flex items-center gap-2 rounded-full bg-doctor-blue px-6 py-3 text-white">
										<div className="animate-spin">⚕️</div>
										<span>Using tool... please wait!</span>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Examination Results */}
					<div className="lg:col-span-1">
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-6 text-2xl font-bold text-text-dark">
								📋 Examination Results
							</h2>

							{!selectedTool && (
								<div className="py-8 text-center">
									<div className="mb-4 text-6xl">🔍</div>
									<p className="text-warm-gray">
										Select a medical tool to start examining a patient!
									</p>
								</div>
							)}

							{selectedTool && !diagnosis && (
								<div className="py-8 text-center">
									<div className="mb-4 animate-pulse text-6xl">👨‍⚕️</div>
									<p className="text-warm-gray">
										Examining patient carefully...
									</p>
								</div>
							)}

							{diagnosis && treatment && (
								<div className="space-y-6">
									{/* Diagnosis */}
									<div className="rounded-xl bg-medical-light p-4">
										<h3 className="mb-2 font-semibold text-text-dark">
											🎯 Diagnosis:
										</h3>
										<p className="text-warm-gray">{diagnosis}</p>
									</div>

									{/* Treatment */}
									<div className="bg-opacity-20 rounded-xl bg-doctor-green p-4">
										<h3 className="mb-2 font-semibold text-text-dark">
											💊 Recommended Treatment:
										</h3>
										<p className="text-warm-gray">{treatment}</p>
									</div>

									{/* Prescription */}
									<div className="bg-opacity-20 rounded-xl bg-happy-orange p-4">
										<h3 className="mb-2 font-semibold text-text-dark">
											📄 Prescription:
										</h3>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Rest:</span>
												<span className="font-medium">Plenty of sleep</span>
											</div>
											<div className="flex justify-between">
												<span>Medicine:</span>
												<span className="font-medium">As prescribed</span>
											</div>
											<div className="flex justify-between">
												<span>Follow-up:</span>
												<span className="font-medium">In 3 days</span>
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="space-y-3">
										<button
											onClick={resetExamination}
											className="w-full rounded-xl bg-doctor-green py-3 font-semibold text-white transition-colors hover:bg-doctor-green-dark"
										>
											✓ Patient Treated
										</button>
										<button
											onClick={resetExamination}
											className="w-full rounded-xl bg-warm-gray py-2 text-white transition-colors hover:bg-gray-500"
										>
											Examine Another Patient
										</button>
									</div>
								</div>
							)}
						</div>

						</div>
				</div>

				</div>
		</div>
	)
}
