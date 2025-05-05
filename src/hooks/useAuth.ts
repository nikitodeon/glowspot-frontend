// hooks/useAuth.ts
import { useEffect } from 'react'

import { authStore } from '@/store/auth/auth.store'

export function useAuth() {
	const { isAuthenticated, _hasHydrated, setIsAuthenticated } = authStore()

	// Если нужно дополнительно проверять токен
	useEffect(() => {
		if (_hasHydrated) {
			const token = localStorage.getItem('authToken')
			if (token) setIsAuthenticated(true)
		}
	}, [_hasHydrated, setIsAuthenticated])

	const auth = () => setIsAuthenticated(true)
	const exit = () => {
		localStorage.removeItem('authToken')
		setIsAuthenticated(false)
	}

	return {
		isAuthenticated,
		isHydrated: _hasHydrated,
		auth,
		exit
	}
}
