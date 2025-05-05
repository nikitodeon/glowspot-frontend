'use client'

import { ApolloCache } from '@apollo/client'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import HostCard from '@/components/dashboard/HostCard'
import LoadingCards from '@/components/dashboard/LoadingCards'

import {
	GetEventsWhereIParticipateDocument,
	GetFavoriteEventsDocument,
	GetMyOrganizedEventsDocument,
	useAddToFavoritesMutation,
	useGetMyOrganizedEventsQuery,
	useRemoveFromFavoritesMutation
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

const Events = () => {
	const { user } = useCurrent()
	const userId = user?.id

	const { data, loading: isLoading } = useGetMyOrganizedEventsQuery()

	const updateBothCaches = (
		cache: ApolloCache<any>,
		eventId: string,
		isFavorite: boolean
	) => {
		// Обновляем кэш для организованных мероприятий
		cache.updateQuery({ query: GetMyOrganizedEventsDocument }, oldData => {
			if (!oldData?.getMyOrganizedEvents) return oldData

			return {
				getMyOrganizedEvents: oldData.getMyOrganizedEvents.map(
					(event: any) => {
						if (event.id === eventId) {
							return {
								...event,
								favoritedBy: isFavorite
									? [
											...(event.favoritedBy || []),
											{ __typename: 'User', id: userId }
										]
									: event.favoritedBy?.filter(
											(user: any) => user.id !== userId
										) || []
							}
						}
						return event
					}
				)
			}
		})

		// Обновляем кэш для посещаемых мероприятий
		cache.updateQuery(
			{ query: GetEventsWhereIParticipateDocument },
			oldData => {
				if (!oldData?.getEventsWhereIParticipate) return oldData

				return {
					getEventsWhereIParticipate:
						oldData.getEventsWhereIParticipate.map((event: any) => {
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
						})
				}
			}
		)
		cache.updateQuery({ query: GetFavoriteEventsDocument }, oldData => {
			if (!oldData?.getFavoriteEvents) return oldData

			return {
				getFavoriteEvents: oldData.getFavoriteEvents.map(
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
											(user: any) => user.id !== userId
										) || []
							}
						}
						return event
					}
				)
			}
		})
	}

	// Mutation для добавления в избранное
	const [addToFavorites] = useAddToFavoritesMutation({
		onCompleted: () => toast.success('Добавлено в избранное'),
		onError: err => {
			toast.error('Ошибка при добавлении в избранное')
			console.error(err)
		},
		update: (cache, result, context) => {
			const eventId = context.variables?.eventId
			if (!eventId || !userId) return
			updateBothCaches(cache, eventId, true)
		}
	})

	// Mutation для удаления из избранного
	const [removeFromFavorites] = useRemoveFromFavoritesMutation({
		onCompleted: () => toast.success('Удалено из избранного'),
		onError: err => {
			toast.error('Ошибка при удалении из избранного')
			console.error(err)
		},
		update: (cache, result, context) => {
			const eventId = context.variables?.eventId
			if (!eventId || !userId) return
			updateBothCaches(cache, eventId, false)
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

	if (isLoading) return <LoadingCards />

	if (!userId) {
		return (
			<div className='px-8 pb-5 pt-8'>
				Войдите, чтобы просмотреть мероприятия
			</div>
		)
	}

	const myEvents = data?.getMyOrganizedEvents

	return (
		<div className='px-8 pb-5 pt-8'>
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{myEvents?.map(event => {
					const isFavorite =
						event.favoritedBy?.some(u => u.id === userId) ?? false
					return (
						<HostCard
							key={event.id}
							event={event}
							isFavorite={isFavorite}
							onFavoriteToggle={() =>
								handleFavoriteToggle(event.id, isFavorite)
							}
							propertyLink={`/dashboard/hosting/${event.id}`}
						/>
					)
				})}

				<div className='mb-5 h-[360px] w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-black shadow-lg transition-transform hover:scale-[1.02]'>
					<Link
						href='/dashboard/hosting/create'
						className='flex h-full flex-col'
					>
						<div className='relative h-48 w-full bg-black'>
							<div className='flex h-full items-center justify-center'>
								<Plus className='h-16 w-16 text-white opacity-70' />
							</div>
						</div>
						<div className='p-4'>
							<h2 className='mb-1 text-xl font-bold text-white hover:underline'>
								Создать мероприятие
							</h2>
						</div>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Events
