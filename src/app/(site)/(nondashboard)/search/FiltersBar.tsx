'use client'

import { debounce } from 'lodash'
import { Filter, Grid, LayoutDashboard, List, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
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

import { EventTypeIcons, EventTypeLabelsRu } from '@/lib/constants'
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

	// Сохранение состояния открытия/закрытия дополнительных фильтров
	useEffect(() => {
		const savedFiltersState = localStorage.getItem('filtersState')
		if (savedFiltersState) {
			const { isFiltersFullOpen, viewMode } =
				JSON.parse(savedFiltersState)
			dispatch(toggleFiltersFullOpen(isFiltersFullOpen))
			dispatch(setViewMode(viewMode))
		}
	}, [dispatch])

	// Обновление URL
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

	// Сохранение состояния фильтров (открытие/закрытие фильтров и вид)
	const handleToggleFilters = () => {
		const newState = !isFiltersFullOpen
		dispatch(toggleFiltersFullOpen(newState))
		localStorage.setItem(
			'filtersState',
			JSON.stringify({ isFiltersFullOpen: newState, viewMode })
		)
	}

	const handleViewModeChange = (newViewMode: 'grid' | 'list') => {
		dispatch(setViewMode(newViewMode))
		localStorage.setItem(
			'filtersState',
			JSON.stringify({ isFiltersFullOpen, viewMode: newViewMode })
		)
	}
	const handleLocationSearch = async () => {
		try {
			const response = await fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
					searchInput
				)}.json?access_token=${
					process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
				}&fuzzyMatch=true`
			)
			const data = await response.json()
			if (data.features && data.features.length > 0) {
				const [lng, lat] = data.features[0].center
				dispatch(
					setFilters({
						location: searchInput,
						coordinates: [lng, lat]
					})
				)

				updateURL({
					...filters,
					location: searchInput,
					coordinates: [lng, lat]
				})
			}
		} catch (err) {
			console.error('Error search location:', err)
		}
	}
	useEffect(() => {
		setSearchInput(filters.location)
	}, [filters.location])
	return (
		<div className='flex w-full items-center justify-between py-5'>
			{/* Filters */}
			<div className='flex items-center justify-between gap-4 p-2'>
				<Button
					variant='outline'
					className={cn(
						'border-primary-400 hover:bg-primary-500 hover:text-primary-100 gap-2 rounded-xl text-white hover:bg-white/10',
						isFiltersFullOpen && ''
					)}
					onClick={handleToggleFilters}
				>
					<Filter className='h-4 w-4 text-white' />
					{isFiltersFullOpen ? (
						<span>Скрыть фильтры</span>
					) : (
						<span>Больше фильтров</span>
					)}
				</Button>

				{/* Статус и оплата */}
				<div className='flex gap-1'>
					<Select
						value={filters.status}
						onValueChange={value =>
							handleFilterChange('status', value, null)
						}
					>
						<SelectTrigger className='border-primary-400 w-36 rounded-xl text-white'>
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
						<SelectTrigger className='border-primary-400 w-36 rounded-xl text-white'>
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
					<SelectTrigger className='border-primary-400 w-38 rounded-xl text-white'>
						<SelectValue placeholder='Тип мероприятия'>
							{filters.eventType && filters.eventType !== 'any'
								? (EventTypeLabelsRu as any)[filters.eventType] // Костыль для обхода ошибки типов
								: 'Тип мероприятия'}
						</SelectValue>
					</SelectTrigger>
					<SelectContent className='bg-black text-white'>
						<SelectItem value='any'>Любой тип</SelectItem>
						{Object.entries(EventTypeIcons).map(([type, Icon]) => (
							<SelectItem key={type} value={type}>
								<div className='flex items-center'>
									<Icon className='mr-2 h-4 w-4' />
									<span>
										{
											EventTypeLabelsRu[
												type as keyof typeof EventTypeLabelsRu
											]
										}
									</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className='flex items-center'>
					<Input
						placeholder='Город / локация'
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
						className='border-primary-400 w-40 rounded-l-xl rounded-r-none border-r-0 text-white'
					/>
					<Button
						// onClick={() =>
						// 	handleFilterChange('location', searchInput, null)
						// }
						onClick={handleLocationSearch}
						className='border-l-none border-primary-400 hover:bg-primary-700 hover:text-primary-50 rounded-l-none rounded-r-xl border shadow-none'
					>
						<Search className='h-4 w-4' />
					</Button>
				</div>
			</div>

			{/* Переключение видов */}
			<Link href='/dashboard/hosting' className='ml-auto'>
				<Button
					variant='ghost'
					className={cn(
						'textkk-white/60 rounded-xl border px-3 py-1 text-white hover:bg-white/10'
						// viewMode === 'grid' && ' text-white'
					)}

					// onClick={() => handleViewModeChange('grid')}
				>
					<LayoutDashboard className='h-5 w-5' /> Панель управления
				</Button>
			</Link>
			<div className='flex items-center justify-between gap-4 p-2'>
				<div className='flex rounded-xl border'>
					<Button
						variant='ghost'
						className={cn(
							'rounded-none rounded-l-xl px-3 py-1 text-white/60',
							viewMode === 'list' && 'text-white'
						)}
						onClick={() => handleViewModeChange('list')}
					>
						<List className='h-5 w-5' />
					</Button>
					<Button
						variant='ghost'
						className={cn(
							'rounded-none rounded-r-xl px-3 py-1 text-white/60',
							viewMode === 'grid' && 'text-white'
						)}
						onClick={() => handleViewModeChange('grid')}
					>
						<Grid className='h-5 w-5' />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default FiltersBar
