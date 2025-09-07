import { Link } from 'react-router'

export function meta() {
	return [
		{ title: 'My Reports - Play Doctor' },
		{
			name: 'description',
			content: 'See your doctor progress and achievements',
		},
	]
}

export default function Reports() {
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
						<h1 className="text-4xl font-bold text-text-dark">📊 My Reports</h1>
					</div>
					<p className="mt-2 text-lg text-warm-gray">
						Track your progress and see how many patients you've helped!
					</p>
				</div>

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-3">
					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<div className="mb-4 text-4xl">👥</div>
						<h3 className="mb-2 text-xl font-bold text-text-dark">
							Patients Helped
						</h3>
						<p className="text-3xl font-bold text-doctor-blue">0</p>
						<p className="text-sm text-warm-gray">
							Keep helping patients to increase this number!
						</p>
					</div>

					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<div className="mb-4 text-4xl">⭐</div>
						<h3 className="mb-2 text-xl font-bold text-text-dark">
							Doctor Level
						</h3>
						<p className="text-3xl font-bold text-happy-orange">Level 1</p>
						<p className="text-sm text-warm-gray">
							Gain experience by treating patients!
						</p>
					</div>

					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<div className="mb-4 text-4xl">🏆</div>
						<h3 className="mb-2 text-xl font-bold text-text-dark">
							Badges Earned
						</h3>
						<p className="text-3xl font-bold text-doctor-green">0</p>
						<p className="text-sm text-warm-gray">
							Complete special challenges to earn badges!
						</p>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="rounded-2xl bg-white p-6 shadow-lg">
					<h2 className="mb-4 text-2xl font-bold text-text-dark">
						📈 Recent Activity
					</h2>
					<div className="py-12 text-center">
						<div className="mb-4 text-6xl">📋</div>
						<h3 className="mb-2 text-xl font-bold text-text-dark">
							No Activity Yet
						</h3>
						<p className="mb-6 text-warm-gray">
							Start seeing patients to generate activity reports!
						</p>
						<Link
							to="/appointments/new"
							className="inline-block rounded-full bg-doctor-blue px-6 py-3 font-semibold text-white hover:bg-doctor-blue-dark"
						>
							Schedule First Appointment
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
