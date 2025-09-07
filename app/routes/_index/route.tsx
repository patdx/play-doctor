import { getMyRequestContext } from '~/.server/context'
import type { Route } from './+types/route'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'New React Router App' },
		{ name: 'description', content: 'Welcome to React Router!' },
	]
}

export function loader({}: Route.LoaderArgs) {
	const { env } = getMyRequestContext()

	return { message: env?.VALUE_FROM_CLOUDFLARE }
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<div className="mx-auto max-w-2xl p-8 text-center font-sans">
			<h1 className="mb-4 text-4xl text-blue-600">React Router 7 Template</h1>
			<p className="mb-8 text-lg text-gray-700">
				A minimal starter template for building applications with React Router
				7. This template provides a solid foundation for your routing needs.
			</p>
			<a
				href="https://github.com/patdx/react-router-7-template"
				target="_blank"
				rel="noopener noreferrer"
				className="inline-block rounded-md bg-blue-600 px-6 py-3 text-base text-white no-underline transition-colors duration-300 hover:bg-blue-800"
			>
				View on GitHub
			</a>
			<p className="mt-4 text-sm text-gray-500">
				Environment Message: {loaderData.message}
			</p>
		</div>
	)
}
