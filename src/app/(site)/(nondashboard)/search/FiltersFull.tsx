import { debounce } from 'lodash'
import { Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/commonApp/button'
import { Input } from '@/components/ui/commonApp/input'
import { Label } from '@/components/ui/commonApp/label'
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
import { cleanParams, cn, formatEnumString } from '@/lib/utils'

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
	})

	const handleSubmit = () => {
		dispatch(setFilters(localFilters))
		updateURL(localFilters)
	}

	const handleReset = () => {
		setLocalFilters(initialState.filters)
		dispatch(setFilters(initialState.filters))
		updateURL(initialState.filters)
	}

	const handleAmenityChange = (amenity: EventPropertyEnum) => {
		setLocalFilters(prev => ({
			...prev,
			eventProperties: prev.eventProperties.includes(amenity)
				? prev.eventProperties.filter(a => a !== amenity)
				: [...prev.eventProperties, amenity]
		}))
	}

	//   const handleLocationSearch = async () => {
	//     try {
	//       const response = await fetch(
	//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
	//           localFilters.location
	//         )}.json?access_token=${
	//           process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
	//         }&fuzzyMatch=true`
	//       );
	//       const data = await response.json();
	//       if (data.features && data.features.length > 0) {
	//         const [lng, lat] = data.features[0].center;
	//         setLocalFilters((prev) => ({
	//           ...prev,
	//           coordinates: [lng, lat],
	//         }));
	//       }
	//     } catch (err) {
	//       console.error("Error search location:", err);
	//     }
	//   };

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
							//   onClick={handleLocationSearch}
							className='border-l-none hover:bg-primary-700 hover:text-primary-50 rounded-l-none rounded-r-xl border border-white shadow-none'
						>
							<Search className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Property Type */}
				<div>
					<h4 className='mb-2 font-bold text-white'>Property Type</h4>
					<div className='grid grid-cols-2 gap-4'>
						{Object.entries(EventTypeIcons).map(([type, Icon]) => (
							<div
								key={type}
								className={cn(
									'flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 text-white',
									localFilters.eventType === type
										? 'border-gray-500'
										: 'border-gray-200'
								)}
								onClick={() =>
									setLocalFilters(prev => ({
										...prev,
										propertyType: type as EventTypeEnum
									}))
								}
							>
								<Icon className='mb-2 h-6 w-6 text-white' />
								<span>{type}</span>
							</div>
						))}
					</div>
				</div>

				{/* Price Range */}
				<div>
					<h4 className='mb-2 font-bold text-white'>
						Price Range (Monthly)
					</h4>
					<Slider
						min={0}
						max={10000}
						step={100}
						value={[
							localFilters.priceRange[0] ?? 0,
							localFilters.priceRange[1] ?? 10000
						]}
						className=''
						onValueChange={(value: any) =>
							setLocalFilters(prev => ({
								...prev,
								priceRange: value as [number, number]
							}))
						}
					/>
					<div className='mt-2 flex justify-between text-white'>
						<span>${localFilters.priceRange[0] ?? 0}</span>
						<span>${localFilters.priceRange[1] ?? 10000}</span>
					</div>
				</div>

				{/* Beds and Baths */}
				<div className='flex gap-4'>
					<div className='flex-1'>
						<h4 className='mb-2 font-bold text-white'>Статус</h4>
						<Select
							value={localFilters.status || 'any'}
							onValueChange={value =>
								setLocalFilters(prev => ({
									...prev,
									status: value
								}))
							}
						>
							<SelectTrigger className='w-full rounded-xl border-white text-white'>
								<SelectValue placeholder='Beds' />
							</SelectTrigger>
							<SelectContent className='bg-black'>
								<SelectItem value='any'>Любой</SelectItem>
								<SelectItem value='1'> В будущем </SelectItem>
								<SelectItem value='2'> В процессе </SelectItem>
								<SelectItem value='3'>Завершено</SelectItem>
								<SelectItem value='4'> Отменено </SelectItem>
								<SelectItem value='4'>
									Заархивировано
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
									baths: value
								}))
							}
						>
							<SelectTrigger className='w-full rounded-xl border-white text-white'>
								<SelectValue placeholder='Baths' />
							</SelectTrigger>
							<SelectContent className='bg-black'>
								<SelectItem value='any' className='text-white'>
									Любой
								</SelectItem>
								<SelectItem value='1'>Бесплатное</SelectItem>
								<SelectItem value='2'>Платное</SelectItem>
								<SelectItem value='3'>По желанию</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Square Feet
				<div>
					<h4 className='mb-2 font-bold text-white'>Square Feet</h4>
					<Slider
						min={0}
						max={5000}
						step={100}
						value={[
							localFilters.squareFeet[0] ?? 0,
							localFilters.squareFeet[1] ?? 5000
						]}
						onValueChange={value =>
							setLocalFilters(prev => ({
								...prev,
								squareFeet: value as [number, number]
							}))
						}
						className='[&>.bar]:bg-primary-700'
					/>
					<div className='mt-2 flex justify-between text-white'>
						<span>{localFilters.squareFeet[0] ?? 0} sq ft</span>
						<span>{localFilters.squareFeet[1] ?? 5000} sq ft</span>
					</div>
				</div> */}

				{/* Amenities */}
				<div>
					<h4 className='mb-2 font-bold text-white'>Amenities</h4>
					<div className='flex flex-wrap gap-2'>
						{Object.entries(EventPropertyIcons).map(
							([amenity, Icon]) => (
								<div
									key={amenity}
									className={cn(
										'flex items-center space-x-2 rounded-lg border p-2 text-white hover:cursor-pointer',
										localFilters.eventProperties.includes(
											amenity as EventPropertyEnum
										)
											? 'border-gray-500'
											: 'border-gray-200'
									)}
									onClick={() =>
										handleAmenityChange(
											amenity as EventPropertyEnum
										)
									}
								>
									<Icon className='h-5 w-5 hover:cursor-pointer' />
									<Label className='hover:cursor-pointer'>
										{formatEnumString(amenity)}
									</Label>
								</div>
							)
						)}
					</div>
				</div>

				{/* Available From */}
				<div>
					<h4 className='mb-2 font-bold text-white'>
						Available From
					</h4>
					{/* <Input
						// className='text-white'
						type='date'
						value={
							localFilters.availableFrom !== 'any'
								? localFilters.availableFrom
								: ''
						}
						onChange={e =>
							setLocalFilters(prev => ({
								...prev,
								availableFrom: e.target.value
									? e.target.value
									: 'any'
							}))
						}
						className='rounded-xl border-white text-white'
					/> */}
				</div>

				{/* Apply and Reset buttons */}
				<div className='mt-6 flex gap-4'>
					<Button
						onClick={handleSubmit}
						className='bg-primary-700 flex-1 rounded-xl border border-white bg-black text-white'
					>
						APPLY
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
