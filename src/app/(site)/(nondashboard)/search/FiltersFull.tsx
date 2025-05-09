import { Label } from '@radix-ui/react-label'
import { debounce } from 'lodash'
import { Home } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/commonApp/button'
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

import { EventTypeIcons } from '@/lib/constants'
import { cleanParams, cn } from '@/lib/utils'

const FiltersFull = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const pathname = usePathname()
	const filters = useAppSelector(state => state.global.filters)
	const [localFilters, setLocalFilters] = useState(initialState.filters)

	const [isPriceFilterActive, setIsPriceFilterActive] = useState(false)
	// const [searchInput, setSearchInput] = useState(filters.location)
	const isFiltersFullOpen = useAppSelector(
		state => state.global.isFiltersFullOpen
	)

	const updateURL = debounce((newFilters: FiltersState) => {
		const cleanFilters = cleanParams(newFilters)
		const updatedSearchParams = new URLSearchParams()

		Object.entries(cleanFilters).forEach(([key, value]) => {
			if (key === 'dateRange') {
				// Сохраняем как строку с разделителем
				updatedSearchParams.set(
					key,
					value.map((v: any) => v || '').join(',')
				)
			} else if (Array.isArray(value)) {
				updatedSearchParams.set(key, value.join(','))
			} else {
				updatedSearchParams.set(key, value?.toString() ?? '')
			}
		})

		router.push(`${pathname}?${updatedSearchParams.toString()}`)
	}, 300)
	const handleSubmit = () => {
		const filtersToApply = {
			...localFilters,
			location: filters.location, // сохраняем прежнюю локацию
			coordinates: filters.coordinates, // сохраняем прежние координаты
			verifiedOnly: filters.verifiedOnly
		}

		dispatch(setFilters(filtersToApply))
		updateURL(filtersToApply)
	}

	const handleReset = () => {
		const preservedFilters = {
			location: filters.location,
			coordinates: filters.coordinates,
			verifiedOnly: filters.verifiedOnly
		}

		const resetFilters = {
			...initialState.filters,
			...preservedFilters
		}

		dispatch(setFilters(resetFilters))
		updateURL(resetFilters)
		setLocalFilters(resetFilters)

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

		setIsPriceFilterActive(true)
	}
	useEffect(() => {
		const query = new URLSearchParams(window.location.search)
		const rawDateRange = query.get('dateRange')

		console.log('[Init] rawDateRange from URL:', rawDateRange)

		if (rawDateRange) {
			let dateArray: [string | null, string | null] = [null, null]

			try {
				// Пробуем разобрать как строку с разделителем
				const parts = rawDateRange.split(',')

				dateArray = [
					parts[0] && !isNaN(new Date(parts[0]).getTime())
						? new Date(parts[0]).toISOString()
						: null,
					parts[1] && !isNaN(new Date(parts[1]).getTime())
						? new Date(parts[1]).toISOString()
						: null
				]

				console.log('[Init] Parsed Dates from URL:', dateArray)
			} catch (e) {
				console.error('Error parsing dateRange:', e)
			}

			setLocalFilters(prev => ({
				...prev,
				dateRange: dateArray
			}))
		}
	}, [])

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
		<div className='h-full overflow-y-auto overflow-x-hidden rounded-lg bg-black px-4 pb-10'>
			<div className='flex flex-col space-y-6'>
				{/* Event Type */}
				<div>
					<h4 className='mb-2 font-bold text-white'>
						Тип мероприятия
					</h4>
					<div className='grid grid-cols-3 gap-2'>
						<Button
							key='any'
							variant='ghost'
							className={cn(
								'flex h-auto min-h-0 flex-col items-center justify-center rounded-lg p-2 text-white hover:bg-white/10',
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
									'flex h-auto min-h-0 flex-col items-center justify-center rounded-lg p-2 text-white hover:bg-white/10',
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

				{/* Price Range (using Slider instead of Select) */}

				<div className='mb-6'>
					<h4 className='mb-2 font-bold text-white'>
						Временной дипазон активных мероприятий
					</h4>
					<div className='flex gap-4'>
						{/* Дата начала */}
						<div className='flex-1'>
							<Label
								htmlFor='start-date'
								className='mb-1 block text-white'
							>
								С какого числа{' '}
								<span className='text-xs text-gray-400'>
									(необязательное поле)
								</span>
							</Label>
							<DatePicker
								selected={
									localFilters.dateRange[0]
										? new Date(localFilters.dateRange[0])
										: null
								}
								onChange={(date: Date | null) => {
									setLocalFilters(prev => ({
										...prev,
										dateRange: [
											date ? date.toISOString() : null,
											prev.dateRange[1]
										]
									}))
								}}
								selectsStart
								startDate={
									localFilters.dateRange[0]
										? new Date(localFilters.dateRange[0])
										: null
								}
								endDate={
									localFilters.dateRange[1]
										? new Date(localFilters.dateRange[1])
										: null
								}
								showTimeSelect
								timeFormat='HH:mm'
								timeIntervals={15}
								dateFormat='Pp'
								className='w- rounded-md border border-white bg-black p-2 text-white'
								placeholderText='Выберите дату '
								calendarClassName='react-datepicker-dark hide-weekdays only-current-month-days forcells no-outside-days'
								dayClassName={() =>
									'react-datepicker__day-dark'
								}
								weekDayClassName={() =>
									'react-datepicker__day-name-dark'
								}
								timeClassName={() =>
									'react-datepicker__time-dark'
								}
								popperClassName='react-datepicker-dark-popper'
								renderCustomHeader={({
									monthDate,
									decreaseMonth,
									increaseMonth
								}) => (
									<div className='flex items-center justify-between bg-black px-2 py-1'>
										<button
											onClick={decreaseMonth}
											className='rounded p-1 text-white hover:bg-gray-800'
										>
											{'<'}
										</button>
										<span className='text-white'>
											{monthDate.toLocaleString('ru-RU', {
												month: 'long',
												year: 'numeric'
											})}
										</span>
										<button
											onClick={increaseMonth}
											className='rounded p-1 text-white hover:bg-gray-800'
										>
											{'>'}
										</button>
									</div>
								)}
							/>
						</div>
					</div>
					{/* Дата окончания */}
					<div className='flex-1'>
						<Label
							htmlFor='end-date'
							className='mb-1 block text-white'
						>
							До какого числа{' '}
							<span className='text-xs text-gray-400'>
								(необязательное поле)
							</span>
						</Label>
						<DatePicker
							selected={
								localFilters.dateRange[1]
									? new Date(localFilters.dateRange[1])
									: null
							}
							onChange={(date: Date | null) => {
								setLocalFilters(prev => ({
									...prev,
									dateRange: [
										prev.dateRange[0],
										date ? date.toISOString() : null
									]
								}))
							}}
							selectsEnd
							startDate={
								localFilters.dateRange[0]
									? new Date(localFilters.dateRange[0])
									: null
							}
							endDate={
								localFilters.dateRange[1]
									? new Date(localFilters.dateRange[1])
									: null
							}
							minDate={
								localFilters.dateRange[0]
									? new Date(localFilters.dateRange[0])
									: undefined
							}
							showTimeSelect
							timeFormat='HH:mm'
							timeIntervals={15}
							dateFormat='Pp'
							className='w- rounded-md border border-white bg-black p-2 text-white'
							placeholderText='Выберите дату '
							calendarClassName='react-datepicker-dark hide-weekdays only-current-month-days forcells no-outside-days'
							dayClassName={() => 'react-datepicker__day-dark'}
							weekDayClassName={() =>
								'react-datepicker__day-name-dark'
							}
							timeClassName={() => 'react-datepicker__time-dark'}
							popperClassName='react-datepicker-dark-popper'
							renderCustomHeader={({
								monthDate,
								decreaseMonth,
								increaseMonth
							}) => (
								<div className='flex items-center justify-between bg-black px-2 py-1'>
									<button
										onClick={decreaseMonth}
										className='rounded p-1 text-white hover:bg-gray-800'
									>
										{'<'}
									</button>
									<span className='text-white'>
										{monthDate.toLocaleString('ru-RU', {
											month: 'long',
											year: 'numeric'
										})}
									</span>
									<button
										onClick={increaseMonth}
										className='rounded p-1 text-white hover:bg-gray-800'
									>
										{'>'}
									</button>
								</div>
							)}
							// Добавляем этот пропс чтобы скрыть стандартный заголовок
							//   showMonthYearDropdown={false}
							showYearDropdown={false}
						/>
					</div>
					{/* </div> */}
					<div>
						<h4 className='mb-2 mt-4 font-bold text-white'>
							Валюта
						</h4>
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
					<h4 className='mb-2 mt-4 font-bold text-white'>
						Выберите диапазон для определённой валюты
					</h4>
					<div className='mb-2 flex items-center justify-between'>
						<h4 className='text-white'>Малый диапазон цены</h4>
						<span className='text-xs text-gray-400'>
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
						className='bg-primary-700 flex-1 rounded-xl border border-white bg-black text-white hover:bg-white/10'
					>
						Применить
					</Button>
					<Button
						onClick={handleReset}
						variant='outline'
						className='flex-1 rounded-xl border-white text-white hover:bg-white/10'
					>
						Сбросить фильтры
					</Button>
				</div>
			</div>
		</div>
	)
}

export default FiltersFull
