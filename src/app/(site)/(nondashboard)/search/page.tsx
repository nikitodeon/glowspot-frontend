'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import { setFilters } from '@/store/redux'
import { useAppDispatch, useAppSelector } from '@/store/redux/redux'

import FiltersBar from './FiltersBar'
import FiltersFull from './FiltersFull'
import Listings from './Listings'
import Map from './Map'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { cleanParams } from '@/lib/utils'

const SearchPage = () => {
	const searchParams = useSearchParams()

	const dispatch = useAppDispatch()
	const isFiltersFullOpen = useAppSelector(
		state => state.global.isFiltersFullOpen
	)

	useEffect(() => {
		const initialFilters = Array.from(searchParams.entries()).reduce(
			(acc: any, [key, value]) => {
				if (key === 'priceRange' || key === 'squareFeet') {
					acc[key] = value
						.split(',')
						.map(v => (v === '' ? null : Number(v)))
				} else if (key === 'coordinates') {
					acc[key] = value.split(',').map(Number)
				} else {
					acc[key] = value === 'any' ? null : value
				}

				return acc
			},
			{}
		)

		const cleanedFilters = cleanParams(initialFilters)
		dispatch(setFilters(cleanedFilters))
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div
			className='mx-auto mt-12 flex h-full w-full flex-col'
			// style={{
			// 	height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
			// 	minHeight: '800px'
			// }}
		>
			<FiltersBar />

			{/* Основной контейнер */}
			<div className='relative mb-5 flex flex-1 flex-col gap-3 overflow-y-auto lg:flex-row'>
				{/* Боковые фильтры */}
				<div
					className={`absolute left-0 top-0 z-50 h-[400px] overflow-auto transition-all duration-300 ease-in-out lg:h-full ${
						isFiltersFullOpen
							? 'visible w-full opacity-100 lg:w-3/12'
							: 'invisible w-0 opacity-0'
					}`}
				>
					<FiltersFull />
				</div>

				{/* Основное содержимое - карта и листинги */}
				<div className='flex flex-1 flex-col lg:flex-row'>
					{/* Карта */}
					<div className='w-full flex-shrink-0 lg:h-full lg:flex-1'>
						<Map />
					</div>

					{/* Листинги */}
					<div className='w-full overflow-y-auto lg:basis-4/12'>
						<Listings />
					</div>
				</div>
			</div>
		</div>
	)
}

export default SearchPage
