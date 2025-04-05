'use client'

import { Calendar, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { getMediaSource } from '@/utils/get-media-source'

interface CardCompactProps {
	event: any
	isFavorite: boolean
	onFavoriteToggle: () => void
	propertyLink: string
}

const CardCompact = ({
	event,
	isFavorite,
	onFavoriteToggle,
	propertyLink
}: CardCompactProps) => {
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

	return (
		<div className='flex gap-4 rounded-xl border border-white/20 bg-black p-4 transition-colors hover:border-white/40'>
			<div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-white/20'>
				<Image
					src={imgSrc}
					alt={event.title}
					fill
					className='object-cover'
					sizes='80px'
					onError={() => setImgSrc('/event-placeholder.jpg')}
				/>
			</div>

			<div className='min-w-0 flex-grow text-white'>
				<Link href={propertyLink} className='hover:underline'>
					<h3 className='line-clamp-1 text-base font-medium'>
						{event.title}
					</h3>
				</Link>

				<div className='mt-1 flex items-center text-sm text-gray-400'>
					<Calendar className='mr-1 h-3 w-3 flex-shrink-0' />
					<span className='line-clamp-1'>
						{formatDate(event.startTime)} · {event.location.city}
					</span>
				</div>

				<div className='mt-2 flex items-center justify-between'>
					<span className='text-sm font-medium text-gray-300'>
						{event.paymentType === 'FREE'
							? 'Бесплатно'
							: `${event.price} ${event.currency}`}
					</span>

					<button
						className='text-gray-400 transition-colors hover:text-red-500'
						onClick={onFavoriteToggle}
					>
						<Heart
							className={`h-4 w-4 ${
								isFavorite
									? 'fill-red-500 text-red-500'
									: 'text-gray-400'
							}`}
						/>
					</button>
				</div>
			</div>
		</div>
	)
}

export default CardCompact
