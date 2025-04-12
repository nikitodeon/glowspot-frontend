'use client'

import { ApolloCache } from '@apollo/client'
import {
	ArrowRight,
	Heart,
	HeartOff,
	SquarePen,
	Trash2,
	UserMinus,
	UserPlus,
	X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
	Dialog,
	DialogContent,
	DialogOverlay
} from '@/components/ui/commonApp/ModalDialog'
import { Button } from '@/components/ui/commonApp/button'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/commonApp/carousel'

import {
	GetEventByIdDocument,
	GetFilteredEventsDocument,
	useAddToFavoritesMutation,
	useDeleteEventMutation,
	useGetEventByIdQuery,
	useLeaveEventMutation,
	useParticipateInEventMutation,
	useRemoveFromFavoritesMutation
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { getMediaSource } from '@/utils/get-media-source'

import { cn } from '@/lib/utils'

const destructiveButtonClass = cn(
	'bg-transparent text-red-500 border border-red-500/30 hover:bg-red-500/10',
	'hover:text-red-400 focus-visible:ring-red-500 focus-visible:ring-offset-black',
	'transition-colors duration-200'
)

export default function EnhancedEventModal({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const router = useRouter()
	const { user } = useCurrent()
	const userId = user?.id
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [openLeaveDialog, setOpenLeaveDialog] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isJoining, setIsJoining] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	const { data, loading, error } = useGetEventByIdQuery({
		variables: { getEventByIdId: id },
		skip: !isMounted
	})

	const [deleteEvent] = useDeleteEventMutation({
		refetchQueries: [{ query: GetFilteredEventsDocument }]
	})

	const [participateInEvent] = useParticipateInEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const [addToFavorites] = useAddToFavoritesMutation()
	const [removeFromFavorites] = useRemoveFromFavoritesMutation()

	useEffect(() => {
		setIsMounted(true)
		const originalStyle = window.getComputedStyle(document.body).overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = originalStyle
		}
	}, [])

	const handleClose = () => router.back()

	const handleDelete = async () => {
		setIsDeleting(true)
		try {
			await deleteEvent({ variables: { id } })
			router.back()
		} catch (err) {
			console.error('Error deleting event:', err)
			toast.error('Ошибка при удалении мероприятия')
		} finally {
			setIsDeleting(false)
		}
	}

	const updateCaches = (
		cache: ApolloCache<any>,
		eventId: string,
		updates: {
			favoritedBy?: any[]
			participants?: any[]
		}
	) => {
		cache.updateQuery(
			{
				query: GetEventByIdDocument,
				variables: { getEventByIdId: eventId }
			},
			oldData => {
				if (!oldData?.getEventById) return oldData
				return {
					getEventById: {
						...oldData.getEventById,
						...updates
					}
				}
			}
		)

		cache.updateQuery({ query: GetFilteredEventsDocument }, oldData => {
			if (!oldData?.getFilteredEvents) return oldData

			return {
				getFilteredEvents: oldData.getFilteredEvents.map(
					(event: any) => {
						if (event.id === eventId) {
							return {
								...event,
								...updates
							}
						}
						return event
					}
				)
			}
		})
	}

	const handleJoin = async () => {
		setIsJoining(true)
		try {
			await participateInEvent({
				variables: { eventId: id },
				update: cache => {
					if (!userId || !user) return

					const userObj = {
						__typename: 'User',
						id: user.id,
						username: user.username,
						displayName: user.displayName,
						avatar: user.avatar || ''
					}

					updateCaches(cache, id, {
						participants: [...(event?.participants || []), userObj]
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

	const handleLeave = async () => {
		setIsLeaving(true)
		try {
			await leaveEvent({
				variables: { eventId: id },
				update: cache => {
					if (!userId) return

					updateCaches(cache, id, {
						participants:
							event?.participants?.filter(p => p.id !== userId) ||
							[]
					})
				}
			})
			toast.success('Вы покинули мероприятие')
			setOpenLeaveDialog(false)
		} catch (err) {
			console.error('Error leaving event:', err)
			toast.error('Ошибка при выходе из мероприятия')
		} finally {
			setIsLeaving(false)
		}
	}

	const handleFavoriteToggle = async () => {
		if (!event) return

		const isFavorite = event.favoritedBy?.some(user => user.id === userId)
		const userObj = { __typename: 'User', id: userId }

		try {
			if (isFavorite) {
				await removeFromFavorites({
					variables: { eventId: id },
					update: cache => {
						updateCaches(cache, id, {
							favoritedBy:
								event.favoritedBy?.filter(
									fav => fav.id !== userId
								) || []
						})
					}
				})
				toast.success('Удалено из избранного')
			} else {
				await addToFavorites({
					variables: { eventId: id },
					update: cache => {
						updateCaches(cache, id, {
							favoritedBy: [...(event.favoritedBy || []), userObj]
						})
					}
				})
				toast.success('Добавлено в избранное')
			}
		} catch (err) {
			console.error('Error toggling favorite:', err)
			toast.error('Ошибка при обновлении избранного')
		}
	}

	const FormatDateTime = ({ dateString }: { dateString: string }) => {
		const [formattedDate, setFormattedDate] = useState('')

		useEffect(() => {
			const date = new Date(dateString)
			setFormattedDate(
				date.toLocaleString('ru-RU', {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			)
		}, [dateString])

		return <>{formattedDate}</>
	}

	if (!isMounted) return null
	if (loading) return <div className='p-4 text-white'>Loading...</div>
	if (error)
		return <div className='p-4 text-red-500'>Error loading event</div>
	if (!data?.getEventById)
		return <div className='p-4 text-gray-400'>Event not found</div>

	const event = data.getEventById
	const isOrganizer = userId === event.organizer.id
	const isParticipant = event.participants?.some(p => p.id === userId)
	const isFavorite = event.favoritedBy?.some(user => user.id === userId)

	return (
		<Dialog defaultOpen open onOpenChange={handleClose}>
			<DialogOverlay className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
				<DialogContent className='relative z-50 max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-white/10 bg-black p-0 shadow-xl'>
					<button
						onClick={handleClose}
						className='absolute right-4 top-4 z-10 rounded-full p-2 text-white hover:bg-white/10'
					>
						<X className='h-6 w-6 text-gray-400' />
					</button>

					{event.photoUrls && event.photoUrls.length > 0 && (
						<div className='relative h-96 w-full overflow-hidden rounded-t-lg'>
							<Carousel className='h-full w-full'>
								<CarouselContent className='h-full'>
									{event.photoUrls.map(item => (
										<CarouselItem
											key={item}
											className='h-full'
										>
											<div className='relative h-full w-full'>
												<Image
													alt='Event Image'
													src={getMediaSource(item)}
													fill
													className='object-cover'
													sizes='(max-width: 768px) 100vw, 33vw'
													priority
												/>
											</div>
										</CarouselItem>
									))}
								</CarouselContent>
								{event.photoUrls.length > 1 && (
									<>
										<CarouselPrevious className='left-2 bg-black/50 text-white hover:bg-black/70' />
										<CarouselNext className='right-2 bg-black/50 text-white hover:bg-black/70' />
									</>
								)}
							</Carousel>
						</div>
					)}

					<div className='mb-4 max-h-[80vh] p-6'>
						<div className='flex items-start justify-between'>
							<div>
								<h2 className='text-2xl font-bold text-white'>
									{event.title}
								</h2>
								<p className='text-gray-400'>
									<FormatDateTime
										dateString={event.startTime}
									/>
									{event.endTime && (
										<>
											{' '}
											-{' '}
											<FormatDateTime
												dateString={event.endTime}
											/>
										</>
									)}
								</p>
							</div>
							{event.isVerified && (
								<span className='rounded-full border border-blue-400/30 bg-blue-400/10 px-2 py-1 text-xs text-blue-400'>
									Проверено
								</span>
							)}
						</div>

						<div className='mb-6'>
							<h3 className='mb-2 text-sm font-medium text-gray-400'>
								Местоположение
							</h3>
							<p className='text-white'>
								{event.location.placeName ||
									event.location.address}
								, {event.location.city}
							</p>
						</div>

						{event.description && (
							<div className='mb-6'>
								<h3 className='mb-2 text-sm font-medium text-gray-400'>
									Описание
								</h3>
								<p className='whitespace-pre-line text-gray-300'>
									{event.description}
								</p>
							</div>
						)}

						<div className='mb-6 flex flex-wrap gap-2'>
							{event.tags?.map(tag => (
								<span
									key={tag}
									className='rounded-full border border-white/20 bg-black px-3 py-1 text-sm text-gray-300'
								>
									#{tag}
								</span>
							))}
						</div>

						<div className='flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center'>
							{/* Основные кнопки действий */}
							<div className='flex flex-wrap gap-2'>
								{isOrganizer ? (
									<>
										<Link
											href={`/dashboard/hosting/${event.id}/edit`}
											className='flex-1'
										>
											<Button
												variant='outline'
												className='w-full border-white/20 text-white hover:bg-white/10 sm:w-auto'
											>
												<SquarePen className='h-4 w-4' />
												<span className='ml-2'>
													Редактировать
												</span>
											</Button>
										</Link>
										<Button
											variant='destructive'
											className={cn(
												destructiveButtonClass,
												'flex-1 sm:w-auto'
											)}
											onClick={() =>
												setOpenDeleteDialog(true)
											}
										>
											<Trash2 className='h-4 w-4' />
											<span className='ml-2'>
												Удалить
											</span>
										</Button>
									</>
								) : isParticipant ? (
									<Button
										variant='outline'
										className='flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 sm:w-auto'
										onClick={() => setOpenLeaveDialog(true)}
										disabled={isLeaving}
									>
										<UserMinus className='h-4 w-4' />
										<span className='ml-2'>
											{isLeaving
												? 'Покидаю...'
												: 'Покинуть'}
										</span>
									</Button>
								) : (
									<Button
										variant='default'
										className='flex-1 bg-green-600 text-white hover:bg-green-700 sm:w-auto'
										onClick={handleJoin}
										disabled={isJoining}
									>
										<UserPlus className='h-4 w-4' />
										<span className='ml-2'>
											{isJoining
												? 'Присоединяюсь...'
												: 'Присоединиться'}
										</span>
									</Button>
								)}
							</div>

							{/* Кнопка избранного */}
							<Button
								variant='outline'
								className={`flex-1 border-white/20 text-white hover:bg-white/10 sm:w-auto ${
									isFavorite
										? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
										: ''
								}`}
								onClick={handleFavoriteToggle}
							>
								{isFavorite ? (
									<>
										<HeartOff className='h-4 w-4' />
										<span className='ml-2'>
											Удалить из избранного
										</span>
									</>
								) : (
									<>
										<Heart className='h-4 w-4' />
										<span className='ml-2'>
											В избранное
										</span>
									</>
								)}
							</Button>

							{/* Кнопка перехода на страницу */}
							<Button
								variant='outline'
								className='flex-1 border-white/20 text-white hover:bg-white/10 sm:w-auto'
								onClick={() => {
									window.location.href = `/search/event/${event.id}`
								}}
							>
								<span>На страницу мероприятия</span>
								<ArrowRight className='ml-2 h-4 w-4' />
							</Button>
						</div>
					</div>

					{/* Delete Dialog */}
					<Dialog
						open={openDeleteDialog}
						onOpenChange={setOpenDeleteDialog}
					>
						<DialogContent className='border-white/10 bg-black text-white'>
							<div className='space-y-4'>
								<h3 className='text-lg font-medium text-white'>
									Удалить мероприятие?
								</h3>
								<p className='text-gray-400'>
									Это действие нельзя отменить. Все данные
									мероприятия будут удалены.
								</p>
								<div className='flex justify-end gap-2'>
									<Button
										variant='outline'
										className='border-white/10 text-white hover:bg-white/10'
										onClick={() =>
											setOpenDeleteDialog(false)
										}
									>
										Отмена
									</Button>
									<Button
										variant='destructive'
										className={destructiveButtonClass}
										onClick={handleDelete}
										disabled={isDeleting}
									>
										{isDeleting ? 'Удаление...' : 'Удалить'}
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>

					{/* Leave Dialog */}
					<Dialog
						open={openLeaveDialog}
						onOpenChange={setOpenLeaveDialog}
					>
						<DialogContent className='border-white/10 bg-black text-white'>
							<div className='space-y-4'>
								<h3 className='text-lg font-medium text-white'>
									Покинуть мероприятие?
								</h3>
								<p className='text-gray-400'>
									Вы уверены, что хотите покинуть это
									мероприятие?
								</p>
								<div className='flex justify-end gap-2'>
									<Button
										variant='outline'
										className='border-white/10 text-white hover:bg-white/10'
										onClick={() =>
											setOpenLeaveDialog(false)
										}
									>
										Отмена
									</Button>
									<Button
										variant='destructive'
										className={destructiveButtonClass}
										onClick={handleLeave}
										disabled={isLeaving}
									>
										{isLeaving ? 'Покидаю...' : 'Покинуть'}
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</DialogContent>
			</DialogOverlay>
		</Dialog>
	)
}
