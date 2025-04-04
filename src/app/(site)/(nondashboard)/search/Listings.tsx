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
				filters.eventType !== 'any'
					? (filters.eventType as EventType)
					: undefined,
			priceRange: filters.priceRange.every(v => v === null)
				? undefined
				: filters.priceRange.filter((v): v is number => v !== null)
		}
	}

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
								propertyLink={`/dashboard/attending/${event.id}`}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Listings
