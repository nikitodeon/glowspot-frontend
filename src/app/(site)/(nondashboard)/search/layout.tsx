// src/app/(site)/(nondashboard)/search/layout.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { setFilters } from '@/store/redux'
import { useAppDispatch, useAppSelector } from '@/store/redux/redux'

import { NAVBAR_HEIGHT } from '@/lib/constants'
import { cleanParams } from '@/lib/utils'

// src/app/(site)/(nondashboard)/search/layout.tsx

// src/app/(site)/(nondashboard)/search/layout.tsx

// src/app/(site)/(nondashboard)/search/layout.tsx

// src/app/(site)/(nondashboard)/search/layout.tsx

// src/app/(site)/(nondashboard)/search/layout.tsx

export default function Layout({ children }: { children: React.ReactNode }) {
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
		dispatch(setFilters(cleanParams(initialFilters)))
	}, [searchParams, dispatch])

	return (
		<div
			className='mx-auto flex w-full flex-col px-5'
			style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
		>
			{children}
		</div>
	)
}
