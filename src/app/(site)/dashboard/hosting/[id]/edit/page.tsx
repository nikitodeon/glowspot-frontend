'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CustomFormField } from '@/components/dashboard/FormField'
import MultiSelect from '@/components/ui/commonApp/MultiSelectWrapper'
import { Button } from '@/components/ui/commonApp/button'
import { Form, FormField, FormMessage } from '@/components/ui/commonApp/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/commonApp/select'

import {
	EventProperty,
	EventType,
	GetEventByIdDocument,
	PaymentType,
	UpdateEventDocument,
	useGetEventByIdQuery
} from '@/graphql/generated/output'

import {
	EventFormData,
	eventSchema
} from '@/schemas/events/update-event.schema'

import { getMediaSource } from '@/utils/get-media-source'

import {
	EventPropertyTranslations,
	EventTypeTranslations,
	PaymentTypeTranslations
} from '@/lib/constants'

const EditEvent = () => {
	const { id } = useParams()
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [previews, setPreviews] = useState<string[]>([])
	const [existingPhotos, setExistingPhotos] = useState<string[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	const { data, loading } = useGetEventByIdQuery({
		variables: { getEventByIdId: id as string }
	})

	const [updateEvent] = useMutation(UpdateEventDocument, {
		refetchQueries: [
			{ query: GetEventByIdDocument, variables: { id: id as string } }
		]
	})
	const mapServerEventType = (serverType: string): EventType => {
		const mapping: Record<string, EventType> = {
			EXHIBITION: EventType.Exhibition,
			PARTY: EventType.Party,
			CONCERT: EventType.Concert,
			CYBERSPORT: EventType.Cybersport,
			DANCE: EventType.Dance,
			FESTIVAL: EventType.Festival,
			KARAOKE: EventType.Karaoke,
			KIDS_EVENT: EventType.KidsEvent,
			LECTURE: EventType.Lecture,
			MEETUP: EventType.Meetup,
			MOVIE: EventType.Movie,
			OTHER: EventType.Other,
			SPORT: EventType.Sport,
			STANDUP: EventType.Standup,
			THEATRE: EventType.Theatre,
			WALK: EventType.Walk
		}
		return mapping[serverType]
	}

	const form = useForm<EventFormData>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			title: '',
			description: '',
			startTime: new Date().toISOString().slice(0, 16),
			photos: [],
			existingPhotos: [],

			// eventType: mapServerEventType(data?.getEventById.eventType || ''),
			eventType: EventType.Party,
			eventProperties: [],
			paymentType: PaymentType.Free,
			price: 0,
			currency: 'BYN',
			isPrivate: false,
			address: '',
			city: 'Минск',
			tags: []
		}
	})
	// const getEventType = (type: string): EventType => {
	// 	return Object.values(EventType).includes(type as EventType)
	// 		? (type as EventType)
	// 		: EventType.Party
	// }

	// const getPaymentType = (type: string): PaymentType => {
	// 	return Object.values(PaymentType).includes(type as PaymentType)
	// 		? (type as PaymentType)
	// 		: PaymentType.Free
	// }

	// useEffect(() => {
	// 	if (data?.getEventById) {
	// 		console.log('Server eventType:', data.getEventById.eventType)
	// 		console.log('Available EventTypes:', Object.values(EventType))
	// 		const event = data.getEventById
	// 		setExistingPhotos(event.photoUrls || [])
	// 		if (data?.getEventById) {
	// 			const event = data.getEventById
	// 			setExistingPhotos(event.photoUrls || [])

	// 			// Преобразуем строковые значения к enum
	// 			const eventType =
	// 				Object.values(EventType).find(
	// 					val => val === event.eventType
	// 				) ?? EventType.Party

	// 			const paymentType =
	// 				Object.values(PaymentType).find(
	// 					val => val === event.paymentType
	// 				) ?? PaymentType.Free
	// 			console.log('Client EventType:', Object.values(EventType))
	// 			console.log('Server EventType:', data?.getEventById?.eventType)
	// 			console.log('Client PaymentType:', Object.values(PaymentType))
	// 			console.log(
	// 				'Server PaymentType:',
	// 				data?.getEventById?.paymentType
	// 			)
	// 			// Полный набор значений для reset
	// 			const formValues = {
	// 				title: event.title,
	// 				description: event.description || '',
	// 				startTime: event.startTime.slice(0, 16),
	// 				endTime: event.endTime?.slice(0, 16) || undefined,
	// 				existingPhotos: event.photoUrls || [],
	// 				eventType,
	// 				eventProperties: event.eventProperties || [],
	// 				paymentType,
	// 				price: event.price || 0,
	// 				currency: event.currency || 'BYN',
	// 				isPrivate: event.isPrivate || false,
	// 				address: event.location.address || '',
	// 				city: event.location.city,
	// 				placeName: event.location.placeName || undefined,
	// 				maxParticipants: event.maxParticipants || undefined,
	// 				ageRestriction: event.ageRestriction || undefined,
	// 				tags: event.tags || [],
	// 				photos: [] // Новые фото пока пустые
	// 			}
	// 			// form.setValue('eventType', event.eventType as EventType)
	// 			// form.setValue('paymentType', event.paymentType as PaymentType)
	// 			console.log('Full form values for reset:', formValues)
	// 			form.reset(formValues)
	// 		}

	// 		// setTimeout(() => {
	// 		// 	form.setValue('eventType', event.eventType as EventType)
	// 		// 	form.setValue('paymentType', event.paymentType as PaymentType)
	// 		// }, 0)
	// 	}
	// }, [data, form])
	useEffect(() => {
		if (data?.getEventById) {
			const event = data.getEventById
			setExistingPhotos(event.photoUrls || [])

			// Устанавливаем значения по одному вместо reset
			form.setValue('title', event.title)
			form.setValue('description', event.description || '')
			form.setValue('startTime', event.startTime.slice(0, 16))
			form.setValue('endTime', event.endTime?.slice(0, 16))
			form.setValue('existingPhotos', event.photoUrls || [])
			form.setValue('eventType', event.eventType as EventType)
			form.setValue('eventProperties', event.eventProperties || [])
			form.setValue('paymentType', event.paymentType as PaymentType)
			form.setValue('price', event.price || 0)
			form.setValue('currency', event.currency || 'BYN')
			form.setValue('isPrivate', event.isPrivate || false)
			form.setValue('address', event.location.address || '')
			form.setValue('city', event.location.city)
			form.setValue('placeName', event.location.placeName || '')
			form.setValue('maxParticipants', event.maxParticipants || undefined)
			form.setValue('ageRestriction', event.ageRestriction || undefined)
			form.setValue('tags', event.tags || [])
			form.setValue('photos', [])
			setTimeout(() => {
				form.setValue('eventType', event.eventType as EventType)
				form.setValue('paymentType', event.paymentType as PaymentType)
			}, 0)
		}
	}, [data, form])
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		if (files.length === 0) return

		const newPreviews = files.map(file => URL.createObjectURL(file))
		setPreviews(prev => [...prev, ...newPreviews])

		const currentPhotos = form.getValues('photos') || []
		form.setValue('photos', [...currentPhotos, ...files], {
			shouldValidate: true
		})
	}

	const removeImage = (index: number) => {
		URL.revokeObjectURL(previews[index])
		setPreviews(prev => prev.filter((_, i) => i !== index))

		const updatedPhotos =
			form.getValues('photos')?.filter((_, i) => i !== index) || []
		form.setValue('photos', updatedPhotos, { shouldValidate: true })
	}

	const removeExistingImage = (index: number) => {
		const updated = existingPhotos.filter((_, i) => i !== index)
		setExistingPhotos(updated)
		form.setValue('existingPhotos', updated, { shouldValidate: true })
	}

	const onSubmit = async (formData: EventFormData) => {
		setIsSubmitting(true)
		try {
			const { photos, existingPhotos, ...input } = formData // Исключаем existingPhotos

			const result = await updateEvent({
				variables: {
					id: id,
					input: {
						...input,
						photoUrls: existingPhotos, // Используем existingPhotos как photoUrls
						startTime: new Date(input.startTime).toISOString(),
						endTime: input.endTime
							? new Date(input.endTime).toISOString()
							: null,
						eventProperties: input.eventProperties || []
					},
					photos: photos
				},
				context: {
					hasUpload: true
				}
			})

			if (result.data?.updateEvent) {
				toast.success('Мероприятие успешно обновлено!')
				router.push(`/dashboard/hosting/${id}`)
			}
		} catch (error) {
			toast.error('Ошибка при обновлении мероприятия')
			console.error('Error updating event:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	if (loading)
		return (
			<div className='min-h-screen bg-black p-4 text-white'>
				Загрузка...
			</div>
		)

	return (
		<div className='min-h-screen bg-black p-4 text-gray-200'>
			<div className='rounded-xl border border-white/20 bg-black p-6'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-10 p-4'
						encType='multipart/form-data'
					>
						{/* Basic Information */}
						<div className='space-y-4 border-b border-white/20 pb-6'>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Базовая информация
							</h2>
							<CustomFormField
								name='title'
								label='Название мероприятия'
								className='border-white/20'
								type='title'
							/>
							<CustomFormField
								name='description'
								label='Описание'
								type='textarea'
								className='border-white/20'
							/>
						</div>

						{/* Date & Time */}
						<div className='space-y-6'>
							<h2 className='mb-4 text-lg font-semibold'>
								Дата и время
							</h2>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<CustomFormField
									name='startTime'
									label='Время начала'
									type='datepicker'
								/>
								<CustomFormField
									name='endTime'
									label='Время окончания (необязательно)'
									type='datepicker'
								/>
							</div>
						</div>

						{/* Event Type */}
						<div className='space-y-6 border-b pb-6'>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Тип мероприятия
							</h2>
							{/* <CustomFormField
								name='eventType'
								label='Тип мероприятия'
								type='select-update'
								options={Object.values(EventType).map(type => ({
									value: type,
									label: EventTypeTranslations[type]
								}))}
								className=''
							/> */}
							<Controller
								name='eventType'
								control={form.control}
								render={({ field }) => {
									// Добавляем проверку значения
									const value = Object.values(
										EventType
									).includes(field.value as EventType)
										? field.value
										: ''

									return (
										<Select
											value={value}
											onValueChange={field.onChange}
										>
											<SelectTrigger>
												<SelectValue placeholder='Выберите тип' />
											</SelectTrigger>
											<SelectContent className='w-full border-gray-200 bg-black text-white shadow'>
												{Object.values(EventType).map(
													type => (
														<SelectItem
															key={type}
															value={type}
														>
															{
																EventTypeTranslations[
																	type
																]
															}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									)
								}}
							/>
							<MultiSelect
								name='eventProperties'
								control={form.control}
								options={Object.values(EventProperty).map(
									type => ({
										value: type,
										label: EventPropertyTranslations[type]
									})
								)}
								label='Особенности мероприятия'
							/>
							<CustomFormField
								name='tags'
								label='Тэги'
								type='multi-input'
								className='border-white/20'
							/>
						</div>

						{/* Payment Information */}
						<div className='space-y-6 border-b border-white/20 pb-6'>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Об оплате
							</h2>
							<CustomFormField
								name='paymentType'
								label='Тип оплаты'
								type='select-update'
								options={Object.values(PaymentType).map(
									type => ({
										value: type,
										label: PaymentTypeTranslations[type]
									})
								)}
								className='border-white/20'
							/>
							{form.watch('paymentType') !== 'FREE' && (
								<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
									<CustomFormField
										name='price'
										label='Цена'
										type='number'
										min={0}
										className='border-white/20'
									/>
									<CustomFormField
										name='currency'
										label='Валюта'
										type='select'
										options={[
											{ value: 'BYN', label: 'BYN' },
											{ value: 'USD', label: 'USD' },
											{ value: 'EUR', label: 'EUR' },
											{ value: 'RUB', label: 'RUB' }
										]}
										className='border-white/20'
									/>
								</div>
							)}
						</div>

						{/* Event Settings */}
						<div className='space-y-6 border-b border-white/20 pb-6'>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Настройки мероприятия
							</h2>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<CustomFormField
									name='isPrivate'
									label='Приватное мероприятие'
									type='switch'
									className='border-white/20'
								/>
								<CustomFormField
									name='maxParticipants'
									label='Максимальное количество участников (необязательно)'
									type='number'
									min={1}
									className='border-white/20'
								/>
							</div>
							<CustomFormField
								name='ageRestriction'
								label='Возрастное ограничение (необязательно)'
								type='number'
								min={0}
								max={21}
								className='border-white/20'
							/>
						</div>

						{/* Location */}
						<div className='space-y-6 border-b border-white/20 pb-6'>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Место проведения
							</h2>
							<CustomFormField
								name='address'
								label='Улица и дом'
								className='border-white/20'
							/>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<CustomFormField
									name='city'
									label='Город'
									className='border-white/20'
								/>
								<CustomFormField
									name='placeName'
									label='Название места/заведения (необязательно)'
									className='border-white/20'
								/>
							</div>
						</div>

						{/* Photos Section */}
						<div>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Картинки мероприятия
							</h2>

							{existingPhotos.length > 0 && (
								<div className='mb-4'>
									<h3 className='mb-2 text-sm text-gray-400'>
										Существующие изображения
									</h3>
									<div className='flex flex-wrap gap-4'>
										{existingPhotos.map(
											(photoUrl, index) => (
												<div
													key={`existing-${index}`}
													className='group relative rounded-md border border-white/20'
												>
													<img
														src={getMediaSource(
															photoUrl
														)}
														alt={`Existing ${index}`}
														className='h-32 w-32 rounded-md object-cover'
													/>
													<button
														type='button'
														onClick={() =>
															removeExistingImage(
																index
															)
														}
														className='absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100'
													>
														<Trash className='h-4 w-4' />
													</button>
												</div>
											)
										)}
									</div>
								</div>
							)}

							{previews.length > 0 && (
								<div className='mb-4'>
									<h3 className='mb-2 text-sm text-gray-400'>
										Новые изображения
									</h3>
									<div className='flex flex-wrap gap-4'>
										{previews.map((preview, index) => (
											<div
												key={`new-${index}`}
												className='group relative rounded-md border border-white/20'
											>
												<img
													src={preview}
													alt={`Preview ${index}`}
													className='h-32 w-32 rounded-md object-cover'
												/>
												<button
													type='button'
													onClick={() =>
														removeImage(index)
													}
													className='absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100'
												>
													<Trash className='h-4 w-4' />
												</button>
											</div>
										))}
									</div>
								</div>
							)}

							<input
								type='file'
								ref={fileInputRef}
								onChange={handleFileChange}
								accept='image/*'
								multiple
								className='hidden'
							/>

							<Button
								type='button'
								variant='outline'
								onClick={() => fileInputRef.current?.click()}
								className='border-white/20 text-white hover:bg-white/10'
							>
								Добавить новые картинки
							</Button>

							<FormField
								control={form.control}
								name='photos'
								render={({ fieldState }) => (
									<FormMessage className='text-red-500'>
										{fieldState.error?.message}
									</FormMessage>
								)}
							/>
						</div>

						<Button
							type='submit'
							className='text-l ml-[25%] flex w-[50%] items-center gap-3 rounded-lg border-2 border-white/20 bg-black px-8 py-5 font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10'
							disabled={isSubmitting}
						>
							{isSubmitting
								? 'Обновление...'
								: 'Обновить мероприятие'}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}

export default EditEvent
