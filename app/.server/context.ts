import { AsyncLocalStorage } from 'node:async_hooks'
import {
	unstable_createContext,
	unstable_RouterContextProvider,
} from 'react-router'

// TODO: Fix for latest react-router version

export const MyAsyncContext =
	new AsyncLocalStorage<unstable_RouterContextProvider>()

export interface MyRequestContext {
	request: Request
	env: Cloudflare.Env
	executionCtx: ExecutionContext
}

export const myRequestContext = unstable_createContext<MyRequestContext>()

export function getMyRequestContext(): Partial<MyRequestContext> {
	const ctx = MyAsyncContext.getStore()

	const requestContext = ctx?.get(myRequestContext) as
		| MyRequestContext
		| undefined

	return requestContext ?? {}
}
