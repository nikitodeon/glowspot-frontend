'use client'

// import Header from "@/components/Header";
// import Loading from "@/components/Loading";
// import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from "@/state/api";
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import HostCard from '@/components/dashboard/HostCard'

import { useGetMyOrganizedEventsQuery } from '@/graphql/generated/output'

const Events = () => {
	const { data, loading: isLoadingCount } = useGetMyOrganizedEventsQuery()
	// const { data: authUser } = useGetAuthUserQuery();
	// const {
	//   data: managerProperties,
	//   isLoading,
	//   error,
	// } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || "", {
	//   skip: !authUser?.cognitoInfo?.userId,
	// });

	// if (isLoading) return <Loading />;
	// if (error) return <div>Error loading manager properties</div>;
	const myEvents = data?.getMyOrganizedEvents
	return (
		<div className='px-8 pb-5 pt-8'>
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{myEvents?.map(event => (
					<HostCard
						key={event.id}
						event={event}
						isFavorite={false}
						onFavoriteToggle={() => {}}
						showFavoriteButton={true}
						propertyLink={`/dashboard/hosting/${event.id}`}
					/>
				))}

				<div className='mb-5 w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-black shadow-lg transition-transform hover:scale-[1.02]'>
					<Link
						href='/dashboard/hosting/create'
						className='flex h-full flex-col'
					>
						<div className='bgь-gray-900 relative h-48 w-full bg-black'>
							<div className='flex h-full items-center justify-center'>
								<Plus className='h-16 w-16 text-white opacity-70' />
							</div>
						</div>

						<div className='p-4'>
							<h2 className='mb-1 text-xl font-bold text-white hover:underline'>
								Создать мероприятие
							</h2>

							<p className='lineьь-clamp-1 mb-2 text-gray-600'>
								Добавьте новое мероприятие
							</p>

							{/* <div className='mb-3 flex items-center gap-4 text-sm'>
        <span className='flex items-center text-gray-400'>
          <Calendar className='mr-1 h-4 w-4' />
          Выберите дату
        </span>
        <span className='flex items-center text-gray-400'>
          <Clock className='mr-1 h-4 w-4' />
          Выберите время
        </span>
      </div>
      
      <div className='flex items-center justify-between'>
        <span className='inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs font-medium'>
          Новое
        </span>
        
        <div className='flex items-center gap-2'>
          <Users className='h-4 w-4 text-gray-400' />
          <span className='text-sm text-gray-400'>0/∞</span>
        </div>
      </div> */}

							{/* <div className='mt-3 flex flex-wrap gap-2'>
								<span className='rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300'>
									новый
								</span>
							</div> */}
						</div>
					</Link>
				</div>
			</div>

			{/* {(!myEvents || myEvents.length === 0) && (
				<p>You don&lsquo;t manage any properties</p>
			)} */}
		</div>
	)
}

export default Events
