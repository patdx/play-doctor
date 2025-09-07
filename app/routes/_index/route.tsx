import { Link } from 'react-router'

export function meta() {
	return [
		{ title: 'Play Doctor - Fun Medical Simulator for Kids' },
		{
			name: 'description',
			content:
				'A colorful, fun medical simulation app where kids can play pretend doctor!',
		},
	]
}

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[--color-medical-light] via-[--color-doctor-blue] to-[--color-doctor-green]">
			{/* Header */}
			<div className="container mx-auto px-6 py-8">
				<div className="text-center">
					<h1 className="mb-4 text-6xl font-bold text-white drop-shadow-lg">
						🏥 Play Doctor
					</h1>
					<p className="mb-8 text-xl text-white drop-shadow-md">
						Welcome to your magical medical clinic! Help patients feel better
						with fun treatments and friendly care.
					</p>
				</div>

				{/* Main Navigation Grid */}
				<div className="mx-auto mt-12 max-w-4xl">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{/* Patients */}
						<Link
							to="/patients"
							className="group transform rounded-3xl bg-white p-8 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
						>
							<div className="mb-4 text-6xl">👥</div>
							<h2 className="mb-2 text-2xl font-bold text-[--color-text-dark]">
								My Patients
							</h2>
							<p className="text-[--color-warm-gray]">
								See all your patients and their colorful medical records
							</p>
						</Link>

						{/* Appointments */}
						<Link
							to="/appointments"
							className="group transform rounded-3xl bg-white p-8 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
						>
							<div className="mb-4 text-6xl">📅</div>
							<h2 className="mb-2 text-2xl font-bold text-[--color-text-dark]">
								Appointments
							</h2>
							<p className="text-[--color-warm-gray]">
								Schedule checkups and manage your daily patient visits
							</p>
						</Link>

						{/* Medical Tools */}
						<Link
							to="/medical-tools"
							className="group transform rounded-3xl bg-white p-8 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
						>
							<div className="mb-4 text-6xl">🩺</div>
							<h2 className="mb-2 text-2xl font-bold text-[--color-text-dark]">
								Medical Kit
							</h2>
							<p className="text-[--color-warm-gray]">
								Use fun medical tools to diagnose and treat patients
							</p>
						</Link>

						{/* Billing */}
						<Link
							to="/billing"
							className="group transform rounded-3xl bg-white p-8 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
						>
							<div className="mb-4 text-6xl">💰</div>
							<h2 className="mb-2 text-2xl font-bold text-[--color-text-dark]">
								Billing Fun
							</h2>
							<p className="text-[--color-warm-gray]">
								Practice with play money and receipts
							</p>
						</Link>

						{/* Reports */}
						<Link
							to="/reports"
							className="group transform rounded-3xl bg-white p-8 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
						>
							<div className="mb-4 text-6xl">📊</div>
							<h2 className="mb-2 text-2xl font-bold text-[--color-text-dark]">
								My Reports
							</h2>
							<p className="text-[--color-warm-gray]">
								See how many patients you've helped today
							</p>
						</Link>

						{/* Settings */}
						<Link
							to="/settings"
							className="group transform rounded-3xl bg-white p-8 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
						>
							<div className="mb-4 text-6xl">⚙️</div>
							<h2 className="mb-2 text-2xl font-bold text-[--color-text-dark]">
								Settings
							</h2>
							<p className="text-[--color-warm-gray]">
								Customize your clinic and sound settings
							</p>
						</Link>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
					<div className="grid grid-cols-3 gap-4 text-center text-white">
						<div>
							<div className="text-3xl font-bold">0</div>
							<div className="text-sm">Patients Helped</div>
						</div>
						<div>
							<div className="text-3xl font-bold">Level 1</div>
							<div className="text-sm">Doctor Level</div>
						</div>
						<div>
							<div className="text-3xl font-bold">0</div>
							<div className="text-sm">Badges Earned</div>
						</div>
					</div>
				</div>

				{/* Welcome Message */}
				<div className="mt-8 text-center">
					<p className="text-lg text-white/90">
						👨‍⚕️ Ready to be the best doctor ever? Let's help some patients feel
						better! 👩‍⚕️
					</p>
				</div>
			</div>
		</div>
	)
}
