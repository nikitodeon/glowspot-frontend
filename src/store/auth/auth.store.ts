// store/auth/auth.store.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type AuthStore = {
	isAuthenticated: boolean
	_hasHydrated: boolean
	setIsAuthenticated: (value: boolean) => void
	setHasHydrated: (value: boolean) => void
}

export const authStore = create(
	persist<AuthStore>(
		set => ({
			isAuthenticated: false,
			_hasHydrated: false,
			setIsAuthenticated: (value: boolean) =>
				set({ isAuthenticated: value }),
			setHasHydrated: (value: boolean) => set({ _hasHydrated: value })
		}),
		{
			name: 'auth',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				state?.setHasHydrated(true)
			}
		}
	)
)
