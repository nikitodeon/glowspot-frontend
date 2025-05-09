'use client'

import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/commonApp/button'
import { Input } from '@/components/ui/commonApp/input'
import BigRotatingLogo from '@/components/ui/elements/BigRotatingLogo'

import { setFilters } from '@/store/redux'

const HeroSection = () => {
	const dispatch = useDispatch()
	const [searchQuery, setSearchQuery] = useState('')
	const router = useRouter()

	const handleLocationSearch = async () => {
		try {
			const trimmedQuery = searchQuery.trim()
			if (!trimmedQuery) return

			const response = await fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
					trimmedQuery
				)}.json?access_token=${
					process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
				}&fuzzyMatch=true`
			)
			const data = await response.json()
			if (data.features && data.features.length > 0) {
				const [lng, lat] = data.features[0].center
				dispatch(
					setFilters({
						location: trimmedQuery,
						coordinates: [lng, lat]
					})
				)
				const params = new URLSearchParams({
					location: trimmedQuery,
					lat: lat.toString(),
					lng: lng.toString()
				})
				router.push(`/search?${params.toString()}`)
			}
		} catch (error) {
			console.error('Error searching location:', error)
		}
	}
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleLocationSearch()
		}
	}
	const searchPlaceholder = (
		<>
			<span className='hidden md:inline'>
				'Ищите мероприятия поблизости – введите ваш город'
			</span>
			<span className='md:hidden'>'Введите ваш город'</span>
		</>
	)

	const [placeholder, setPlaceholder] = useState('Введите ваш город')

	useEffect(() => {
		if (typeof window === 'undefined') return

		const handleResize = debounce(() => {
			setPlaceholder(
				window.innerWidth >= 640
					? 'Ищите мероприятия поблизости – введите ваш город'
					: 'Введите ваш город'
			)
		}, 200)

		// Устанавливаем начальное значение
		handleResize()

		window.addEventListener('resize', handleResize)
		return () => {
			handleResize.cancel()
			window.removeEventListener('resize', handleResize)
		}
	}, [])
	return (
		<div className='relative mt-16 h-screen w-full overflow-hidden'>
			{/* Вращающийся логотип */}
			<div className='zтт-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-y-hidden'>
				<BigRotatingLogo
					backgroundSrc={'sphere2.png'}
					foregroundSrc={''}
				/>
			</div>

			{/* Затемнение фона */}
			<div className='absolute inset-0'></div>

			{/* Основной контент */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className='absolute top-1/3 w-full -translate-x-1/2 -translate-y-1/2 transform text-center'
			>
				<div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
					<h1 className='mb-4 text-4xl font-bold text-white sm:text-5xl'>
						Среди темноты всегда загорается огонёк
						<span className='inline-block h-[1em] w-[1em] align-text-top'>
							<Image
								src='/logos/glow.png'
								alt='✨'
								width={20}
								height={20}
								className='mb-1 inline h-[0.8em] w-[0.6em]'
								style={{
									display: 'inline-block',
									verticalAlign: 'text-bottom' // или 'baseline'
								}}
							/>
						</span>
					</h1>
					<p className='mb-2 text-lg text-white sm:text-xl'>
						Каждое событие – новый огонёк на карте!
					</p>
					<div className='mx-auto mb-3 max-w-[500px] border border-yellow-500 p-1 text-center text-sm text-white sm:p-4'>
						Тестовые события созданы в городах : Минск, Москва
					</div>
					<div className='flex justify-center'>
						<Input
							type='text'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							placeholder={placeholder}
							className='h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white'
							onKeyDown={handleKeyDown}
						/>
						<Button
							onClick={handleLocationSearch}
							className='h-12 rounded-l-none rounded-r-xl border-y border-r border-white bg-transparent text-white hover:bg-white/10'
						>
							Поиск
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	)
}

export default HeroSection
