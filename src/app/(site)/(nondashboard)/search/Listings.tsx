'use client'

import { ApolloCache } from '@apollo/client'
import React from 'react'
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

	// console.log('✅ Отправляемый dateRange:', dateRange)
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
			currency: filters.currency !== 'any' ? filters.currency : undefined, // Добавляем новое поле

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
	console.log(
		'[GraphQL] Sending filter.dateRange:',
		queryVariables.filter.dateRange
	)

	const {
		data,
		loading: isLoading,
		error: isError
	} = useGetFilteredEventsQuery({
		variables: queryVariables
	})

	const events = data?.getAllEvents || []

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
		if (isCurrentlyFavorite) {
			await removeFromFavorites({ variables: { eventId } })
		} else {
			await addToFavorites({ variables: { eventId } })
		}
	}

	if (isLoading) return <>Загрузка...</>
	if (isError || !events) return <div>Не удалось получить события</div>

	return (
		<div className='w-full'>
			<h3 className='px-4 text-sm font-bold'>
				{events.length}{' '}
				<span className='font-normal text-gray-700'>
					мероприятий в {filters.location}
				</span>
			</h3>
			<div className='flex'>
				<div className='w-full p-4'>
					{events.map((event: any) => {
						const isFavorite =
							event.favoritedBy?.some(
								(u: any) => u.id === userId
							) ?? false
						const Card =
							viewMode === 'grid' ? GridCard : CardCompact
						return (
							<Card
								key={event.id}
								event={event}
								isFavorite={isFavorite}
								onFavoriteToggle={() =>
									handleFavoriteToggle(event.id, isFavorite)
								}
								propertyLink={`/search?modalEventId=${event.id}`}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Listings
