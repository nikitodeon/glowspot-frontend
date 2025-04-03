'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import AttendCard from '@/components/dashboard/AttendCard'

import { useGetEventsWhereIParticipateQuery } from '@/graphql/generated/output'
import {
	useAddToFavoritesMutation,
	useRemoveFromFavoritesMutation
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

const Events = () => {
	const { user } = useCurrent()
	const userId = user?.id

	const {
		data,
		loading: isLoading,
		refetch
	} = useGetEventsWhereIParticipateQuery()

	const myEvents = data?.getEventsWhereIParticipate || []

	// Запрос на получение лайков
	const { data: favoriteData, refetch: refetchFavorites } = useQuery({
		queryKey: ['FAVORITES', userId],
		queryFn: async () => {
			if (!userId) return {}
			const eventsMap: Record<string, boolean> = {}
			myEvents.forEach(event => {
				const favoritedBy = event.favoritedBy || []
				eventsMap[event.id] = favoritedBy.some(
					user => user.id === userId
				)
			})
			return eventsMap
		},
		enabled: !!userId && myEvents.length > 0
	})

	// Используем хук внутри компонента
	const [addToFavorites] = useAddToFavoritesMutation()
	const [removeFromFavorites] = useRemoveFromFavoritesMutation()

	// Мутации для добавления и удаления лайков
	const addToFavoritesHandler = (eventId: string) => {
		addToFavorites({ variables: { eventId } }) // Correctly use the variables object
			.then(() => refetchFavorites())
			.catch(error => console.error('Error adding to favorites:', error))
	}

	const removeFromFavoritesHandler = (eventId: string) => {
		removeFromFavorites({ variables: { eventId } }) // Correctly use the variables object
			.then(() => refetchFavorites())
			.catch(error =>
				console.error('Error removing from favorites:', error)
			)
	}
	// Обработчик лайков
	const handleFavoriteToggle = async (eventId: string) => {
		try {
			const isCurrentlyFavorite = favoriteData?.[eventId] || false
			if (isCurrentlyFavorite) {
				await removeFromFavoritesHandler(eventId)
			} else {
				await addToFavoritesHandler(eventId)
			}
			await refetch() // Обновляем список событий
		} catch (error: any) {
			console.error('Error toggling favorite:', error.message || error)
		}
	}

	if (isLoading) {
		return <div className='px-8 pb-5 pt-8'>Loading...</div>
	}

	if (!userId) {
		return (
			<div className='px-8 pb-5 pt-8'>
				Please log in to view your events
			</div>
		)
	}
	return (
		<div className='px-8 pb-5 pt-8'>
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{myEvents.map(event => (
					<AttendCard
						key={event.id}
						event={event}
						isFavorite={favoriteData?.[event.id] || false}
						onFavoriteToggle={() => handleFavoriteToggle(event.id)}
						showFavoriteButton={true}
						propertyLink={`/dashboard/attending/${event.id}`}
					/>
				))}

				<div className='mb-5 w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-black shadow-lg transition-transform hover:scale-[1.02]'>
					<Link
						href='/dashboard/events/search'
						className='flex h-full flex-col'
					>
						<div className='relative h-48 w-full bg-black'>
							<div className='flex h-full items-center justify-center'>
								<Search className='h-16 w-16 text-white opacity-70' />
							</div>
						</div>

						<div className='p-4'>
							<h2 className='mb-1 text-xl font-bold text-white hover:underline'>
								Найти мероприятия на карте
							</h2>

							<p className='mb-2 text-gray-600'>
								Найдите новые интересные мероприятия
							</p>
						</div>
					</Link>
				</div>
			</div>

			{/* {(!myEvents || myEvents.length === 0) && (
				<p>You don&lsquo;t manage any properties</p>
			)} */}
		</div>
	)
}

export default Events
