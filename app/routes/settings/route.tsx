import { Link } from 'react-router'
import { Input } from '~/components/ui/input'

export function meta() {
	return [
		{ title: 'Settings - Play Doctor' },
		{
			name: 'description',
			content: 'Customize your clinic experience',
		},
	]
}

export default function Settings() {
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
						<h1 className="text-4xl font-bold text-text-dark">⚙️ Settings</h1>
					</div>
					<p className="mt-2 text-lg text-warm-gray">
						Customize your clinic and make it your own!
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Sound Settings */}
					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h2 className="mb-4 text-2xl font-bold text-text-dark">
							🔊 Sound Settings
						</h2>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-text-dark">Sound Effects</h3>
									<p className="text-sm text-warm-gray">
										Hear fun sounds when using medical tools
									</p>
								</div>
								<button className="rounded-full bg-doctor-green px-4 py-2 text-sm font-medium text-white hover:bg-doctor-green-dark">
									ON
								</button>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-text-dark">
										Background Music
									</h3>
									<p className="text-sm text-warm-gray">
										Gentle music while you work
									</p>
								</div>
								<button className="rounded-full bg-soft-gray px-4 py-2 text-sm font-medium text-text-dark hover:bg-medical-blue">
									OFF
								</button>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-text-dark">Volume</h3>
									<p className="text-sm text-warm-gray">
										How loud should the sounds be?
									</p>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm">🔈</span>
									<div className="h-2 w-24 rounded-full bg-soft-gray">
										<div className="h-2 w-16 rounded-full bg-doctor-blue"></div>
									</div>
									<span className="text-sm">🔊</span>
								</div>
							</div>
						</div>
					</div>

					{/* Clinic Settings */}
					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h2 className="mb-4 text-2xl font-bold text-text-dark">
							🏥 Clinic Settings
						</h2>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-text-dark">Clinic Name</h3>
									<p className="text-sm text-warm-gray">
										Give your clinic a special name
									</p>
								</div>
								<Input
									placeholder="My Doctor Clinic"
									className="border-2 border-soft-gray focus:border-doctor-blue"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-text-dark">Doctor Name</h3>
									<p className="text-sm text-warm-gray">
										What should patients call you?
									</p>
								</div>
								<Input
									placeholder="Dr. Helper"
									className="border-2 border-soft-gray focus:border-doctor-blue"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-text-dark">Theme Color</h3>
									<p className="text-sm text-warm-gray">
										Choose your favorite clinic color
									</p>
								</div>
								<div className="flex gap-2">
									<button className="h-6 w-6 rounded-full bg-doctor-blue"></button>
									<button className="h-6 w-6 rounded-full bg-happy-orange"></button>
									<button className="h-6 w-6 rounded-full bg-doctor-green"></button>
									<button className="h-6 w-6 rounded-full bg-gentle-red"></button>
								</div>
							</div>
						</div>
					</div>

					{/* Game Settings */}
					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h2 className="mb-4 text-2xl font-bold text-text-dark">
							🎮 Game Settings
						</h2>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-text-dark">
										Difficulty Level
									</h3>
									<p className="text-sm text-warm-gray">
										How challenging should the cases be?
									</p>
								</div>
								<select className="rounded-lg border-2 border-soft-gray px-3 py-1 text-sm focus:border-doctor-blue focus:outline-none">
									<option>Easy</option>
									<option>Medium</option>
									<option>Hard</option>
								</select>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-text-dark">Tutorial Hints</h3>
									<p className="text-sm text-warm-gray">
										Show helpful tips while playing
									</p>
								</div>
								<button className="rounded-full bg-doctor-green px-4 py-2 text-sm font-medium text-white hover:bg-doctor-green-dark">
									ON
								</button>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-text-dark">Auto-Save</h3>
									<p className="text-sm text-warm-gray">
										Automatically save your progress
									</p>
								</div>
								<button className="rounded-full bg-doctor-green px-4 py-2 text-sm font-medium text-white hover:bg-doctor-green-dark">
									ON
								</button>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h2 className="mb-4 text-2xl font-bold text-text-dark">
							🛠️ Actions
						</h2>
						<div className="space-y-3">
							<button className="w-full rounded-xl bg-doctor-blue py-3 font-semibold text-white transition-colors hover:bg-doctor-blue-dark">
								💾 Save Settings
							</button>
							<button className="w-full rounded-xl border-2 border-soft-gray py-3 font-semibold text-text-dark transition-colors hover:bg-medical-light">
								🔄 Reset to Default
							</button>
							<button className="hover:bg-gentle-red-light w-full rounded-xl border-2 border-gentle-red py-3 font-semibold text-gentle-red transition-colors">
								🗑️ Clear All Data
							</button>
						</div>
					</div>
				</div>

				{/* Fun Settings Tip */}
				<div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
					<h3 className="mb-4 text-xl font-bold text-text-dark">
						💡 Settings Tips
					</h3>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="rounded-lg bg-medical-light p-4">
							<div className="mb-2 text-2xl">🎵</div>
							<p className="text-sm text-text-dark">
								Try turning on sound effects for a more immersive doctor
								experience!
							</p>
						</div>
						<div className="rounded-lg bg-medical-light p-4">
							<div className="mb-2 text-2xl">🏨</div>
							<p className="text-sm text-text-dark">
								Personalizing your clinic name makes it feel like your very own
								hospital!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
