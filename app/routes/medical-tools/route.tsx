import { useState } from 'react'
import { Link } from 'react-router'
import type { MedicalTool } from '~/types/medical'
import { KID_FRIENDLY_CONDITIONS, TREATMENTS } from '~/types/medical'

export function meta() {
	return [
		{ title: 'Medical Tools - Play Doctor' },
		{
			name: 'description',
			content: 'Use fun medical tools to examine and treat patients',
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
			name: 'Magic Stethoscope',
			description: 'Listen to heartbeats and breathing sounds',
			icon: '🩺',
			soundEffect: 'lub-dub, lub-dub',
			isUnlocked: true,
		},
		{
			id: 'thermometer',
			name: 'Temperature Wand',
			description: 'Check if patients have a fever',
			icon: '🌡️',
			soundEffect: 'beep beep!',
			isUnlocked: true,
		},
		{
			id: 'blood-pressure',
			name: 'Squeeze Checker',
			description: 'Measure blood pressure with fun sounds',
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
			name: 'Tickle Hammer',
			description: 'Test reflexes with gentle taps',
			icon: '🔨',
			soundEffect: 'tap tap giggle!',
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
			name: 'Healing Bandages',
			description: 'Apply colorful bandages to cuts and scrapes',
			icon: '🩹',
			soundEffect: 'rip... stick!',
			isUnlocked: true,
		},
		{
			id: 'medicine',
			name: 'Yummy Medicine',
			description: 'Give patients tasty medicine',
			icon: '💊',
			soundEffect: 'gulp... mmm!',
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
		<div className="min-h-screen bg-gradient-to-br from-[--color-medical-light] to-[--color-doctor-blue]">
			<div className="container mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						to="/"
						className="mb-4 inline-flex items-center text-[--color-text-dark] hover:text-[--color-doctor-blue]"
					>
						← Back to Clinic
					</Link>
					<h1 className="text-4xl font-bold text-[--color-text-dark]">
						🩺 Medical Tool Kit
					</h1>
					<p className="mt-2 text-lg text-[--color-warm-gray]">
						Choose your magical medical tools to examine and help patients feel
						better!
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Medical Tools Grid */}
					<div className="lg:col-span-2">
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-6 text-2xl font-bold text-[--color-text-dark]">
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
												? 'scale-105 bg-[--color-doctor-blue] text-white shadow-xl'
												: tool.isUnlocked
													? 'bg-[--color-soft-gray] hover:scale-105 hover:bg-[--color-medical-blue] hover:shadow-lg'
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
									<div className="inline-flex items-center gap-2 rounded-full bg-[--color-doctor-blue] px-6 py-3 text-white">
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
							<h2 className="mb-6 text-2xl font-bold text-[--color-text-dark]">
								📋 Examination Results
							</h2>

							{!selectedTool && (
								<div className="py-8 text-center">
									<div className="mb-4 text-6xl">🔍</div>
									<p className="text-[--color-warm-gray]">
										Select a medical tool to start examining a patient!
									</p>
								</div>
							)}

							{selectedTool && !diagnosis && (
								<div className="py-8 text-center">
									<div className="mb-4 animate-pulse text-6xl">👨‍⚕️</div>
									<p className="text-[--color-warm-gray]">
										Examining patient carefully...
									</p>
								</div>
							)}

							{diagnosis && treatment && (
								<div className="space-y-6">
									{/* Diagnosis */}
									<div className="rounded-xl bg-[--color-medical-light] p-4">
										<h3 className="mb-2 font-semibold text-[--color-text-dark]">
											🎯 Diagnosis:
										</h3>
										<p className="text-[--color-warm-gray]">{diagnosis}</p>
									</div>

									{/* Treatment */}
									<div className="bg-opacity-20 rounded-xl bg-[--color-doctor-green] p-4">
										<h3 className="mb-2 font-semibold text-[--color-text-dark]">
											💊 Recommended Treatment:
										</h3>
										<p className="text-[--color-warm-gray]">{treatment}</p>
									</div>

									{/* Prescription */}
									<div className="bg-opacity-20 rounded-xl bg-[--color-happy-orange] p-4">
										<h3 className="mb-2 font-semibold text-[--color-text-dark]">
											📄 Prescription:
										</h3>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Rest:</span>
												<span className="font-medium">Lots of fun!</span>
											</div>
											<div className="flex justify-between">
												<span>Medicine:</span>
												<span className="font-medium">Smiles daily</span>
											</div>
											<div className="flex justify-between">
												<span>Follow-up:</span>
												<span className="font-medium">When needed</span>
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="space-y-3">
										<button
											onClick={resetExamination}
											className="w-full rounded-xl bg-[--color-doctor-green] py-3 font-semibold text-white transition-colors hover:bg-[--color-doctor-green-dark]"
										>
											🎉 Patient Treated Successfully!
										</button>
										<button
											onClick={resetExamination}
											className="w-full rounded-xl bg-[--color-warm-gray] py-2 text-white transition-colors hover:bg-gray-500"
										>
											Examine Another Patient
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Patient Feedback */}
						{diagnosis && treatment && (
							<div className="mt-6 rounded-2xl bg-white/20 p-6 text-center backdrop-blur-sm">
								<div className="mb-2 text-4xl">😊</div>
								<p className="font-medium text-white">
									"Thank you, Dr. {Math.random() > 0.5 ? 'Awesome' : 'Amazing'}!
									I feel so much better now!"
								</p>
								<p className="mt-2 text-sm text-white/80">- Happy Patient</p>
							</div>
						)}
					</div>
				</div>

				{/* Medical Fun Facts */}
				<div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
					<h3 className="mb-4 text-xl font-bold text-[--color-text-dark]">
						🧠 Fun Medical Facts for Young Doctors!
					</h3>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<div className="rounded-lg bg-[--color-medical-light] p-4">
							<div className="mb-2 text-2xl">💗</div>
							<p className="text-sm text-[--color-text-dark]">
								A healthy heart beats about 100,000 times per day!
							</p>
						</div>
						<div className="rounded-lg bg-[--color-medical-light] p-4">
							<div className="mb-2 text-2xl">🦴</div>
							<p className="text-sm text-[--color-text-dark]">
								Babies are born with about 300 bones, but adults only have 206!
							</p>
						</div>
						<div className="rounded-lg bg-[--color-medical-light] p-4">
							<div className="mb-2 text-2xl">😴</div>
							<p className="text-sm text-[--color-text-dark]">
								Getting enough sleep helps your body heal and grow stronger!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
