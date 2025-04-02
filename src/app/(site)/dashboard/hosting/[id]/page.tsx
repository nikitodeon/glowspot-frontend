'use client'

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

import { useGetEventByIdQuery } from '@/graphql/generated/output'

const EventDetailsPage = () => {
	const { id } = useParams()
	const { data, loading } = useGetEventByIdQuery({
		variables: {
			getEventByIdId: id as string
		}
	})

	if (loading) return <div className='p-8 text-center'>Загрузка...</div>

	const event = data?.getEventById

	if (!event)
		return <div className='p-8 text-center'>Мероприятие не найдено</div>

	return (
		<div className='px-8 pb-5 pt-8 text-white'>
			{/* Кнопка назад */}
			<Link
				href='/dashboard/hosting'
				className='hover:text-primary-500 mb-4 flex items-center'
				scroll={false}
			>
				<ArrowLeft className='mr-2 h-4 w-4' />
				<span>Назад к моим мероприятиям</span>
			</Link>

			{/* Основная информация */}
			<div className='mb-8 rounded-xl border border-white bg-black p-6 shadow-lg'>
				<div className='flex flex-col gap-6 md:flex-row'>
					{/* Фото мероприятия */}
					<div className='w-full md:w-1/3'>
						{event.photoUrls?.[0] && (
							<Image
								src={event.photoUrls[0]}
								alt={event.title}
								width={400}
								height={300}
								className='h-64 w-full rounded-lg object-cover'
							/>
						)}
					</div>

					{/* Детали мероприятия */}
					<div className='w-full md:w-2/3'>
						<h1 className='mb-2 text-3xl font-bold'>
							{event.title}
						</h1>

						{event.isVerified && (
							<span className='mb-4 inline-block rounded bg-blue-500 px-2 py-1 text-xs text-white'>
								Проверено
							</span>
						)}

						<div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
							<div>
								<h3 className='text-sm text-gray-400'>
									Дата и время
								</h3>
								<p>
									{new Date(event.startTime).toLocaleString()}{' '}
									-{' '}
									{new Date(
										event.endTime
									).toLocaleTimeString()}
								</p>
							</div>

							<div>
								<h3 className='text-sm text-gray-400'>
									Местоположение
								</h3>
								<p>
									{event.location.placeName},{' '}
									{event.location.address},{' '}
									{event.location.city}
								</p>
							</div>

							<div>
								<h3 className='text-sm text-gray-400'>
									Тип мероприятия
								</h3>
								<p>
									{event.eventType === 'PARTY'
										? 'Вечеринка'
										: event.eventType}
								</p>
							</div>

							<div>
								<h3 className='text-sm text-gray-400'>Цена</h3>
								<p>
									{event.paymentType === 'FREE'
										? 'Бесплатно'
										: `${event.price} ${event.currency}`}
								</p>
							</div>

							<div>
								<h3 className='text-sm text-gray-400'>
									Возрастное ограничение
								</h3>
								<p>{event.ageRestriction}+</p>
							</div>

							<div>
								<h3 className='text-sm text-gray-400'>
									Макс. участников
								</h3>
								<p>{event.maxParticipants}</p>
							</div>
						</div>

						{/* Теги */}
						{event.tags && event.tags.length > 0 && (
							<div className='mb-6 flex flex-wrap gap-2'>
								{event.tags.map(tag => (
									<span
										key={tag}
										className='rounded-full bg-gray-700 px-3 py-1 text-sm text-white'
									>
										{tag}
									</span>
								))}
							</div>
						)}

						{/* Описание */}
						<div className='mb-6'>
							<h3 className='mb-2 text-sm text-gray-400'>
								Описание
							</h3>
							<p className='whitespace-pre-line'>
								{event.description}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Дополнительные секции */}
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
				{/* Участники */}
				<div className='rounded-xl border border-white bg-black p-6 shadow-lg'>
					<h2 className='mb-4 text-xl font-bold'>Участники</h2>
					{event.participants && event.participants.length > 0 ? (
						<div className='space-y-4'>
							{event.participants.map(participant => (
								<div
									key={participant.id}
									className='flex items-center gap-3'
								>
									<Image
										src={
											participant.avatar ||
											'/default-avatar.png'
										}
										alt={participant.username}
										width={40}
										height={40}
										className='rounded-full'
									/>
									<span>{participant.username}</span>
								</div>
							))}
						</div>
					) : (
						<p>Пока нет участников</p>
					)}
				</div>

				{/* Свойства мероприятия */}
				<div className='rounded-xl border border-white bg-black p-6 shadow-lg'>
					<h2 className='mb-4 text-xl font-bold'>Детали</h2>
					<ul className='space-y-2'>
						<li>
							<strong>Статус:</strong>{' '}
							{event.status === 'UPCOMING'
								? 'Предстоящее'
								: event.status}
						</li>
						<li>
							<strong>Приватное:</strong>{' '}
							{event.isPrivate ? 'Да' : 'Нет'}
						</li>
						{event.eventProperties &&
							event.eventProperties.length > 0 && (
								<>
									<li>
										<strong>Свойства:</strong>
									</li>
									<ul className='ml-4 list-inside list-disc'>
										{event.eventProperties.map(prop => (
											<li key={prop}>
												{prop === 'AGE_18_PLUS'
													? '18+'
													: prop === 'INDOOR'
														? 'В помещении'
														: prop}
											</li>
										))}
									</ul>
								</>
							)}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default EventDetailsPage
