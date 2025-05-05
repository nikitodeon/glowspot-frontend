'use client'

import { Calendar, Clock, Heart } from 'lucide-react'

import { Skeleton } from '@/components/ui/commonApp/skeleton'

export default function LoadingCards() {
	return (
		<div className='px-8 pb-5 pt-8'>
			<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className='mb-5 w-[350px] animate-pulse overflow-hidden rounded-xl border border-white/10 bg-black shadow-lg transition-transform lg:w-[270px] xl:w-[315px]'
					>
						{/* Image */}
						<div className='aspecthh-[4/3] relative h-[200px] w-full bg-black sm:h-[200px]'>
							<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
							{/* Favorite button */}
							<div className='absolute bottom-4 right-4 rounded-full border border-white/20 bg-black p-2'>
								<Heart className='h-5 w-5 text-white' />
							</div>
						</div>

						{/* Content */}
						<div className='relative bg-black p-4 pb-12'>
							{/* Title */}
							<Skeleton className='mb-2 h-6 w-3/4 rounded-md bg-white/10' />

							{/* Location */}
							<Skeleton className='mb-3 h-4 w-full rounded-md bg-white/10' />

							{/* Date and time */}
							<div className='mb-4 flex items-center gap-4'>
								<div className='flex items-center'>
									<Calendar className='mr-1 h-4 w-4 text-white' />
									<Skeleton className='h-4 w-16 rounded-md bg-white/10' />
								</div>
								<div className='flex items-center'>
									<Clock className='mr-1 h-4 w-4 text-white' />
									<Skeleton className='h-4 w-12 rounded-md bg-white/10' />
								</div>
							</div>

							{/* Details button */}
							<Skeleton className='absolute bottom-4 left-4 h-8 w-20 rounded-full bg-white/10' />

							{/* Action button */}
							<div className='absolute bottom-4 right-4'>
								<Skeleton className='flex h-8 w-24 items-center justify-center gap-1 rounded-full bg-white/10'>
									{/* <Plus className='h-4 w-4 text-white' /> */}
									<span className='text-xs text-transparent'>
										Вступить
									</span>
								</Skeleton>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
