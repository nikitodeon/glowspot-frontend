'use client'

import { useMutation } from '@apollo/client'
import {
	Calendar,
	Clock,
	Heart,
	LogOut,
	Plus,
	SquarePen,
	Trash
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

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

import { DeleteEventDocument } from '@/graphql/generated/output'

import { getMediaSource } from '@/utils/get-media-source'

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '../ui/commonApp/tooltip'

import { cn } from '@/lib/utils'

const destructiveButtonClass = cn(
	'bg-transparent text-red-500 border border-red-500/30 hover:bg-red-500/10',
	'hover:text-red-400 focus-visible:ring-red-500 focus-visible:ring-offset-black',
	'transition-colors duration-200'
)

interface EventCardProps {
	event: any
	isFavorite: boolean
	onFavoriteToggle: () => void
	isParticipating: boolean
	onParticipationToggle: (isCurrentlyParticipating: boolean) => void
	propertyLink: string
	userId: string
}

const AttendCard = ({
	event,
	isFavorite,
	onFavoriteToggle,
	isParticipating,
	onParticipationToggle,
	propertyLink,
	userId
}: EventCardProps) => {
	const [imgSrc, setImgSrc] = useState(
		getMediaSource(event.photoUrls?.[0]) || '/placeholder.jpg'
	)
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [openLeaveDialog, setOpenLeaveDialog] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)

	const [deleteEvent] = useMutation(DeleteEventDocument, {
		refetchQueries: [
			'GetMyOrganizedEvents',
			'GetEventsWhereIParticipate',
			'GetFavoriteEvents'
		]
	})

	const eventDate = new Date(event.startTime).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short'
	})

	const eventTime = new Date(event.startTime).toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit'
	})

	const isOrganizer = userId === event.organizer.id

	const handleDelete = async () => {
		setIsDeleting(true)
		try {
			await deleteEvent({
				variables: { id: event.id }
			})
			setOpenDeleteDialog(false)
			toast.success('Мероприятие удалено')
		} catch (error) {
			console.error('Error deleting event:', error)
			toast.error('Не удалось удалить мероприятие')
		} finally {
			setIsDeleting(false)
		}
	}

	const handleLeave = async () => {
		setIsLeaving(true)
		try {
			onParticipationToggle(true)
			toast.success('Вы покинули мероприятие')
			setOpenLeaveDialog(false)
		} catch (err) {
			console.error('Error leaving event:', err)
			toast.error('Ошибка при выходе из мероприятия')
		} finally {
			setIsLeaving(false)
		}
	}

	const handleJoin = () => {
		try {
			onParticipationToggle(false)
			toast.success('Вы присоединились к мероприятию')
		} catch (err) {
			console.error('Error joining event:', err)
			toast.error('Ошибка при присоединении к мероприятию')
		}
	}

	return (
		<div className='mb-5 w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-lg transition-transform hover:scale-[1.02]'>
			<div className='relative'>
				<div className='relative h-48 w-full'>
					<Image
						src={imgSrc}
						alt={event.title}
						fill
						className='object-cover'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						onError={() => setImgSrc('/placeholder.jpg')}
					/>
				</div>

				<button
					className='absolute bottom-4 right-4 cursor-pointer rounded-full border border-white/20 bg-black/50 p-2 hover:bg-black/70'
					onClick={e => {
						e.stopPropagation()
						onFavoriteToggle()
					}}
				>
					<Heart
						className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
					/>
				</button>
			</div>

			<div className='relative p-4 pb-12'>
				<h2 className='mb-1 line-clamp-1 text-xl font-bold'>
					<Link
						href={propertyLink}
						className='text-white hover:underline'
						scroll={false}
					>
						{event.title}
					</Link>
				</h2>

				<p className='mb-2 line-clamp-1 text-gray-400'>
					{event?.location?.placeName || event?.location?.address},{' '}
					{event?.location?.city}
				</p>

				<div className='mb-3 flex items-center gap-4 text-sm'>
					<span className='flex items-center text-gray-400'>
						<Calendar className='mr-1 h-4 w-4' />
						{eventDate}
					</span>
					<span className='flex items-center text-gray-400'>
						<Clock className='mr-1 h-4 w-4' />
						{eventTime}
					</span>
				</div>

				<div className='absolute bottom-4 left-4'>
					<Link href={propertyLink}>
						<button className='flex items-center gap-1 rounded-full border border-white/10 bg-black px-3 py-1 text-xs font-medium text-white hover:bg-white/10'>
							Подробнее
						</button>
					</Link>
				</div>

				{isOrganizer ? (
					<div className='absolute bottom-4 right-4'>
						<Dialog
							open={openDeleteDialog}
							onOpenChange={setOpenDeleteDialog}
						>
							<DialogTrigger asChild>
								<button
									className='flex items-center gap-1 rounded-full border border-white/10 bg-black px-3 py-1 text-xs font-medium text-white hover:bg-white/10 hover:text-red-400'
									onClick={e => e.stopPropagation()}
								>
									<Trash className='h-4 w-4' />
								</button>
							</DialogTrigger>
							<DialogContent className='border-white/10 bg-black text-white'>
								<DialogHeader>
									<DialogTitle className='text-white'>
										Вы уверены, что хотите удалить
										мероприятие?
									</DialogTitle>
									<DialogDescription className='text-gray-400'>
										Это действие нельзя отменить. Все данные
										о мероприятии будут удалены.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter className='flex justify-between'>
									<Button
										variant='outline'
										className='border-white/10 text-white hover:bg-white/10 hover:text-white'
										onClick={() =>
											setOpenDeleteDialog(false)
										}
									>
										Отменить
									</Button>
									<Button
										variant='destructive'
										className={destructiveButtonClass}
										onClick={handleDelete}
										disabled={isDeleting}
									>
										{isDeleting ? 'Удаление...' : 'Удалить'}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				) : isParticipating ? (
					<div className='absolute bottom-4 right-4 flex'>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={`/dashboard/hosting/${event.id}/edit`}
								>
									<Button className='flex items-center gap-1 rounded-full border border-white/10 bg-black px-3 py-1 text-xs font-medium text-white hover:bg-white/10'>
										<SquarePen className='h-4 w-4' />
									</Button>
								</Link>
							</TooltipTrigger>
							<TooltipContent className='border-2 border-white/10 bg-black text-white'>
								Изменить
							</TooltipContent>
						</Tooltip>
						<Dialog
							open={openLeaveDialog}
							onOpenChange={setOpenLeaveDialog}
						>
							<DialogTrigger asChild>
								<button
									className='flex items-center gap-1 rounded-full border border-white/10 bg-black px-3 py-1 text-xs font-medium text-white hover:bg-white/10 hover:text-red-400'
									onClick={e => e.stopPropagation()}
								>
									<LogOut className='h-4 w-4' />
								</button>
							</DialogTrigger>
							<DialogContent className='border-white/10 bg-black text-white'>
								<DialogHeader>
									<DialogTitle className='text-white'>
										Вы уверены, что хотите покинуть
										мероприятие?
									</DialogTitle>
									<DialogDescription className='text-gray-400'>
										Вы больше не будете участником этого
										мероприятия.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter className='flex justify-between'>
									<Button
										variant='outline'
										className='border-white/10 text-white hover:bg-white/10 hover:text-white'
										onClick={() =>
											setOpenLeaveDialog(false)
										}
									>
										Отменить
									</Button>
									<Button
										variant='destructive'
										className={destructiveButtonClass}
										onClick={handleLeave}
										disabled={isLeaving}
									>
										{isLeaving ? 'Выход...' : 'Покинуть'}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				) : (
					<div className='absolute bottom-4 right-4'>
						<button
							className='flex items-center gap-1 rounded-full border border-white/10 bg-black px-3 py-1 text-xs font-medium text-white hover:bg-white/10 hover:text-green-400'
							onClick={handleJoin}
						>
							<Plus className='h-4 w-4' />
							Вступить
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default AttendCard
