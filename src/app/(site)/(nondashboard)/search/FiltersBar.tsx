import { debounce } from 'lodash'
import { Filter, Grid, List, Search } from 'lucide-react'
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

import {
	FiltersState,
	setFilters,
	setViewMode,
	toggleFiltersFullOpen
} from '@/store/redux'
import { useAppSelector } from '@/store/redux/redux'

import { EventTypeIcons } from '@/lib/constants'
import { cleanParams, cn, formatPriceValue } from '@/lib/utils'

const FiltersBar = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const pathname = usePathname()
	const filters = useAppSelector(state => state.global.filters)
	const isFiltersFullOpen = useAppSelector(
		state => state.global.isFiltersFullOpen
	)
	const viewMode = useAppSelector(state => state.global.viewMode)
	const [searchInput, setSearchInput] = useState(filters.location)

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
	})

	const handleFilterChange = (
		key: string,
		value: any,
		isMin: boolean | null
	) => {
		let newValue = value

		if (key === 'priceRange') {
			const currentArrayRange = [...filters[key]]
			if (isMin !== null) {
				const index = isMin ? 0 : 1
				currentArrayRange[index] =
					value === 'any' ? null : Number(value)
			}
			newValue = currentArrayRange
		} else if (key === 'coordinates') {
			newValue = value === 'any' ? [0, 0] : value.map(Number)
		} else {
			newValue = value === 'any' ? 'any' : value
		}

		const newFilters = { ...filters, [key]: newValue }
		dispatch(setFilters(newFilters))
		updateURL(newFilters)
	}

	// const handleLocationSearch = async () => {
	//   try {
	//     const response = await fetch(
	//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
	//         searchInput
	//       )}.json?access_token=${
	//         process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
	//       }&fuzzyMatch=true`
	//     );
	//     const data = await response.json();
	//     if (data.features && data.features.length > 0) {
	//       const [lng, lat] = data.features[0].center;
	//       dispatch(
	//         setFilters({
	//           location: searchInput,
	//           coordinates: [lng, lat],
	//         })
	//       );
	//     }
	//   } catch (err) {
	//     console.error("Error search location:", err);
	//   }
	// };

	return (
		<div className='flex w-full items-center justify-between py-5'>
			{/* Filters */}
			<div className='flex items-center justify-between gap-4 p-2'>
				{/* All Filters */}
				<Button
					variant='outline'
					className={cn(
						'border-primary-400 hover:bg-primary-500 hover:text-primary-100 gap-2 rounded-xl text-white',
						isFiltersFullOpen && 'bg-primary-700 text-primary-100'
					)}
					onClick={() => dispatch(toggleFiltersFullOpen())}
				>
					<Filter className='h-4 w-4 text-white' />
					<span>All Filters</span>
				</Button>

				{/* Search Location */}
				<div className='flex items-center'>
					<Input
						placeholder='Search location'
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
						className='border-primary-400 w-40 rounded-l-xl rounded-r-none border-r-0 text-white'
					/>
					<Button
						//   onClick={handleLocationSearch}
						className={`border-l-none border-primary-400 hover:bg-primary-700 hover:text-primary-50 rounded-l-none rounded-r-xl border shadow-none`}
					>
						<Search className='h-4 w-4' />
					</Button>
				</div>

				{/* Price Range */}
				<div className='flex gap-1'>
					{/* Minimum Price Selector */}
					<Select
						value={filters.priceRange[0]?.toString() || 'any'}
						onValueChange={value =>
							handleFilterChange('priceRange', value, true)
						}
					>
						<SelectTrigger className='w-22 border-primary-400 rounded-xl text-white'>
							<SelectValue>
								{formatPriceValue(filters.priceRange[0], true)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent className='bg-black'>
							<SelectItem value='any'>Any Min Price</SelectItem>
							{[500, 1000, 1500, 2000, 3000, 5000, 10000].map(
								price => (
									<SelectItem
										key={price}
										value={price.toString()}
									>
										${price / 1000}k+
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>

					{/* Maximum Price Selector */}
					<Select
						value={filters.priceRange[1]?.toString() || 'any'}
						onValueChange={value =>
							handleFilterChange('priceRange', value, false)
						}
					>
						<SelectTrigger className='w-22 border-primary-400 rounded-xl text-white'>
							<SelectValue>
								{formatPriceValue(filters.priceRange[1], false)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent className='bg-white'>
							<SelectItem value='any'>Any Max Price</SelectItem>
							{[1000, 2000, 3000, 5000, 10000].map(price => (
								<SelectItem
									key={price}
									value={price.toString()}
								>
									&lt;${price / 1000}k
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Beds and Baths */}
				<div className='flex gap-1'>
					{/* Beds */}
					<Select
						value={filters.status}
						onValueChange={value =>
							handleFilterChange('beds', value, null)
						}
					>
						<SelectTrigger className='w-26 border-primary-400 rounded-xl text-white'>
							<SelectValue placeholder='Любой статус' />
						</SelectTrigger>
						<SelectContent className='bg-black'>
							<SelectItem value='any'>Любой статус</SelectItem>
							<SelectItem value='1'> В будущем </SelectItem>
							<SelectItem value='2'> В процессе </SelectItem>
							<SelectItem value='3'>Завершено</SelectItem>
							<SelectItem value='4'> Отменено </SelectItem>
							<SelectItem value='4'>Заархивировано</SelectItem>
						</SelectContent>
					</Select>

					{/* Baths */}
					<Select
						value={filters.paymentType}
						onValueChange={value =>
							handleFilterChange('baths', value, null)
						}
					>
						<SelectTrigger className='w-26 border-primary-400 rounded-xl text-white'>
							<SelectValue placeholder='Любой тип оплаты' />
						</SelectTrigger>
						<SelectContent className='bg-black'>
							<SelectItem value='any'>
								Любой тип оплаты
							</SelectItem>
							<SelectItem value='1'>Бесплатное</SelectItem>
							<SelectItem value='2'>Платное</SelectItem>
							<SelectItem value='3'>По желанию</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Property Type */}
				<Select
					value={filters.eventType || 'any'}
					onValueChange={value =>
						handleFilterChange('propertyType', value, null)
					}
				>
					<SelectTrigger className='border-primary-400 w-32 rounded-xl text-white'>
						<SelectValue placeholder='Home Type' />
					</SelectTrigger>
					<SelectContent className='bg-white'>
						<SelectItem value='any'>Any Type</SelectItem>
						{Object.entries(EventTypeIcons).map(([type, Icon]) => (
							<SelectItem key={type} value={type}>
								<div className='flex items-center'>
									<Icon className='mr-2 h-4 w-4' />
									<span>{type}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* View Mode */}
			<div className='flex items-center justify-between gap-4 p-2'>
				<div className='flex rounded-xl border'>
					<Button
						variant='ghost'
						className={cn(
							'hover:bg-primary-600 hover:text-primary-50 rounded-none rounded-l-xl px-3 py-1 text-white',
							viewMode === 'list'
								? 'bg-primary-700 text-primary-50'
								: ''
						)}
						onClick={() => dispatch(setViewMode('list'))}
					>
						<List className='h-5 w-5' />
					</Button>
					<Button
						variant='ghost'
						className={cn(
							'hover:bg-primary-600 hover:text-primary-50 rounded-none rounded-r-xl px-3 py-1 text-white',
							viewMode === 'grid'
								? 'bg-primary-700 text-primary-50'
								: ''
						)}
						onClick={() => dispatch(setViewMode('grid'))}
					>
						<Grid className='h-5 w-5' />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default FiltersBar
