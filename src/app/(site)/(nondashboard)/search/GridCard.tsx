'use client'

import { Calendar, Clock, Heart, MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { getMediaSource } from '@/utils/get-media-source'

interface GridCardProps {
	event: any
	isFavorite: boolean
	onFavoriteToggle: () => void
	propertyLink: string
}

const GridCard = ({
	event,
	isFavorite,
	onFavoriteToggle,
	propertyLink
}: GridCardProps) => {
	const [imgSrc, setImgSrc] = useState(
		getMediaSource(event.photoUrls?.[0]) || '/event-placeholder.jpg'
	)

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short'
		})
	}

	const formatTime = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return (
		<div className='mb-6 overflow-hidden rounded-2xl border border-white/20 bg-black shadow-sm transition-all hover:border-white/40'>
			<div className='relative'>
				<div className='relative h-48 w-full'>
					<Image
						src={imgSrc}
						alt={event.title}
						fill
						className='object-cover'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						onError={() => setImgSrc('/event-placeholder.jpg')}
					/>
				</div>

				<button
					className='absolute right-3 top-3 cursor-pointer rounded-full bg-white/20 p-2 hover:bg-white/30'
					onClick={onFavoriteToggle}
				>
					<Heart
						className={`h-4 w-4 ${
							isFavorite
								? 'fill-red-500 text-red-500'
								: 'text-white'
						}`}
					/>
				</button>
			</div>

			<div className='p-4 text-white'>
				<Link href={propertyLink} className='hover:underline'>
					<h3 className='mb-1 line-clamp-1 text-lg font-semibold'>
						{event.title}
					</h3>
				</Link>

				<div className='mb-2 flex items-center text-sm text-gray-400'>
					<MapPin className='mr-1 h-3 w-3' />
					<span className='line-clamp-1'>
						{event.location.placeName || event.location.address},{' '}
						{event.location.city}
					</span>
				</div>

				<div className='mb-3 flex items-center justify-between text-sm text-gray-300'>
					<div className='flex items-center'>
						<Calendar className='mr-1 h-3 w-3' />
						<span>{formatDate(event.startTime)}</span>
						<Clock className='ml-2 mr-1 h-3 w-3' />
						<span>{formatTime(event.startTime)}</span>
					</div>

					<span className='font-medium'>
						{event.paymentType === 'FREE'
							? 'Бесплатно'
							: `${event.price} ${event.currency}`}
					</span>
				</div>

				<div className='flex items-center justify-between text-xs text-gray-400'>
					<div className='flex items-center'>
						<Users className='mr-1 h-3 w-3' />
						<span>
							{event.participants?.length || 0}
							{event.maxParticipants
								? `/${event.maxParticipants}`
								: ''}
						</span>
					</div>

					{event.ageRestriction && (
						<span className='rounded border border-gray-500 px-1'>
							{event.ageRestriction}+
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

export default GridCard
