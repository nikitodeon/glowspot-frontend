'use client'

import { ApolloCache, gql } from '@apollo/client'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import AttendCard from '@/components/dashboard/AttendCard'
import FavoriteCard from '@/components/dashboard/FavoriteCard'
import HostCard from '@/components/dashboard/HostCard'

// import Event from'@/graphql/generated/output'
import {
	GetEventsWhereIParticipateDocument,
	GetFavoriteEventsDocument,
	GetFilteredEventsDocument,
	GetMyOrganizedEventsDocument,
	useAddToFavoritesMutation,
	useDeleteEventMutation,
	useGetEventsWhereIParticipateQuery,
	useGetFavoriteEventsQuery,
	useLeaveEventMutation,
	useParticipateInEventMutation,
	useRemoveFromFavoritesMutation
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

const FavoriteEvents = () => {
	const { user } = useCurrent()
	const userId = user?.id

	const [openLeaveDialog, setOpenLeaveDialog] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isJoining, setIsJoining] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)
	const { data, loading: isLoading } = useGetFavoriteEventsQuery({
		fetchPolicy: 'cache-and-network',
		nextFetchPolicy: 'cache-first'
	})
	const favoriteEvents = data?.getFavoriteEvents || []
	const [deleteEvent] = useDeleteEventMutation({
		refetchQueries: [{ query: GetFavoriteEventsDocument }]
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

	// const updateParticipationCaches = (
	// 	cache: ApolloCache<any>,
	// 	eventId: string,
	// 	isParticipating: boolean,
	// 	currentUser: {
	// 		id: string
	// 		username: string
	// 		displayName: string
	// 		avatar: string
	// 	}
	// ) => {
	// 	cache.updateQuery(
	// 		{ query: GetEventsWhereIParticipateDocument },
	// 		oldData => {
	// 			if (!oldData?.getEventsWhereIParticipate) return oldData

	// 			return {
	// 				getEventsWhereIParticipate: isParticipating
	// 					? oldData.getEventsWhereIParticipate.filter(
	// 							(event: any) => event.id !== eventId
	// 						)
	// 					: [
	// 							...oldData.getEventsWhereIParticipate,
	// 							{ __typename: 'Event', id: eventId }
	// 						]
	// 			}
	// 		}
	// 	)

	// Участвует / покинул => меняем participants
	// 	const updateParticipants = (event: any) => {
	// 		const userObj = {
	// 			__typename: 'User',
	// 			id: currentUser.id,
	// 			username: currentUser.username,
	// 			displayName: currentUser.displayName,
	// 			avatar: currentUser.avatar
	// 		}

	// 		return {
	// 			...event,
	// 			participants: isParticipating
	// 				? event.participants?.filter(
	// 						(user: any) => user.id !== currentUser.id
	// 					) || []
	// 				: [...(event.participants || []), userObj]
	// 		}
	// 	}

	// 	// Обновляем список избранного
	// 	cache.updateQuery({ query: GetFavoriteEventsDocument }, oldData => {
	// 		if (!oldData?.getFavoriteEvents) return oldData

	// 		return {
	// 			getFavoriteEvents: oldData.getFavoriteEvents.map(
	// 				(event: any) => {
	// 					if (event.id === eventId) {
	// 						return updateParticipants(event)
	// 					}
	// 					return event
	// 				}
	// 			)
	// 		}
	// 	})

	// 	// Обновляем организованные
	// 	cache.updateQuery({ query: GetMyOrganizedEventsDocument }, oldData => {
	// 		if (!oldData?.getMyOrganizedEvents) return oldData

	// 		return {
	// 			getMyOrganizedEvents: oldData.getMyOrganizedEvents.map(
	// 				(event: any) => {
	// 					if (event.id === eventId) {
	// 						return updateParticipants(event)
	// 					}
	// 					return event
	// 				}
	// 			)
	// 		}
	// 	})
	// }
	// const handleJoin = async (eventId: string) => {
	// 	setIsJoining(true)
	// 	try {
	// 		await participateInEvent({
	// 			variables: { eventId },
	// 			update: cache => {
	// 				if (!userId || !user) return

	// 				updateParticipationCaches(cache, eventId, false, {
	// 					id: user.id,
	// 					username: user.username,
	// 					displayName: user.displayName,
	// 					avatar: user.avatar || ''
	// 				})
	// 			}
	// 		})
	// 		toast.success('Вы присоединились к мероприятию')
	// 	} catch (err) {
	// 		console.error('Error joining event:', err)
	// 		toast.error('Ошибка при присоединении к мероприятию')
	// 	} finally {
	// 		setIsJoining(false)
	// 	}
	// }
	const updateCaches = (
		cache: ApolloCache<any>,
		eventId: string,
		updates: {
			favoritedBy?: any[]
			participants?: any[]
		}
	) => {
		// Обновляем текущее мероприятие
		// cache.updateQuery(
		// 	{
		// 		query: GetEventByIdDocument,
		// 		variables: { getEventByIdId: eventId }
		// 	},
		// 	oldData => {
		// 		if (!oldData?.getEventById) return oldData
		// 		return {
		// 			getEventById: {
		// 				...oldData.getEventById,
		// 				...updates
		// 			}
		// 		}
		// 	}
		// )

		// cache.updateQuery({ query: GetFavoriteEventsDocument }, oldData => {
		// 	if (!oldData?.getFavoriteEvents) return oldData
		// 	return {
		// 		getFavoriteEvents: oldData.getFavoriteEvents.map(
		// 			(event: any) => {
		// 				if (event.id === eventId) {
		// 					return {
		// 						...event,
		// 						...updates
		// 					}
		// 				}
		// 				return event
		// 			}
		// 		)
		// 	}
		// })
		// cache.updateQuery({ query: GetFavoriteEventsDocument }, oldData => {
		// 	if (!oldData?.getFavoriteEvents) return oldData
		// 	return {
		// 		getFavoriteEvents: updates.participants?.some(
		// 			p => p.id === userId
		// 		)
		// 			? [
		// 					...oldData.getFavoriteEvents,
		// 					{ __typename: 'Event', id: eventId }
		// 				]
		// 			: oldData.getFavoriteEvents.filter(
		// 					(e: any) => e.id !== eventId
		// 				)
		// 	}
		// })
		cache.modify({
			fields: {
				getFavoriteEvents(existingEvents = []) {
					const eventRef: any = cache.writeFragment({
						data: { __typename: 'Event', id: eventId },
						fragment: gql`
							fragment NewFavoriteEvent on EventModel {
								id
								__typename
							}
						`
					})

					if (updates.participants?.some(p => p.id === userId)) {
						// Добавляем
						return [...existingEvents, eventRef]
					} else {
						// Удаляем
						return existingEvents.filter(
							(ref: any) =>
								cache.identify(ref) !== cache.identify(eventRef)
						)
					}
				}
			}
		})
		// cache.modify({
		// 	id: cache.identify({ __typename: 'Event', id: eventId }),
		// 	fields: {
		// 		participants() {
		// 			return updates.participants
		// 		}
		// 		//   favoritedBy() {
		// 		// 	return updates.favoritedBy
		// 		//   }
		// 	}
		// })
		// update(cache, { data }) {
		// 	if (!data) return
		// 	const updatedChat = data.changeChatName
		// 	cache.modify({
		// 		id: cache.identify({
		// 			__typename: 'Event',
		// 			id: eventId
		// 		}),
		// 		fields: {
		// 			name() {
		// 				return updatedChat.name
		// 			}
		// 		}
		// 	})
		// }
		// cache.updateQuery(
		// 	{ query: GetEventsWhereIParticipateDocument },
		// 	oldData => {
		// 	  if (!oldData?.getEventsWhereIParticipate) return oldData
		// 	  return {
		// 		getEventsWhereIParticipate: updates.participants?.some(p => p.id === userId)
		// 		  ? [...oldData.getEventsWhereIParticipate, { __typename: 'Event', id: eventId }]
		// 		  : oldData.getEventsWhereIParticipate.filter((e:any) => e.id !== eventId)
		// 	  }
		// 	}
		//   )
	}
	// Mutation для избранного
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
		event: any,
		isCurrentlyParticipating: boolean
	) => {
		const eventId: string = event.id
		if (isCurrentlyParticipating) {
			await leaveEvent({
				variables: { eventId },
				update: cache => {
					if (!userId || !user) return

					const userObj = {
						__typename: 'User',
						id: user.id,
						username: user.username,
						displayName: user.displayName,
						avatar: user.avatar || ''
					}

					updateCaches(cache, eventId, {
						participants: [...(event?.participants || []), userObj]
					})
					// cache.modify({
					// 	fields: {
					// 		getEventsWhereIParticipate(
					// 			existingEventRefs = [],
					// 			{ readField }
					// 		) {
					// 			return existingEventRefs.filter(
					// 				(ref: any) =>
					// 					readField('id', ref) !== eventId
					// 			)
					// 		}
					// 	}
					// })
				}
			})
		} else {
			await participateInEvent({
				variables: { eventId },
				update: cache => {
					if (!userId || !user) return

					const userObj = {
						__typename: 'User',
						id: user.id,
						username: user.username,
						displayName: user.displayName,
						avatar: user.avatar || ''
					}

					updateCaches(cache, eventId, {
						participants: [...(event?.participants || []), userObj]
					})
					// cache.modify({
					// 	fields: {
					// 		getEventsWhereIParticipate(
					// 			existingEventRefs = [],
					// 			{ readField }
					// 		) {
					// 			const newEventRef = cache.writeFragment({
					// 				data: {
					// 					__typename: 'Event',
					// 					id: eventId
					// 				},
					// 				fragment: gql`
					// 					fragment NewParticipatedEvent on EventModel {
					// 						id
					// 					}
					// 				`
					// 			})

					// 			const isAlreadyInList = existingEventRefs.some(
					// 				(ref: any) =>
					// 					readField('id', ref) === eventId
					// 			)

					// 			// Если пользователь присоединяется
					// 			if (!isAlreadyInList) {
					// 				return [...existingEventRefs, newEventRef]
					// 			}

					// 			// Если уже в списке — оставим как есть
					// 			return existingEventRefs
					// 		}
					// 	}
					// })
				}
			})
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

	// const isOrganizer = userId === event.organizer.id
	// const isParticipant = event.participants?.some(p => p.id === userId)

	return (
		<div className='px-8 pb-5 pt-8'>
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{favoriteEvents?.map(event => {
					const isFavorite =
						event.favoritedBy?.some(u => u.id === userId) ?? false
					const isParticipating =
						event.participants?.some(u => u.id === userId) ?? false

					return (
						<FavoriteCard
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
									event,
									isParticipating
								)
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
						</div>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default FavoriteEvents
