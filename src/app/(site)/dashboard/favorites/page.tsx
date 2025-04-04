'use client'

import { ApolloCache } from '@apollo/client'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import AttendCard from '@/components/dashboard/AttendCard'
import FavoriteCard from '@/components/dashboard/FavoriteCard'
import HostCard from '@/components/dashboard/HostCard'

import {
	GetEventsWhereIParticipateDocument,
	GetFavoriteEventsDocument,
	GetMyOrganizedEventsDocument,
	useAddToFavoritesMutation,
	useGetEventsWhereIParticipateQuery,
	useGetFavoriteEventsQuery,
	useRemoveFromFavoritesMutation
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

const FavoriteEvents = () => {
	const { user } = useCurrent()
	const userId = user?.id

	const { data, loading: isLoading } = useGetFavoriteEventsQuery({
		fetchPolicy: 'cache-and-network',
		nextFetchPolicy: 'cache-first'
	})
	const updateBothCaches = (
		cache: ApolloCache<any>,
		eventId: string,
		isFavorite: boolean
	) => {
		// Обновляем кэш для мероприятий, в которых я участвую
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

	if (isLoading) return <div className='px-8 pb-5 pt-8'>Загрузка...</div>

	if (!userId) {
		return (
			<div className='px-8 pb-5 pt-8'>
				Войдите, чтобы просмотреть мероприятия
			</div>
		)
	}

	const favoriteEvents = data?.getFavoriteEvents || []

	return (
		<div className='px-8 pb-5 pt-8'>
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{favoriteEvents?.map(event => {
					const isFavorite =
						event.favoritedBy?.some(u => u.id === userId) ?? false
					return (
						<FavoriteCard
							key={event.id}
							userId={userId}
							event={event}
							isFavorite={isFavorite}
							onFavoriteToggle={() =>
								handleFavoriteToggle(event.id, isFavorite)
							}
							propertyLink={`/dashboard/favorites/${event.id}`}
						/>
					)
				})}

				<div className='mb-5 w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-black shadow-lg transition-transform hover:scale-[1.02]'>
					<Link
						href='/dashboard/participating/create'
						className='flex h-full flex-col'
					>
						<div className='relative h-48 w-full bg-black'>
							<div className='flex h-full items-center justify-center'>
								<Search className='h-16 w-16 text-white opacity-90' />
							</div>
						</div>
						<div className='p-4'>
							<h2 className='mb-1 text-xl font-bold text-white hover:underline'>
								Найти мероприятия на карте
							</h2>
							{/* <p className='mb-2 line-clamp-1 text-gray-600'>
								Присоединяйтесь к новому мероприятию
							</p> */}
						</div>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default FavoriteEvents
