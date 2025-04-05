'use client'

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

const bynPrices = [0, 15, 30, 50, 70, 100, 150]

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
	}, 300)

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
		} else if (key === 'paymentType' && value === 'FREE') {
			// Сбрасываем ценовой диапазон для бесплатных мероприятий, но не фильтруем по цене
			dispatch(
				setFilters({
					paymentType: 'FREE',
					priceRange: [null, null] // Убираем ценовые ограничения
				})
			)
			return
		} else {
			newValue = value === 'any' ? 'any' : value
		}

		const newFilters = { ...filters, [key]: newValue }
		dispatch(setFilters(newFilters))
		updateURL(newFilters)
	}

	return (
		<div className='flex w-full items-center justify-between py-5'>
			{/* Filters */}
			<div className='flex items-center justify-between gap-4 p-2'>
				<Button
					variant='outline'
					className={cn(
						'border-primary-400 hover:bg-primary-500 hover:text-primary-100 gap-2 rounded-xl text-white',
						isFiltersFullOpen && 'bg-primary-700 text-primary-100'
					)}
					onClick={() => dispatch(toggleFiltersFullOpen())}
				>
					<Filter className='h-4 w-4 text-white' />
					<span>Все фильтры</span>
				</Button>

				<div className='flex items-center'>
					<Input
						placeholder='Город / локация'
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
						className='border-primary-400 w-40 rounded-l-xl rounded-r-none border-r-0 text-white'
					/>
					<Button
						onClick={() =>
							handleFilterChange('location', searchInput, null)
						}
						className='border-l-none border-primary-400 hover:bg-primary-700 hover:text-primary-50 rounded-l-none rounded-r-xl border shadow-none'
					>
						<Search className='h-4 w-4' />
					</Button>
				</div>

				{/* Ценовой фильтр */}
				<div className='flex gap-1'>
					<Select
						value={filters.priceRange[0]?.toString() || 'any'}
						onValueChange={value =>
							handleFilterChange('priceRange', value, true)
						}
					>
						<SelectTrigger className='border-primary-400 w-24 rounded-xl text-white'>
							<SelectValue>
								{filters.priceRange[0] != null
									? `от ${filters.priceRange[0]} BYN`
									: 'Мин. цена'}
							</SelectValue>
						</SelectTrigger>
						<SelectContent className='bg-black text-white'>
							<SelectItem value='any'>Любая</SelectItem>
							{bynPrices.map(price => (
								<SelectItem
									key={price}
									value={price.toString()}
								>
									от {price} BYN
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={filters.priceRange[1]?.toString() || 'any'}
						onValueChange={value =>
							handleFilterChange('priceRange', value, false)
						}
					>
						<SelectTrigger className='border-primary-400 w-24 rounded-xl text-white'>
							<SelectValue>
								{filters.priceRange[1] != null
									? `до ${filters.priceRange[1]} BYN`
									: 'Макс. цена'}
							</SelectValue>
						</SelectTrigger>
						<SelectContent className='bg-black text-white'>
							<SelectItem value='any'>Любая</SelectItem>
							{bynPrices.map(price => (
								<SelectItem
									key={price}
									value={price.toString()}
								>
									до {price} BYN
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Статус и оплата */}
				<div className='flex gap-1'>
					<Select
						value={filters.status}
						onValueChange={value =>
							handleFilterChange('status', value, null)
						}
					>
						<SelectTrigger className='border-primary-400 w-28 rounded-xl text-white'>
							<SelectValue placeholder='Статус' />
						</SelectTrigger>
						<SelectContent className='bg-black text-white'>
							<SelectItem value='any'>Любой статус</SelectItem>
							<SelectItem value='UPCOMING'>Будет</SelectItem>
							<SelectItem value='ONGOING'>В процессе</SelectItem>
							<SelectItem value='COMPLETED'>Завершено</SelectItem>
							<SelectItem value='CANCELLED'>Отменено</SelectItem>
							<SelectItem value='ARCHIVED'>Архив</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={filters.paymentType}
						onValueChange={value =>
							handleFilterChange('paymentType', value, null)
						}
					>
						<SelectTrigger className='border-primary-400 w-28 rounded-xl text-white'>
							<SelectValue placeholder='Оплата' />
						</SelectTrigger>
						<SelectContent className='bg-black text-white'>
							<SelectItem value='any'>Любая оплата</SelectItem>
							<SelectItem value='FREE'>Бесплатно</SelectItem>
							<SelectItem value='PAYMENT_REQUIRED'>
								Платно
							</SelectItem>
							<SelectItem value='DONATION'>По желанию</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Тип мероприятия */}
				<Select
					value={filters.eventType || 'any'}
					onValueChange={value =>
						handleFilterChange('eventType', value, null)
					}
				>
					<SelectTrigger className='border-primary-400 w-32 rounded-xl text-white'>
						<SelectValue placeholder='Тип мероприятия' />
					</SelectTrigger>
					<SelectContent className='bg-black text-white'>
						<SelectItem value='any'>Любой тип</SelectItem>
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

			{/* Переключение видов */}
			<div className='flex items-center justify-between gap-4 p-2'>
				<div className='flex rounded-xl border'>
					<Button
						variant='ghost'
						className={cn(
							'hover:bg-primary-600 hover:text-primary-50 rounded-none rounded-l-xl px-3 py-1 text-white',
							viewMode === 'list' &&
								'bg-primary-700 text-primary-50'
						)}
						onClick={() => dispatch(setViewMode('list'))}
					>
						<List className='h-5 w-5' />
					</Button>
					<Button
						variant='ghost'
						className={cn(
							'hover:bg-primary-600 hover:text-primary-50 rounded-none rounded-r-xl px-3 py-1 text-white',
							viewMode === 'grid' &&
								'bg-primary-700 text-primary-50'
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
