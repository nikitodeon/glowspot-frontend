'use client'

import { ArrowLeft, Trash, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { Button } from '@/components/ui/commonApp/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/commonApp/dialog'

import {
	useDeleteEventMutation,
	useGetEventByIdQuery
	//   useLeaveEventMutation
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { getMediaSource } from '@/utils/get-media-source'

import { cn } from '@/lib/utils'

const destructiveButtonClass = cn(
	'bg-transparent text-red-500 border border-red-500/30 hover:bg-red-500/10',
	'hover:text-red-400 focus-visible:ring-red-500 focus-visible:ring-offset-black',
	'transition-colors duration-200'
)

const EventDetailsPage = () => {
	const { id } = useParams()
	const router = useRouter()
	const { user } = useCurrent()
	const userId = user?.id
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const { data, loading, error } = useGetEventByIdQuery({
		variables: {
			getEventByIdId: id as string
		}
	})

	const [deleteEvent] = useDeleteEventMutation({
		refetchQueries: [
			'GetMyOrganizedEvents',
			'GetEventsWhereIParticipate',
			'GetFavoriteEventsDocument'
		]
	})

	//   const [leaveEvent] = useLeaveEventMutation()

	const handleDelete = async () => {
		setIsDeleting(true)
		try {
			await deleteEvent({
				variables: {
					id: id as string
				}
			})
			router.push('/dashboard/attending')
		} catch (err) {
			console.error('Error deleting event:', err)
			alert('Не удалось удалить мероприятие')
		} finally {
			setIsDeleting(false)
		}
	}

	//   const handleLeaveEvent = async () => {
	//     try {
	//       await leaveEvent({
	//         variables: {
	//           eventId: id as string
	//         }
	//       })
	//       router.push('/dashboard/attending')
	//     } catch (err) {
	//       console.error('Error leaving event:', err)
	//     }
	//   }

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
						{event.photoUrls?.[0] && (
							<div className='group relative h-64 w-full overflow-hidden rounded-lg border border-white/20'>
								<Image
									src={getMediaSource(event.photoUrls[0])}
									alt={event.title}
									width={400}
									height={300}
									className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
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
									{event.eventType === 'PARTY'
										? 'Вечеринка'
										: event.eventType}
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

					{event.participants && event.participants.length > 0 ? (
						<div className='space-y-3'>
							{event.participants.map(participant => (
								<div
									key={participant.id}
									className='flex items-center gap-3 rounded-lg border border-white/10 p-3 transition-colors hover:border-white/20'
								>
									<div className='relative h-10 w-10 overflow-hidden rounded-full border border-white/20'>
										<Image
											src={
												getMediaSource(
													participant.avatar
												) || '/default-avatar.png'
											}
											alt={participant.displayName}
											width={40}
											height={40}
											className='h-full w-full object-cover'
										/>
									</div>
									<span className='font-medium text-white'>
										{participant.displayName}
									</span>
								</div>
							))}
						</div>
					) : (
						<p className='text-gray-400'>Пока нет участников</p>
					)}
				</div>

				<div className='rounded-xl border border-white/20 bg-black p-6'>
					<h2 className='mb-4 text-xl font-bold text-white'>
						Детали
					</h2>
					<ul className='space-y-3'>
						<li className='rounded-lg border border-white/10 p-3 transition-colors hover:border-white/20'>
							<strong className='font-medium text-gray-300'>
								Статус:
							</strong>{' '}
							<span className='text-white'>
								{event.status === 'UPCOMING'
									? 'Предстоящее'
									: event.status}
							</span>
						</li>
						<li className='rounded-lg border border-white/10 p-3 transition-colors hover:border-white/20'>
							<strong className='font-medium text-gray-300'>
								Приватное:
							</strong>{' '}
							<span className='text-white'>
								{event.isPrivate ? 'Да' : 'Нет'}
							</span>
						</li>
						{event.eventProperties &&
							event.eventProperties.length > 0 && (
								<li className='rounded-lg border border-white/10 p-3'>
									<strong className='font-medium text-gray-300'>
										Свойства:
									</strong>
									<ul className='mt-2 space-y-2 pl-4'>
										{event.eventProperties.map(prop => (
											<li
												key={prop}
												className='text-white'
											>
												{prop === 'AGE_18_PLUS'
													? '18+'
													: prop === 'INDOOR'
														? 'В помещении'
														: prop}
											</li>
										))}
									</ul>
								</li>
							)}
					</ul>
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
							<DialogHeader>
								<DialogTitle className='text-white'>
									Вы абсолютно уверены?
								</DialogTitle>
								<DialogDescription className='text-gray-400'>
									Это действие будет невозможно отменить. Оно
									навсегда удалит мероприятие из базы данных.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className='flex justify-between'>
								<Button
									variant='outline'
									className='border-white/10 text-white hover:bg-white/10 hover:text-white'
									onClick={() => setOpenDeleteDialog(false)}
								>
									Отменить
								</Button>
								<Button
									variant='destructive'
									className={destructiveButtonClass}
									onClick={handleDelete}
									disabled={isDeleting}
								>
									{isDeleting ? (
										<span className='flex items-center gap-2'>
											<svg
												className='h-4 w-4 animate-spin'
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
											Удаление...
										</span>
									) : (
										'Удалить мероприятие'
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			) : (
				<div className='mt-10 flex justify-center'>
					<button
						// onClick={handleLeaveEvent}
						className='flex items-center gap-3 rounded-lg border-2 border-white/20 bg-black px-8 py-4 text-xl font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10'
					>
						Покинуть мероприятие
					</button>
				</div>
			)}
		</div>
	)
}

export default EventDetailsPage
