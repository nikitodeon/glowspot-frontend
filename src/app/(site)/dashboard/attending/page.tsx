'use client'

import { ApolloCache } from '@apollo/client'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import AttendCard from '@/components/dashboard/AttendCard'

import {
	GetEventsWhereIParticipateDocument,
	GetFavoriteEventsDocument,
	GetMyOrganizedEventsDocument,
	useAddToFavoritesMutation,
	useGetEventsWhereIParticipateQuery,
	useLeaveEventMutation,
	useParticipateInEventMutation,
	useRemoveFromFavoritesMutation
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

const ParticipatingEvents = () => {
	const { user } = useCurrent()
	const userId = user?.id

	const [isJoining, setIsJoining] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)
	const { data, loading: isLoading } = useGetEventsWhereIParticipateQuery({
		fetchPolicy: 'cache-and-network',
		nextFetchPolicy: 'cache-first'
	})

	const [participateInEvent] = useParticipateInEventMutation()
	const [leaveEvent] = useLeaveEventMutation()

	const updateFavoriteCaches = (
		cache: ApolloCache<any>,
		eventId: string,
		isFavorite: boolean
	) => {
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

	const updateParticipationCaches = (
		cache: ApolloCache<any>,
		eventId: string,
		isParticipating: boolean,
		currentUser: {
			id: string
			username: string
			displayName: string
			avatar: string
		}
	) => {
		cache.updateQuery(
			{ query: GetEventsWhereIParticipateDocument },
			oldData => {
				if (!oldData?.getEventsWhereIParticipate) return oldData

				return {
					getEventsWhereIParticipate: isParticipating
						? [
								...oldData.getEventsWhereIParticipate,
								{ __typename: 'Event', id: eventId }
							]
						: oldData.getEventsWhereIParticipate.filter(
								(event: any) => event.id !== eventId
							)
				}
			}
		)

		const updateParticipants = (event: any) => {
			const userObj = {
				__typename: 'User',
				id: currentUser.id,
				username: currentUser.username,
				displayName: currentUser.displayName,
				avatar: currentUser.avatar
			}

			return {
				...event,
				participants: isParticipating
					? [...(event.participants || []), userObj]
					: event.participants?.filter(
							(user: any) => user.id !== currentUser.id
						) || []
			}
		}

		cache.updateQuery({ query: GetFavoriteEventsDocument }, oldData => {
			if (!oldData?.getFavoriteEvents) return oldData

			return {
				getFavoriteEvents: oldData.getFavoriteEvents.map(
					(event: any) => {
						if (event.id === eventId) {
							return updateParticipants(event)
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
							return updateParticipants(event)
						}
						return event
					}
				)
			}
		})
	}

	const handleJoin = async (eventId: string) => {
		setIsJoining(true)
		try {
			await participateInEvent({
				variables: { eventId },
				update: cache => {
					if (!userId || !user) return

					updateParticipationCaches(cache, eventId, true, {
						id: user.id,
						username: user.username,
						displayName: user.displayName,
						avatar: user.avatar || ''
					})
				}
			})
			toast.success('Вы присоединились к мероприятию')
		} catch (err) {
			console.error('Error joining event:', err)
			toast.error('Ошибка при присоединении к мероприятию')
		} finally {
			setIsJoining(false)
		}
	}

	const handleLeave = async (eventId: string) => {
		setIsLeaving(true)
		try {
			await leaveEvent({
				variables: { eventId },
				update: cache => {
					if (!userId || !user) return

					updateParticipationCaches(cache, eventId, false, {
						id: user.id,
						username: user.username,
						displayName: user.displayName,
						avatar: user.avatar || ''
					})
				}
			})
			toast.success('Вы покинули мероприятие')
		} catch (err) {
			console.error('Error leaving event:', err)
			toast.error('Ошибка при выходе из мероприятия')
		} finally {
			setIsLeaving(false)
		}
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
			updateFavoriteCaches(cache, eventId, true)
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
			updateFavoriteCaches(cache, eventId, false)
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

	const handleParticipationToggle = async (
		eventId: string,
		isCurrentlyParticipating: boolean
	) => {
		if (isCurrentlyParticipating) {
			await handleLeave(eventId)
		} else {
			await handleJoin(eventId)
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

	const participatingEvents = data?.getEventsWhereIParticipate

	return (
		<div className='px-8 pb-5 pt-8'>
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{participatingEvents?.map(event => {
					const isFavorite =
						event.favoritedBy?.some(u => u.id === userId) ?? false
					const isParticipating =
						event.participants?.some(u => u.id === userId) ?? false

					return (
						<AttendCard
							key={event.id}
							userId={userId}
							event={event}
							isFavorite={isFavorite}
							onFavoriteToggle={() =>
								handleFavoriteToggle(event.id, isFavorite)
							}
							isParticipating={isParticipating}
							onParticipationToggle={() =>
								handleParticipationToggle(
									event.id,
									isParticipating
								)
							}
							propertyLink={`/dashboard/attending/${event.id}`}
						/>
					)
				})}

				<div className='mb-5 w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-black shadow-lg transition-transform hover:scale-[1.02]'>
					<Link href='/search' className='flex h-full flex-col'>
						<div className='relative h-48 w-full bg-black'>
							<div className='flex h-full items-center justify-center'>
								<Search className='h-16 w-16 text-white opacity-90' />
							</div>
						</div>
						<div className='p-4'>
							<h2 className='mb-1 text-xl font-bold text-white hover:underline'>
								Найти мероприятия на карте
							</h2>
						</div>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default ParticipatingEvents
