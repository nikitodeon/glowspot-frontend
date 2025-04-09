'use client'

import { Arrow } from '@radix-ui/react-dropdown-menu'
import {
	ArrowLeft,
	ArrowRight,
	Trash2,
	UserMinus,
	UserPlus,
	X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

import {
	Dialog,
	DialogContent,
	DialogOverlay
} from '@/components/ui/commonApp/ModalDialog'
import { Button } from '@/components/ui/commonApp/button'

import {
	useDeleteEventMutation,
	useGetEventByIdQuery
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
	const [isDeleting, setIsDeleting] = useState(false)
	const [isJoining, setIsJoining] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	const { data, loading, error } = useGetEventByIdQuery({
		variables: { getEventByIdId: id },
		skip: !isMounted
	})

	const [deleteEvent] = useDeleteEventMutation({
		refetchQueries: [
			'GetEventsWhereIParticipate',
			'GetFavoriteEventsDocument'
		]
	})

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
		} finally {
			setIsDeleting(false)
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
	const photoUrl = event.photoUrls?.[0]
	const isOrganizer = userId === event.organizer.id
	const isParticipant = event.participants?.some(p => p.id === userId)

	return (
		<Dialog defaultOpen open onOpenChange={handleClose}>
			<DialogOverlay className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
				<DialogContent className='relative z-50 max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-white/10 bg-black p-0 shadow-xl'>
					<button
						onClick={handleClose}
						className='absolute right-4 top-4 z-10 rounded-full p-2 text-white hover:bg-white/10'
					>
						<X className='h-6 w-6' />
					</button>

					{photoUrl && (
						<div className='w-full overflow-hidden rounded-t-lg'>
							<Image
								src={getMediaSource(photoUrl)}
								alt={event.title}
								width={800}
								height={400}
								className='h-auto w-full object-cover'
								priority
							/>
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

						<div className='flex flex-wrap gap-4'>
							{isOrganizer ? (
								<>
									<Button
										variant='outline'
										className='mb-8 border-white/20 text-white hover:bg-white/10'
									>
										Редактировать
									</Button>
									<Button
										variant='destructive'
										className={destructiveButtonClass}
										onClick={() =>
											setOpenDeleteDialog(true)
										}
									>
										<Trash2 className='mr-2 h-4 w-4' />
										Удалить
									</Button>
									{/* <Link
										href={`/search/event/${event.id}`}
										className='ml-auto'
									> */}
									<Button
										variant='outline'
										className='ml-auto border-white/20 text-white hover:bg-white/10'
										onClick={() => {
											window.location.href = `/search/event/${event.id}`
										}}
									>
										На страницу мероприятия
										<ArrowRight className='ml-2 h-4 w-4' />
									</Button>
									{/* </Link> */}
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
													Это действие нельзя
													отменить. Все данные
													мероприятия будут удалены.
												</p>
												<div className='flex justify-end gap-2'>
													<Button
														variant='outline'
														className='border-white/10 text-white hover:bg-white/10'
														onClick={() =>
															setOpenDeleteDialog(
																false
															)
														}
													>
														Отмена
													</Button>
													<Button
														variant='destructive'
														className={
															destructiveButtonClass
														}
														onClick={handleDelete}
														disabled={isDeleting}
													>
														{isDeleting
															? 'Удаление...'
															: 'Удалить'}
													</Button>
												</div>
											</div>
										</DialogContent>
									</Dialog>
								</>
							) : isParticipant ? (
								<Button
									variant='outline'
									className='border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400'
									disabled={isLeaving}
								>
									<UserMinus className='mr-2 h-4 w-4' />
									{isLeaving
										? 'Покидаю...'
										: 'Покинуть мероприятие'}
								</Button>
							) : (
								<Button
									variant='default'
									className='bg-green-600 text-white hover:bg-green-700'
									disabled={isJoining}
								>
									<UserPlus className='mr-2 h-4 w-4' />
									{isJoining
										? 'Присоединяюсь...'
										: 'Присоединиться'}
								</Button>
							)}
						</div>
					</div>
				</DialogContent>
			</DialogOverlay>
		</Dialog>
	)
}
