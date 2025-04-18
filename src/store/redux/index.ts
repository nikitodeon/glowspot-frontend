import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface FiltersState {
	location: string

	status:
		| 'UPCOMING'
		| 'ONGOING'
		| 'COMPLETED'
		| 'CANCELLED'
		| 'ARCHIVED'
		| 'any'
	paymentType: 'FREE' | 'PAYMENT_REQUIRED' | 'DONATION' | 'any'

	eventType: 'any' | EventTypeEnum | null
	eventProperties: string[]

	priceRange: [number, number] | [null, null]
	dateRange: any

	coordinates: [number, number]
	currency: string
	verifiedOnly: boolean
}

interface InitialStateTypes {
	filters: FiltersState
	isFiltersFullOpen: boolean
	viewMode: 'grid' | 'list'
}

export const initialState: InitialStateTypes = {
	filters: {
		location: 'Минск',
		status: 'any',

		paymentType: 'any',
		eventType: 'any',
		eventProperties: [],

		priceRange: [null, null],
		dateRange: [null, null] as [string | null, string | null],
		currency: 'any',
		verifiedOnly: false,

		coordinates: [27.57, 53.9]
	},
	isFiltersFullOpen: true,
	viewMode: 'grid'
}

export const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
			// Добавляем обработку verifiedOnly
			const payload = action.payload
			if (typeof payload.verifiedOnly === 'string') {
				payload.verifiedOnly = payload.verifiedOnly === 'true'
			}

			if (action.payload.dateRange) {
				let dateRange: [string | null, string | null] = [null, null]

				if (typeof action.payload.dateRange === 'string') {
					const parts = action.payload.dateRange.split(',')
					dateRange = [
						parts[0] && parts[0] !== 'null' ? parts[0] : null,
						parts[1] && parts[1] !== 'null' ? parts[1] : null
					]
				} else if (Array.isArray(action.payload.dateRange)) {
					dateRange = [
						action.payload.dateRange[0] || null,
						action.payload.dateRange[1] || null
					]
				}

				state.filters = {
					...state.filters,
					...action.payload,
					dateRange,
					verifiedOnly:
						typeof payload.verifiedOnly !== 'undefined'
							? payload.verifiedOnly
							: state.filters.verifiedOnly
				}
			} else {
				state.filters = {
					...state.filters,
					...action.payload,
					verifiedOnly:
						typeof payload.verifiedOnly !== 'undefined'
							? payload.verifiedOnly
							: state.filters.verifiedOnly
				}
			}
		},
		toggleFiltersFullOpen: (
			state,
			action: PayloadAction<boolean | undefined>
		) => {
			state.isFiltersFullOpen =
				action.payload !== undefined
					? action.payload
					: !state.isFiltersFullOpen
		},
		setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
			state.viewMode = action.payload
		}
	}
})
export const { setFilters, toggleFiltersFullOpen, setViewMode } =
	globalSlice.actions

export default globalSlice.reducer
