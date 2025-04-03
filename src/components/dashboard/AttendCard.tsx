import { Calendar, Clock, Heart, Trash2, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { getMediaSource } from '@/utils/get-media-source'

const AttendCard = ({
	event,
	isFavorite,
	onFavoriteToggle,
	showFavoriteButton = true,
	propertyLink
}: CardProps) => {
	const [imgSrc, setImgSrc] = useState(
		getMediaSource(event.photoUrls?.[0]) || '/placeholder.jpg'
	)

	// Форматирование даты и времени
	const eventDate = new Date(event.startTime).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short'
	})

	const eventTime = new Date(event.startTime).toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit'
	})

	// Определение типа мероприятия
	const eventTypeLabelMap: Record<string, string> = {
		PARTY: 'Вечеринка',
		CONFERENCE: 'Конференция',
		WORKSHOP: 'Воркшоп'
	}

	const eventTypeLabel = eventTypeLabelMap[event.eventType] || event.eventType

	const handleDelete = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		// Здесь будет логика удаления
		console.log('Delete event:', event.id)
	}

	return (
		<div className='mb-5 w-full overflow-hidden rounded-xl border border-white bg-black shadow-lg transition-transform hover:scale-[1.02]'>
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

				{showFavoriteButton && (
					<button
						className='absolute bottom-4 right-4 cursor-pointer rounded-full bg-white p-2 hover:bg-white/90'
						onClick={e => {
							e.stopPropagation() // предотвращаем всплытие клика
							console.log(
								'Like button clicked for event:',
								event.id
							)
							onFavoriteToggle()
						}}
					>
						<Heart
							className={`h-5 w-5 ${
								isFavorite
									? 'fill-red-500 text-red-500'
									: 'text-gray-600'
							}`}
						/>
					</button>
				)}
			</div>

			<div className='relative p-4 pb-12'>
				{' '}
				{/* Увеличил нижний padding */}
				<h2 className='mb-1 line-clamp-1 text-xl font-bold'>
					{propertyLink ? (
						<Link
							href={propertyLink}
							className='text-white hover:underline'
							scroll={false}
						>
							{event.title}
						</Link>
					) : (
						event.title
					)}
				</h2>
				<p className='mb-2 line-clamp-1 text-gray-600'>
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
				<div className='flex items-center justify-between'>
					<span className='inline-flex items-center rounded-full border-2 border-white/10 bg-black px-3 py-1 text-xs font-medium text-gray-300'>
						{eventTypeLabel}
					</span>

					<div className='flex items-center gap-2'>
						<Users className='h-4 w-4 text-gray-400' />
						<span className='text-sm text-gray-400'>
							{event.participants?.length || 0}
							{event.maxParticipants === 0 ||
							event.maxParticipants === null ? (
								<span className='ml-1'>/∞</span>
							) : (
								<span>/{event.maxParticipants}</span>
							)}
						</span>
					</div>
				</div>
				{/* Контейнер для тегов с фиксированной высотой */}
				<div className='mt-3 min-h-[40px]'>
					{event.tags?.length > 0 && (
						<div className='flex flex-wrap gap-2'>
							{event.tags.slice(0, 2).map((tag: string) => (
								<span
									key={tag}
									className='rounded-full border-2 border-white/10 bg-black px-2 py-1 text-xs text-gray-300'
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
				{/* Кнопка "Удалить" с фиксированным позиционированием */}
				<div className='absolute bottom-4 right-4'>
					<button
						onClick={handleDelete}
						className='flex items-center gap-1 rounded-full border border-white/20 bg-black px-3 py-1 text-xs font-medium text-white hover:bg-white/10'
					>
						{/* <Trash2 className='h-3 w-3' /> */}
						Покинуть
					</button>
				</div>
			</div>
		</div>
	)
}

export default AttendCard
