import { debounce, set } from 'lodash'
import { Home, Search } from 'lucide-react'
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
	// const [sliderStates, setSliderStates] = useState({
	// 	smallRangeActive: false,
	// 	largeRangeActive: false
	// })
	const [isPriceFilterActive, setIsPriceFilterActive] = useState(false)

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
		// setSliderStates({
		// 	smallRangeActive: false,
		// 	largeRangeActive: false
		// })
		setIsPriceFilterActive(false)
	}

	const handleEventTypeChange = (eventType: EventTypeEnum | 'any') => {
		setLocalFilters(prev => ({
			...prev,
			eventType: eventType === 'any' ? null : eventType
		}))
	}
	const handleSliderChange = (
		value: [number, number],
		rangeType: 'small' | 'large'
	) => {
		setLocalFilters(prev => ({
			...prev,
			priceRange: value
		}))

		// setSliderStates(prev => ({
		// 	...prev,
		// 	smallRangeActive: rangeType === 'small' || prev.smallRangeActive,
		// 	largeRangeActive: rangeType === 'large' || prev.largeRangeActive
		// }))
		setIsPriceFilterActive(true)
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

	const getCurrencyName = (currencyCode: string | null) => {
		switch (currencyCode) {
			case 'BYN':
				return 'BYN'
			case 'USD':
				return 'USD'
			case 'EUR':
				return 'EUR'
			case 'RUB':
				return 'RUB'
			case 'any':
				return null
			default:
				return null
		}
	}
	const currencyName = getCurrencyName(localFilters.currency)

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
					<h4 className='mb-2 font-bold text-white'>
						Тип мероприятия
					</h4>
					<div className='grid grid-cols-3 gap-2'>
						{' '}
						{/* Увеличиваем количество колонок и уменьшаем отступы */}
						<Button
							key='any'
							variant='ghost'
							className={cn(
								'flex h-auto min-h-0 flex-col items-center justify-center rounded-lg p-2 text-white hover:bg-black',
								!localFilters.eventType
									? 'border-[3px] border-white bg-black'
									: 'border-2 border-white/70'
							)}
							onClick={() => handleEventTypeChange('any')}
						>
							<Home className='mb-1 h-5 w-5 text-white' />
							<span className='text-xs'>Любой</span>
						</Button>
						{Object.entries(EventTypeIcons).map(([type, Icon]) => (
							<Button
								key={type}
								variant='ghost'
								className={cn(
									'flex h-auto min-h-0 flex-col items-center justify-center rounded-lg p-2 text-white hover:bg-black',
									localFilters.eventType === type ||
										(!localFilters.eventType &&
											type === 'any')
										? 'border-[3px] border-white bg-black'
										: 'bgkk-gray-800/50 borderkk-gray-600 border-2 border-white/70'
								)}
								onClick={() =>
									handleEventTypeChange(type as EventTypeEnum)
								}
							>
								<Icon className='mb-1 h-5 w-5 text-white' />
								<span className='text-xs'>
									{type === 'EXHIBITION' && 'Выставка'}
									{type === 'MEETUP' && 'Встреча'}
									{type === 'WALK' && 'Прогулка'}
									{type === 'PARTY' && 'Вечеринка'}
									{type === 'CONCERT' && 'Концерт'}
									{type === 'SPORT' && 'Спорт'}
									{type === 'FESTIVAL' && 'Фестиваль'}
									{type === 'LECTURE' && 'Лекция'}

									{type === 'OTHER' && 'Другое'}
									{type === 'MOVIE' && 'Кино'}
									{type === 'THEATRE' && 'Театр'}
									{type === 'STANDUP' && 'Стендап'}
									{type === 'DANCE' && 'Танцы'}
									{type === 'BOOK_CLUB' && 'Книги'}
									{type === 'KARAOKE' && 'Караоке'}
									{type === 'CYBERSPORT' && 'Киберспорт'}
									{type === 'KIDS_EVENT' && 'Для детей'}
								</span>
							</Button>
						))}
					</div>
				</div>
				<div>
					<h4 className='mb-2 font-bold text-white'>Валюта</h4>
					<Select
						value={localFilters.currency || 'any'}
						onValueChange={value =>
							setLocalFilters(prev => ({
								...prev,
								currency: value as
									| 'BYN'
									| 'USD'
									| 'EUR'
									| 'RUB'
									| 'any'
							}))
						}
					>
						<SelectTrigger className='w-full rounded-xl border-white text-white'>
							<SelectValue placeholder='Select currency' />
						</SelectTrigger>
						<SelectContent className='bg-black'>
							<SelectItem value='any'>Любая</SelectItem>
							<SelectItem value='BYN'>BYN</SelectItem>
							<SelectItem value='USD'>USD</SelectItem>
							<SelectItem value='EUR'>EUR</SelectItem>
							<SelectItem value='RUB'>RUB</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Price Range (using Slider instead of Select) */}

				<div>
					<div className='mb-2 flex items-center justify-between'>
						<h4 className='font-bold text-white'>
							Малый диапазон цены
						</h4>
						<span className='text-xs text-gray-400'>
							{/* {sliderStates.smallRangeActive
								? 'Активирован'
								: 'Деактивирован'} */}
							<span className='text-xs text-gray-400'>
								{isPriceFilterActive ? 'Активен' : 'Не активен'}
							</span>
						</span>
					</div>
					<Slider
						min={0}
						max={500}
						step={5}
						value={[
							localFilters.priceRange[0] ?? 0,
							localFilters.priceRange[1] ?? 500
						]}
						onValueChange={(value: [number, number]) =>
							handleSliderChange(value, 'small')
						}
					/>
					<div className='mt-2 flex justify-between text-white'>
						<span>
							{localFilters.priceRange[0] ?? 0}{' '}
							{currencyName && <>{currencyName}</>}
						</span>
						<span>
							{localFilters.priceRange[1] ?? 500}{' '}
							{currencyName && <>{currencyName}</>}
						</span>
					</div>
				</div>

				{/* Большой диапазон цены */}
				<div>
					<div className='mb-2 flex items-center justify-between'>
						<h4 className='font-bold text-white'>
							Большой диапазон цены
						</h4>
						<span className='text-xs text-gray-400'>
							{isPriceFilterActive ? 'Активен' : 'Не активен'}
						</span>
					</div>
					<Slider
						min={0}
						max={20000}
						step={100}
						value={[
							localFilters.priceRange[0] ?? 0,
							localFilters.priceRange[1] ?? 20000
						]}
						onValueChange={(value: [number, number]) =>
							handleSliderChange(value, 'large')
						}
					/>
					<div className='mt-2 flex justify-between text-white'>
						<span>
							{localFilters.priceRange[0] ?? 0}{' '}
							{currencyName && <>{currencyName}</>}
						</span>
						<span>
							{localFilters.priceRange[1] ?? 20000}{' '}
							{currencyName && <>{currencyName}</>}
						</span>
					</div>
				</div>
				{/* Status and Payment Type */}
				<div className='flex gap-4'>
					<div className='flex-1'>
						<h4 className='mb-2 font-bold text-white'>Статус</h4>
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
								<SelectItem value='any'>Любой</SelectItem>
								<SelectItem value='UPCOMING'>
									Предстоящее
								</SelectItem>
								<SelectItem value='ONGOING'>
									Активное
								</SelectItem>
								<SelectItem value='COMPLETED'>
									Завершённое
								</SelectItem>
								<SelectItem value='CANCELLED'>
									Отменённое
								</SelectItem>
								<SelectItem value='ARCHIVED'>
									В архиве
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
						Применить
					</Button>
					<Button
						onClick={handleReset}
						variant='outline'
						className='flex-1 rounded-xl border-white text-white'
					>
						Сбросить фильтры
					</Button>
				</div>
			</div>
		</div>
	)
}

export default FiltersFull
