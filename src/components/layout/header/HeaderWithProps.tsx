import { debounce } from 'lodash'
import { Menu, Plus, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/commonApp/button'
import { Input } from '@/components/ui/commonApp/input'

import { FiltersState, setFilters } from '@/store/redux'
import { useAppSelector } from '@/store/redux/redux'

import { HeaderMenu } from './HeaderMenu'
import { cleanParams } from '@/lib/utils'

export function HeaderWithProps({ text }: HeaderProps) {
	const router = useRouter()
	const pathname = usePathname()
	const filters = useAppSelector(state => state.global.filters)

	const updateURL = debounce((newFilters: FiltersState) => {
		const cleanFilters = cleanParams(newFilters)
		const updatedSearchParams = new URLSearchParams()

		Object.entries(cleanFilters).forEach(([key, value]) => {
			updatedSearchParams.set(
				key,
				Array.isArray(value) ? value.join(',') : value.toString()
			)
		})

		localStorage.setItem(
			'filtersState',
			JSON.stringify({
				filters: {
					...newFilters,
					verifiedOnly: newFilters.verifiedOnly.toString()
				}
			})
		)

		router.push(`${pathname}?${updatedSearchParams.toString()}`)
	}, 300)

	const dispatch = useDispatch()
	const [searchInput, setSearchInput] = useState(filters.location)
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

	return (
		<header className='flex h-full items-center justify-between border-b border-white/20 bg-black p-4'>
			{text === 'Мероприятия на карте' || !text ? (
				<div className='mr-1 flex h-[37px] w-[150px] items-center justify-center'>
					<Link href='/search' legacyBehavior>
						<a>
							<Image
								src='/logos/longlogoblwh.png'
								alt='Logo'
								width={150}
								height={37}
								priority
								className='h-full w-full object-contain'
								sizes='150px'
							/>
						</a>
					</Link>
				</div>
			) : (
				<div className='ml-8 mr-1 flex h-[37px] w-[150px] items-center justify-center md:ml-0'>
					<Link href='/search' legacyBehavior>
						<a>
							<Image
								src='/logos/longlogoblwh.png'
								alt='Logo'
								width={150}
								height={37}
								priority
								className='h-full w-full object-contain'
								sizes='150px'
							/>
						</a>
					</Link>
				</div>
			)}

			<div className='flex flex-grow items-center justify-center gap-4 md:ml-[18%]'>
				{text === 'Мероприятия на карте' && (
					<div className='flex items-center xl:hidden'>
						<Input
							placeholder='Город'
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							className='border-primary-400 w-28 rounded-l-xl rounded-r-none border-r-0 text-white sm:w-60'
						/>
						<Button
							onClick={handleLocationSearch}
							className='border-l-none border-primary-400 hover:bg-primary-700 hover:text-primary-50 rounded-l-none rounded-r-xl border shadow-none'
						>
							<Search className='h-4 w-4' />
						</Button>
					</div>
				)}
				<h1 className='hidden text-xl font-semibold text-white xl:block'>
					{text}
				</h1>

				{text === 'Организация мероприятий' && (
					<Link
						href='/dashboard/hosting/create'
						className='flex items-center rounded-full border border-white/20 bg-black px-3 py-1 text-sm font-medium text-white hover:bg-white/10'
					>
						<Plus className='h-4 w-4' />
						Создать&nbsp;
						<span className='hidden md:inline'>мероприятие</span>
					</Link>
				)}
			</div>

			<div className='flex flex-1 justify-end'>
				<HeaderMenu />
			</div>
		</header>
	)
}
