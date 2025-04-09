'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { setFilters } from '@/store/redux'
import { useAppDispatch } from '@/store/redux/redux'

import { NAVBAR_HEIGHT } from '@/lib/constants'
import { cleanParams } from '@/lib/utils'

export default function Layout({
	children,
	modal
}: {
	children: React.ReactNode
	modal: React.ReactNode
}) {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) return null

	return (
		<div
			className='mx-auto flex w-full flex-col px-5'
			style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
		>
			<Suspense fallback={null}>
				<FilterInitializer />
				{children}
				{modal}
			</Suspense>
		</div>
	)
}

function FilterInitializer() {
	const searchParams = useSearchParams()
	const dispatch = useAppDispatch()

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

	return null
}
