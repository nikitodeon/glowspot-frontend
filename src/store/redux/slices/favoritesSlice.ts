import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface FavoritesState {
	[eventId: string]: boolean // ключ - id события, значение - true/false (лайк поставлен или нет)
}

const initialState: FavoritesState = {}

const favoritesSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {
		setFavorite: (
			state,
			action: PayloadAction<{ eventId: string; value: boolean }>
		) => {
			const { eventId, value } = action.payload
			state[eventId] = value
		},
		resetFavorites: () => initialState // для сброса при выходе
	}
})

export const { setFavorite, resetFavorites } = favoritesSlice.actions

export const favoritesReducer = favoritesSlice.reducer
