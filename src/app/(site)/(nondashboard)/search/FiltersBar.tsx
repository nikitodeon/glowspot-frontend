'use client'

import { debounce } from 'lodash'
import {
	Filter,
	Grid,
	LayoutDashboard,
	List,
	Search,
	Verified
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
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
import { Switch } from '@/components/ui/commonApp/switch'
import { SwitchThumb } from '@/components/ui/commonApp/switch2'

import {
	FiltersState,
	setFilters,
	setViewMode,
	toggleFiltersFullOpen
} from '@/store/redux'
import { useAppSelector } from '@/store/redux/redux'

import { EventTypeIcons, EventTypeLabelsRu } from '@/lib/constants'
import { cleanParams, cn } from '@/lib/utils'

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
	const [initialLoad, setInitialLoad] = useState(false)

	useEffect(() => {
		const savedState = localStorage.getItem('filtersState')
		if (savedState) {
			const {
				isFiltersFullOpen,
				viewMode,
				filters: savedFilters
			} = JSON.parse(savedState)

			// Явное преобразование verifiedOnly в boolean
			const verifiedOnly =
				typeof savedFilters?.verifiedOnly === 'string'
					? savedFilters.verifiedOnly === 'true'
					: Boolean(savedFilters?.verifiedOnly)

			dispatch(toggleFiltersFullOpen(isFiltersFullOpen))
			dispatch(setViewMode(viewMode))
			dispatch(
				setFilters({
					...filters,
					verifiedOnly
				})
			)
		}
		setInitialLoad(true)
	}, [dispatch])

	const updateURL = debounce((newFilters: FiltersState) => {
		const cleanFilters = cleanParams(newFilters)
		const updatedSearchParams = new URLSearchParams()

		Object.entries(cleanFilters).forEach(([key, value]) => {
			updatedSearchParams.set(
				key,
				Array.isArray(value) ? value.join(',') : value.toString()
			)
		})

		// Сохраняем verifiedOnly как строку для надежности
		localStorage.setItem(
			'filtersState',
			JSON.stringify({
				isFiltersFullOpen,
				viewMode,
				filters: {
					...newFilters,
					verifiedOnly: newFilters.verifiedOnly.toString()
				}
			})
		)

		router.push(`${pathname}?${updatedSearchParams.toString()}`)
	}, 300)

	const handleVerifiedChange = (checked: boolean) => {
		const newFilters = {
			...filters,
			verifiedOnly: checked
		}
		dispatch(setFilters(newFilters))
		updateURL(newFilters)
	}

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
			dispatch(
				setFilters({
					paymentType: 'FREE',
					priceRange: [null, null]
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

	const handleToggleFilters = () => {
		const newState = !isFiltersFullOpen
		dispatch(toggleFiltersFullOpen(newState))
		localStorage.setItem(
			'filtersState',
			JSON.stringify({
				isFiltersFullOpen: newState,
				viewMode,
				filters
			})
		)
	}

	const handleViewModeChange = (newViewMode: 'grid' | 'list') => {
		dispatch(setViewMode(newViewMode))
		localStorage.setItem(
			'filtersState',
			JSON.stringify({
				isFiltersFullOpen,
				viewMode: newViewMode,
				filters
			})
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
				const newFilters = {
					...filters,
					location: searchInput,
					coordinates: [lng, lat] as [number, number]
				}
				dispatch(setFilters(newFilters))
				updateURL(newFilters)
			}
		} catch (err) {
			console.error('Error search location:', err)
		}
	}

	useEffect(() => {
		setSearchInput(filters.location)
	}, [filters.location])

	if (!initialLoad) {
		return null
	}

	return (
		<div className='flex w-full items-center justify-between py-5'>
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
						<span>
							<span className='hidden lg:inline'>
								Больше фильтров
							</span>
							<span className='inline lg:hidden'>Фильтры</span>
						</span>
					)}
				</Button>

				<div className='flex gap-1'>
					<Select
						value={filters.status}
						onValueChange={value =>
							handleFilterChange('status', value, null)
						}
					>
						<SelectTrigger className='border-primary-400 hidden w-36 rounded-xl text-white lg:flex'>
							<SelectValue placeholder='Статус' />
						</SelectTrigger>
						<SelectContent className='bg-black text-white'>
							<SelectItem value='any'>Любой статус</SelectItem>
							<SelectItem value='UPCOMING'>
								Предстоящее
							</SelectItem>
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
						<SelectTrigger className='border-primary-400 hidden w-36 rounded-xl text-white lg:flex'>
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

				<Select
					value={filters.eventType || 'any'}
					onValueChange={value =>
						handleFilterChange('eventType', value, null)
					}
				>
					<SelectTrigger className='border-primary-400 w-38 hidden rounded-xl text-white lg:flex'>
						<SelectValue placeholder='Тип мероприятия'>
							{filters.eventType && filters.eventType !== 'any'
								? (EventTypeLabelsRu as any)[filters.eventType]
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

				<div className='border-primary-400 flex h-9 items-center space-x-2 rounded-xl border px-3 py-1'>
					<Verified className='h-5 w-5 text-white' />
					<Label
						htmlFor='verified-only'
						className='hidden text-white sm:inline'
					>
						Только верифицированные
					</Label>
					<Switch
						id='verified-only'
						checked={filters.verifiedOnly}
						onCheckedChange={handleVerifiedChange}
						className={`border-[1px] ${
							filters.verifiedOnly
								? 'border-white bg-black'
								: 'border-gray-400 bg-white'
						}`}
					>
						<SwitchThumb
							className={`block h-4 w-4 rounded-full ${
								filters.verifiedOnly ? 'bg-white' : 'bg-black'
							}`}
						/>
					</Switch>
				</div>

				<div className='hidden items-center xl:flex'>
					<Input
						placeholder='Город / локация'
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
						className='border-primary-400 w-full rounded-l-xl rounded-r-none border-r-0 text-white'
					/>
					<Button
						onClick={handleLocationSearch}
						className='border-l-none border-primary-400 hover:bg-primary-700 hover:text-primary-50 rounded-l-none rounded-r-xl border shadow-none'
					>
						<Search className='h-4 w-4' />
					</Button>
				</div>
			</div>

			<Link
				href='/dashboard/attending'
				className='ml-auto hidden 2xl:block'
			>
				<Button
					variant='ghost'
					className={cn(
						'textkk-white/60 rounded-xl border px-3 py-1 text-white hover:bg-white/10'
					)}
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
