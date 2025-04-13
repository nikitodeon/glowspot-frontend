'use client'

import { ApolloCache } from '@apollo/client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
	EventStatus,
	EventType,
	GetFilteredEventsDocument,
	PaymentType,
	useAddToFavoritesMutation,
	useGetFilteredEventsQuery,
	useRemoveFromFavoritesMutation
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { useAppSelector } from '@/store/redux/redux'

import CardCompact from './CardCompact'
import GridCard from './GridCard'

const Listings = () => {
	const { user } = useCurrent()
	const userId = user?.id
	const [localFavorites, setLocalFavorites] = useState<
		Record<string, boolean>
	>({})

	const filters = useAppSelector(state => state.global.filters)
	const viewMode = useAppSelector(state => state.global.viewMode)

	// const startRaw = filters.dateRange?.[0]
	// const endRaw = filters.dateRange?.[1]

	// let end: string | null = null
	// if (endRaw) {
	// 	const endDate = new Date(endRaw)
	// 	endDate.setHours(23, 59, 59, 999)
	// 	end = endDate.toISOString()
	// }

	// const dateRange: [string | null, string | null] | undefined =
	// 	startRaw || end ? [startRaw || null, end] : undefined

	console.log('GraphQL dateRange filter being sent:', filters.dateRange)
	function isValidDate(date: Date): boolean {
		return !isNaN(date.getTime())
	}
	const queryVariables = {
		filter: {
			location: filters.location !== 'any' ? filters.location : undefined,
			status:
				filters.status !== 'any'
					? (filters.status as EventStatus)
					: undefined,
			paymentType:
				filters.paymentType !== 'any'
					? (filters.paymentType as PaymentType)
					: undefined,
			eventType:
				filters.eventType && filters.eventType !== 'any'
					? (filters.eventType as unknown as EventType)
					: undefined,
			priceRange: filters.priceRange.every(v => v === null)
				? undefined
				: filters.priceRange.filter((v): v is number => v !== null),
			currency: filters.currency !== 'any' ? filters.currency : undefined,
			verifiedOnly: filters.verifiedOnly ? true : false, // Добавляем фильтр верификации
			dateRange:
				filters.dateRange &&
				(filters.dateRange[0] || filters.dateRange[1])
					? [
							filters.dateRange[0] &&
							isValidDate(new Date(filters.dateRange[0]))
								? new Date(filters.dateRange[0]).toISOString()
								: null,
							filters.dateRange[1] &&
							isValidDate(new Date(filters.dateRange[1]))
								? new Date(filters.dateRange[1]).toISOString()
								: null
						]
					: undefined
		}
	}

	console.log('[GraphQL] Sending filter:', queryVariables.filter)

	const {
		data,
		loading: isLoading,
		error: isError
	} = useGetFilteredEventsQuery({
		variables: queryVariables
	})

	const events = data?.getAllEvents || []
	useEffect(() => {
		console.log('Query results:', {
			data: events
			//   loading,
		})
	}, [data])
	const updateCache = (
		cache: ApolloCache<any>,
		eventId: string,
		isFavorite: boolean
	) => {
		cache.updateQuery(
			{ query: GetFilteredEventsDocument, variables: queryVariables },
			oldData => {
				if (!oldData?.getFilteredEvents) return oldData

				return {
					getFilteredEvents: oldData.getFilteredEvents.map(
						(event: any) => {
							if (event.id === eventId) {
								return {
									...event,
									favoritedBy: isFavorite
										? [
												...(event.favoritedBy || []),
												{
													__typename: 'User',
													id: userId
												}
											]
										: event.favoritedBy?.filter(
												(user: any) =>
													user.id !== userId
											) || []
								}
							}
							return event
						}
					)
				}
			}
		)
	}

	const [addToFavorites] = useAddToFavoritesMutation({
		onCompleted: () => toast.success('Добавлено в избранное'),
		onError: err => {
			toast.error('Ошибка при добавлении в избранное')
			console.error(err)
		},
		update: (cache, result, context) => {
			const eventId = context.variables?.eventId
			if (!eventId || !userId) return
			updateCache(cache, eventId, true)
		}
	})

	const [removeFromFavorites] = useRemoveFromFavoritesMutation({
		onCompleted: () => toast.success('Удалено из избранного'),
		onError: err => {
			toast.error('Ошибка при удалении из избранного')
			console.error(err)
		},
		update: (cache, result, context) => {
			const eventId = context.variables?.eventId
			if (!eventId || !userId) return
			updateCache(cache, eventId, false)
		}
	})

	const handleFavoriteToggle = async (
		eventId: string,
		isCurrentlyFavorite: boolean
	) => {
		// Оптимистичное обновление UI
		setLocalFavorites(prev => ({
			...prev,
			[eventId]: !isCurrentlyFavorite
		}))

		try {
			if (isCurrentlyFavorite) {
				await removeFromFavorites({ variables: { eventId } })
			} else {
				await addToFavorites({ variables: { eventId } })
			}
		} catch (error) {
			// Откат при ошибке
			setLocalFavorites(prev => ({
				...prev,
				[eventId]: isCurrentlyFavorite
			}))
			toast.error('Произошла ошибка')
		}
	}

	if (isLoading) return <>Загрузка...</>

	if (isError || !events)
		return <div className='text-white'>Не удалось получить события</div>
	// if (events.length === 0)
	// 	return <div className='text-white'>Не удалось получить события</div>
	return (
		<div className='w-full'>
			<h3 className='px-4 text-sm font-bold'>
				<span className='text-gray-700dd font-normal text-white'>
					Найдено {events.length}{' '}
				</span>
				<span className='text-gray-700dd font-normal text-white'>
					{events.length === 0
						? 'мероприятий'
						: `мероприятий${events.length === 1 ? 'е' : ''}`}{' '}
					{filters.location !== 'any' ? `в ${filters.location}` : ''}
				</span>
			</h3>

			{events.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-12'>
					<div className='mb-6 h-[250px] w-[250px] overflow-hidden rounded-full bg-white'>
						<Image
							src='/logos/glownotfound.png'
							alt='No events found'
							width={250}
							height={250}
							className='h-full w-full scale-90 object-contain'
						/>
					</div>
					<p className='text-gray-700dd text-lg font-medium text-white'>
						По вашему запросу найдено 0 мероприятий
					</p>
					<p className='text-gray-500'>
						Попробуйте изменить параметры фильтрации
					</p>
				</div>
			) : (
				<div className='flex'>
					<div className='w-full p-4'>
						{events.map((event: any) => {
							const isFavorite =
								localFavorites[event.id] ??
								event.favoritedBy?.some(
									(u: any) => u.id === userId
								) ??
								false
							const Card =
								viewMode === 'grid' ? GridCard : CardCompact
							return (
								<Card
									key={event.id}
									event={event}
									isFavorite={isFavorite}
									onFavoriteToggle={() =>
										handleFavoriteToggle(
											event.id,
											isFavorite
										)
									}
									propertyLink={`/search/event/${event.id}`}
								/>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

export default Listings
