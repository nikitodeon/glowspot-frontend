import { debounce, set } from 'lodash'
import { Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/commonApp/button'
import { Input } from '@/components/ui/commonApp/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/commonApp/select'
import { Slider } from '@/components/ui/commonApp/slider'

import { FiltersState, initialState, setFilters } from '@/store/redux'
import { useAppSelector } from '@/store/redux/redux'

import { EventPropertyIcons, EventTypeIcons } from '@/lib/constants'
import { cleanParams, cn } from '@/lib/utils'

const FiltersFull = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const pathname = usePathname()
	const filters = useAppSelector(state => state.global.filters)
	const [localFilters, setLocalFilters] = useState(initialState.filters)
	const isFiltersFullOpen = useAppSelector(
		state => state.global.isFiltersFullOpen
	)

	const updateURL = debounce((newFilters: FiltersState) => {
		const cleanFilters = cleanParams(newFilters)
		const updatedSearchParams = new URLSearchParams()

		Object.entries(cleanFilters).forEach(([key, value]) => {
			updatedSearchParams.set(
				key,
				Array.isArray(value) ? value.join(',') : value.toString()
			)
		})

		router.push(`${pathname}?${updatedSearchParams.toString()}`)
	}, 300)

	const handleSubmit = () => {
		dispatch(setFilters(localFilters))
		updateURL(localFilters)
	}

	const handleReset = () => {
		dispatch(setFilters(initialState.filters))
		updateURL(initialState.filters)
		setLocalFilters(initialState.filters)
	}

	const handleEventTypeChange = (
		eventType:
			| 'EXHIBITION'
			| 'MEETUP'
			| 'WALK'
			| 'PARTY'
			| 'CONCERT'
			| 'SPORT'
			| 'FESTIVAL'
			| 'LECTURE'
			| 'WORKSHOP'
			| 'OTHER'
			| 'any'
	) => {
		setLocalFilters(prev => ({
			...prev,
			eventType: eventType // Здесь мы указываем, что eventType должен быть одним из этих значений
		}))
	}
	// const handleFilterChange = (key: keyof FiltersState, value: any) => {
	// 	const newFilters: FiltersState = {
	// 		...localFilters,
	// 		[key]: value
	// 	}

	// 	setLocalFilters(newFilters)
	// 	updateURL(newFilters)
	// }
	// const handlePriceChange = (value: number[]) => {
	// 	const [newMin, newMax] = value as [number, number]

	// 	// Определяем текущие значения
	// 	const currentMin = localFilters.priceRange[0]
	// 	const currentMax = localFilters.priceRange[1]

	// 	let minPrice: number | null = newMin
	// 	let maxPrice: number | null = newMax

	// 	// Если минимальная цена установлена в 0 - сбрасываем в null
	// 	if (newMin === 0) {
	// 		minPrice = null
	// 	}

	// 	// Если максимальная цена меньше 1000
	// 	if (newMax < 1000) {
	// 		// Если минимальная была null (была на 0) - устанавливаем в 0
	// 		if (minPrice === null) {
	// 			minPrice = 0
	// 		}
	// 		// Иначе оставляем как есть (либо 0, либо текущее значение)
	// 	}

	// 	// Если максимальная цена 1000 - сбрасываем в null
	// 	// if (newMax === 1000) {
	// 	//   maxPrice = null;
	// 	// }

	// 	const newPriceRange: [number | null, number | null] = [
	// 		minPrice,
	// 		maxPrice
	// 	]

	// const newFilters = {
	// 	...localFilters,
	// 	priceRange: newPriceRange
	// }

	// setLocalFilters(newFilters as FiltersState)
	// }
	if (!isFiltersFullOpen) return null

	return (
		<div className='mmbg-black h-full overflow-auto rounded-lg bg-black px-4 pb-10'>
			<div className='flex flex-col space-y-6'>
				{/* Location */}
				<div>
					<h4 className='mb-2 font-bold text-white'>Location</h4>
					<div className='flex items-center'>
						<Input
							placeholder='Enter location'
							value={filters.location}
							onChange={e =>
								setLocalFilters(prev => ({
									...prev,
									location: e.target.value
								}))
							}
							className='rounded-l-xl rounded-r-none border-r-0 border-white text-white'
						/>
						<Button
							onClick={() => updateURL(localFilters)}
							className='border-l-none hover:bg-primary-700 hover:text-primary-50 rounded-l-none rounded-r-xl border border-white shadow-none'
						>
							<Search className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Event Type */}
				<div>
					<h4 className='mb-2 font-bold text-white'>Event Type</h4>
					<div className='grid grid-cols-2 gap-4'>
						{Object.entries(EventTypeIcons).map(([type, Icon]) => (
							<div
								key={type}
								className={cn(
									'flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 text-white',
									localFilters.eventType === type
										? 'border-primary-700'
										: 'border-gray-200'
								)}
								onClick={() =>
									handleEventTypeChange(
										type as
											| 'EXHIBITION'
											| 'MEETUP'
											| 'WALK'
											| 'PARTY'
											| 'CONCERT'
											| 'SPORT'
											| 'FESTIVAL'
											| 'LECTURE'
											| 'WORKSHOP'
											| 'OTHER'
											| 'any'
									)
								}
							>
								<Icon className='mb-2 h-6 w-6 text-white' />
								<span>{type}</span>
							</div>
						))}
					</div>
				</div>

				{/* Price Range (using Slider instead of Select) */}
				<div>
					<h4 className='mb-2 font-bold text-white'>
						Price Range (Monthly)
					</h4>
					<Slider
						min={0}
						max={500}
						step={5}
						value={[
							localFilters.priceRange[0] ?? 0,
							localFilters.priceRange[1] ?? 500
						]}
						onValueChange={(value: [number, number]) => {
							setLocalFilters(prev => ({
								...prev,
								priceRange: value // без всякой логики, как есть
							}))
						}}
					/>
					<div className='mt-2 flex justify-between text-white'>
						<span>{localFilters.priceRange[0] ?? 0} BYN</span>
						<span>{localFilters.priceRange[1] ?? 500} BYN</span>
					</div>
				</div>

				{/* Status and Payment Type */}
				<div className='flex gap-4'>
					<div className='flex-1'>
						<h4 className='mb-2 font-bold text-white'>Status</h4>
						<Select
							value={localFilters.status || 'any'}
							onValueChange={value =>
								setLocalFilters(prev => ({
									...prev,
									status: value as
										| 'UPCOMING'
										| 'ONGOING'
										| 'COMPLETED'
										| 'CANCELLED'
										| 'ARCHIVED'
										| 'any'
								}))
							}
						>
							<SelectTrigger className='w-full rounded-xl border-white text-white'>
								<SelectValue placeholder='Status' />
							</SelectTrigger>
							<SelectContent className='bg-black'>
								<SelectItem value='any'>Any</SelectItem>
								<SelectItem value='UPCOMING'>
									Upcoming
								</SelectItem>
								<SelectItem value='ONGOING'>Ongoing</SelectItem>
								<SelectItem value='COMPLETED'>
									Completed
								</SelectItem>
								<SelectItem value='CANCELLED'>
									Cancelled
								</SelectItem>
								<SelectItem value='ARCHIVED'>
									Archived
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className='flex-1'>
						<h4 className='mb-2 font-bold text-white'>
							Тип оплаты
						</h4>
						<Select
							value={localFilters.paymentType || 'any'}
							onValueChange={value =>
								setLocalFilters(prev => ({
									...prev,
									paymentType: value as
										| 'FREE'
										| 'PAYMENT_REQUIRED'
										| 'DONATION'
										| 'any'
								}))
							}
						>
							<SelectTrigger className='w-full rounded-xl border-white text-white'>
								<SelectValue placeholder='Payment Type' />
							</SelectTrigger>
							<SelectContent className='bg-black'>
								<SelectItem value='any'>
									Любая оплата
								</SelectItem>
								<SelectItem value='FREE'>Бесплатно</SelectItem>
								<SelectItem value='PAYMENT_REQUIRED'>
									Платно
								</SelectItem>
								<SelectItem value='DONATION'>
									По желанию
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Apply and Reset buttons */}
				<div className='mt-6 flex gap-4'>
					<Button
						onClick={handleSubmit}
						className='bg-primary-700 flex-1 rounded-xl border border-white bg-black text-white'
					>
						Apply
					</Button>
					<Button
						onClick={handleReset}
						variant='outline'
						className='flex-1 rounded-xl border-white text-white'
					>
						Reset Filters
					</Button>
				</div>
			</div>
		</div>
	)
}

export default FiltersFull
