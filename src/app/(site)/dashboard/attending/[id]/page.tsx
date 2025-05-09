'use client'

import { ApolloCache } from '@apollo/client'
import {
	ArrowLeft,
	CheckCircle,
	Trash,
	UserMinus,
	UserPlus,
	XCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/commonApp/button'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/commonApp/carousel'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/commonApp/dialog'
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/components/ui/commonAuth/Avatar'

import {
	EventType,
	GetEventByIdDocument,
	useDeleteEventMutation,
	useGetEventByIdQuery,
	useLeaveEventMutation,
	useParticipateInEventMutation
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { getMediaSource } from '@/utils/get-media-source'

import { EventTypeTranslations } from '@/lib/constants'
import { cn } from '@/lib/utils'

const destructiveButtonClass = cn(
	'bg-transparent text-red-500 border border-red-500/30 hover:bg-red-500/10',
	'hover:text-red-400 focus-visible:ring-red-500 focus-visible:ring-offset-black',
	'transition-colors duration-200'
)

const AttendingEventDetailsPage = () => {
	const { id } = useParams()
	const router = useRouter()
	const { user } = useCurrent()
	const userId = user?.id
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [openLeaveDialog, setOpenLeaveDialog] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isJoining, setIsJoining] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)

	const { data, loading, error } = useGetEventByIdQuery({
		variables: {
			getEventByIdId: id as string
		}
	})

	const [participateInEvent] = useParticipateInEventMutation()
	const [leaveEvent] = useLeaveEventMutation({
		refetchQueries: ['GetEventsWhereIParticipate']
	})
	const updateCaches = (
		cache: ApolloCache<any>,
		eventId: string,
		updates: {
			participants?: any[]
		}
	) => {
		// Обновляем текущее мероприятие
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
	}

	const handleJoin = async () => {
		setIsJoining(true)
		try {
			await participateInEvent({
				variables: { eventId: id as string },
				update: cache => {
					if (!userId || !user) return

					const userObj = {
						__typename: 'User',
						id: user.id,
						username: user.username,
						displayName: user.displayName,
						avatar: user.avatar || ''
					}

					updateCaches(cache, id as string, {
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
				variables: { eventId: id as string },
				update: cache => {
					if (!userId) return

					updateCaches(cache, id as string, {
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

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-black p-8'>
				<div className='border-t-primary-500 h-12 w-12 animate-spin rounded-full border-4 border-white'></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-black p-8 text-center text-red-500'>
				Ошибка загрузки данных мероприятия
			</div>
		)
	}

	const event = data?.getEventById
	if (!event) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-black p-8 text-center text-gray-300'>
				Мероприятие не найдено
			</div>
		)
	}

	// Форматирование даты
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

	// Форматирование времени
	const formatTime = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const isOrganizer = userId === event.organizer.id
	const isParticipant = event.participants?.some(p => p.id === userId)
	return (
		<div className='min-h-screen bg-black px-4 pb-8 pt-8 text-gray-200 sm:px-8'>
			<Link
				href='/dashboard/attending'
				className='hover:text-primary-500 group mb-6 flex items-center text-gray-400 transition-colors'
				scroll={false}
			>
				<ArrowLeft className='mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1' />
				<span className='text-lg'>Назад к участию</span>
			</Link>

			<div className='mb-8 overflow-hidden rounded-xl border border-white/20 bg-black p-6 shadow-lg transition-all hover:shadow-xl'>
				<div className='flex flex-col gap-6 md:flex-row'>
					<div className='w-full md:w-1/3'>
						{event.photoUrls && (
							<div className='group relative h-64 w-full overflow-hidden rounded-lg border border-white/20'>
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
														src={getMediaSource(
															item
														)}
														fill
														className='object-cover'
														sizes='(max-width: 768px) 100vw, 33vw'
													/>
												</div>
											</CarouselItem>
										))}
									</CarouselContent>
									{event.photoUrls.length > 1 && (
										<>
											<CarouselPrevious />
											<CarouselNext />
										</>
									)}
								</Carousel>
							</div>
						)}
					</div>

					<div className='w-full md:w-2/3'>
						<div className='flex items-start justify-between'>
							<h1 className='mb-2 text-3xl font-bold text-white'>
								{event.title}
							</h1>
							{event.isVerified && (
								<span className='flex items-center rounded-full border border-white/20 bg-black px-3 py-1 text-xs font-medium text-blue-400'>
									Проверено
								</span>
							)}
						</div>

						<div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
							<div className='rounded-lg border border-white/10 bg-black p-4 transition-colors hover:border-white/20'>
								<h3 className='mb-1 text-sm font-medium text-gray-400'>
									Дата начала
								</h3>
								<p className='text-white'>
									{formatDate(event.startTime)}
								</p>
								<h3 className='mb-1 mt-3 text-sm font-medium text-gray-400'>
									Время начала
								</h3>
								<p className='text-white'>
									{formatTime(event.startTime)}
								</p>
							</div>

							<div className='relative rounded-lg border border-white/10 bg-black p-4 transition-colors hover:border-white/20'>
								<h3 className='mb-1 text-sm font-medium text-gray-400'>
									Дата окончания
								</h3>
								<p className='text-white'>
									{formatDate(event.endTime)}
								</p>
								<h3 className='mb-1 mt-3 text-sm font-medium text-gray-400'>
									Время окончания
								</h3>
								<p className='text-white'>
									{formatTime(event.endTime)}
								</p>
							</div>

							<div className='rounded-lg border border-white/10 bg-black p-4 transition-colors hover:border-white/20'>
								<h3 className='mb-1 text-sm font-medium text-gray-400'>
									Местоположение
								</h3>
								<p className='text-white'>
									{event.location.placeName},{' '}
									{event.location.address},{' '}
									{event.location.city}
								</p>
							</div>

							<div className='rounded-lg border border-white/10 bg-black p-4 transition-colors hover:border-white/20'>
								<h3 className='mb-1 text-sm font-medium text-gray-400'>
									Тип мероприятия
								</h3>
								<p className='text-white'>
									{EventTypeTranslations[
										event.eventType as EventType
									] || event.eventType}
								</p>
							</div>

							<div className='rounded-lg border border-white/10 bg-black p-4 transition-colors hover:border-white/20'>
								<h3 className='mb-1 text-sm font-medium text-gray-400'>
									Цена
								</h3>
								<p className='text-white'>
									{event.paymentType === 'FREE'
										? 'Бесплатно'
										: `${event.price} ${event.currency}`}
								</p>
							</div>

							<div className='rounded-lg border border-white/10 bg-black p-4 transition-colors hover:border-white/20'>
								<h3 className='mb-1 text-sm font-medium text-gray-400'>
									Возрастное ограничение
								</h3>
								<p className='text-white'>
									{event.ageRestriction
										? `${event.ageRestriction}+`
										: 'Нет'}
								</p>
							</div>

							<div className='rounded-lg border border-white/10 bg-black p-4 transition-colors hover:border-white/20'>
								<h3 className='mb-1 text-sm font-medium text-gray-400'>
									Участники
								</h3>
								<p className='text-white'>
									{event.participants?.length || 0}
									{event.maxParticipants &&
									event.maxParticipants > 0 ? (
										`/${event.maxParticipants}`
									) : (
										//  null
										<span className='ml-1'>/∞</span>
									)}
								</p>
							</div>
						</div>

						{event.tags && event.tags.length > 0 && (
							<div className='mb-6 flex flex-wrap gap-2'>
								{event.tags.map(tag => (
									<span
										key={tag}
										className='rounded-full border border-white/20 bg-black px-3 py-1 text-sm font-medium text-gray-300'
									>
										#{tag}
									</span>
								))}
							</div>
						)}

						<div className='mb-6'>
							<h3 className='mb-2 text-sm font-medium text-gray-400'>
								Описание
							</h3>
							<p className='whitespace-pre-line text-gray-300'>
								{event.description}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
				<div className='rounded-xl border border-white/20 bg-black p-6'>
					<div className='mb-4 flex items-center justify-between'>
						<h2 className='text-xl font-bold text-white'>
							Участники
						</h2>
						<div className='rounded-full border border-white/20 px-3 py-1 text-sm'>
							<span className='text-primary-500'>
								{event.participants?.length || 0}
							</span>
							{event.maxParticipants &&
							event.maxParticipants > 0 ? (
								<span className='text-gray-400'>
									/{event.maxParticipants}
								</span>
							) : (
								<span className='text-gray-400'>/∞</span>
							)}
						</div>
					</div>
					<p className='text-gray-400'>
						{event.participants?.length || 0} участников
						{event.maxParticipants && event.maxParticipants > 0
							? ` (максимум ${event.maxParticipants})`
							: null}
					</p>
				</div>

				<div className='rounded-xl border border-white/20 bg-black p-6'>
					<h2 className='mb-4 text-xl font-bold text-white'>
						Организатор
					</h2>
					<div className='flex items-center gap-3 rounded-lg border border-white/10 p-3 transition-colors hover:border-white/20'>
						<Avatar className='h-12 w-12'>
							<AvatarImage
								src={getMediaSource(event.organizer.avatar)}
							/>
							<AvatarFallback className='text-lg'>
								{event.organizer.username?.[0] || 'O'}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className='flex items-center gap-2'>
								<h3 className='font-medium text-white'>
									{event.organizer.displayName}
								</h3>
								{event.organizer.isVerified ? (
									<div className='flex items-center gap-1'>
										<CheckCircle className='h-4 w-4 text-green-500' />
										<span className='text-xs text-green-500'>
											Подтверждён
										</span>
									</div>
								) : (
									<div className='flex items-center gap-1'>
										<XCircle className='h-4 w-4 text-yellow-500' />
										<span className='text-xs text-yellow-500'>
											Не верифицирован
										</span>
									</div>
								)}
							</div>
							<p className='text-sm text-gray-400'>
								@{event.organizer.username}
							</p>
							{!event.organizer.isVerified && (
								<p className='mt-1 text-xs text-gray-500'>
									* Верификация может занять некоторое время.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{isOrganizer ? (
				<div className='mt-10 flex justify-center'>
					<Dialog
						open={openDeleteDialog}
						onOpenChange={setOpenDeleteDialog}
					>
						<DialogTrigger asChild>
							<button className='flex items-center gap-3 rounded-lg border-2 border-white/20 bg-black px-8 py-4 text-xl font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10 hover:text-red-400'>
								<Trash className='h-6 w-6' />
								Удалить мероприятие
							</button>
						</DialogTrigger>
						<DialogContent className='border-white/10 bg-black text-white'>
							{/* Диалог удаления */}
						</DialogContent>
					</Dialog>
				</div>
			) : isParticipant ? (
				<div className='mt-10 flex justify-center'>
					<Dialog
						open={openLeaveDialog}
						onOpenChange={setOpenLeaveDialog}
					>
						<DialogTrigger asChild>
							<button className='flex items-center gap-3 rounded-lg border-2 border-white/20 bg-black px-8 py-4 text-xl font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10 hover:text-red-400'>
								<UserMinus className='h-6 w-6' />
								Покинуть мероприятие
							</button>
						</DialogTrigger>
						<DialogTitle></DialogTitle>
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
				</div>
			) : (
				<div className='mt-10 flex justify-center'>
					<button
						onClick={handleJoin}
						disabled={isJoining}
						className='flex items-center gap-3 rounded-lg border-2 border-white/20 bg-black px-8 py-4 text-xl font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10 hover:text-green-400'
					>
						{isJoining ? (
							<span className='flex items-center gap-2'>
								<svg
									className='h-6 w-6 animate-spin'
									viewBox='0 0 24 24'
								>
									<circle
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
										fill='none'
									/>
								</svg>
								Присоединяюсь...
							</span>
						) : (
							<>
								<UserPlus className='h-6 w-6' />
								Присоединиться
							</>
						)}
					</button>
				</div>
			)}
		</div>
	)
}

export default AttendingEventDetailsPage
