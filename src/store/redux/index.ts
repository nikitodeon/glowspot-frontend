import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface FiltersState {
	location: string
	// beds: string
	status:
		| 'UPCOMING'
		| 'ONGOING'
		| 'COMPLETED'
		| 'CANCELLED'
		| 'ARCHIVED'
		| 'any'
	paymentType: 'FREE' | 'PAYMENT_REQUIRED' | 'DONATION' | 'any'
	// baths: string
	// propertyType: string
	// amenities: string[]
	eventType: 'any' | EventTypeEnum | null
	eventProperties: string[]
	// availableFrom: string
	priceRange: [number, number] | [null, null]
	dateRange: [string | null, string | null]
	// squareFeet: [number, number] | [null, null]
	coordinates: [number, number]
	currency: string
}

interface InitialStateTypes {
	filters: FiltersState
	isFiltersFullOpen: boolean
	viewMode: 'grid' | 'list'
}

export const initialState: InitialStateTypes = {
	filters: {
		location: 'Minsk',
		status: 'any',
		// beds: 'any',
		// baths: 'any',
		paymentType: 'any',
		eventType: 'any',
		eventProperties: [],
		// availableFrom: 'any',
		priceRange: [null, null],
		dateRange: [null, null],
		currency: 'any',
		// squareFeet: [null, null],
		coordinates: [53.9, 27.57]
	},
	isFiltersFullOpen: true,
	viewMode: 'grid'
}

export const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
			state.filters = { ...state.filters, ...action.payload }
		},
		toggleFiltersFullOpen: state => {
			state.isFiltersFullOpen = !state.isFiltersFullOpen
		},
		setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
			state.viewMode = action.payload
		}
	}
})

export const { setFilters, toggleFiltersFullOpen, setViewMode } =
	globalSlice.actions

export default globalSlice.reducer
