'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CustomFormField } from '@/components/dashboard/FormField'
import MultiSelect from '@/components/ui/commonApp/MultiSelectWrapper'
import { Button } from '@/components/ui/commonApp/button'
import { Form, FormField, FormMessage } from '@/components/ui/commonApp/form'

import {
	EventProperty,
	EventType,
	PaymentType
} from '@/graphql/generated/output'
import {
	CreateEventDocument,
	GetEventsWhereIParticipateDocument,
	GetFavoriteEventsDocument,
	GetMyOrganizedEventsDocument
} from '@/graphql/generated/output'

import {
	EventFormData,
	eventSchema
} from '@/schemas/events/create-event.schema'

import {
	EventPropertyTranslations,
	EventTypeTranslations,
	PaymentTypeTranslations
} from '@/lib/constants'

const NewEvent = () => {
	const [createEvent] = useMutation(CreateEventDocument, {
		refetchQueries: [
			{ query: GetMyOrganizedEventsDocument },

			{ query: GetEventsWhereIParticipateDocument }
		]
	})
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [previews, setPreviews] = useState<string[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	const form = useForm<EventFormData>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			title: '',
			description: '',
			startTime: new Date().toISOString().slice(0, 16),
			photos: [],
			eventType: EventType.Party,
			eventProperties: [],
			paymentType: PaymentType.Free,
			price: 0,
			currency: 'BYN',
			isPrivate: false,
			address: '',
			city: 'Минск',
			tags: [],
			maxParticipants: undefined,
			ageRestriction: undefined
		}
	})

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

		const updatedPreviews = [...previews]
		updatedPreviews.splice(index, 1)
		setPreviews(updatedPreviews)

		const updatedPhotos = [...form.getValues('photos')]
		updatedPhotos.splice(index, 1)
		form.setValue('photos', updatedPhotos, { shouldValidate: true })
	}

	const onSubmit = async (data: EventFormData) => {
		setIsSubmitting(true)
		try {
			const { photos, ...input } = data
			const eventProperties = input.eventProperties || []

			const result = await createEvent({
				variables: {
					input: {
						...input,
						startTime: new Date(input.startTime).toISOString(),
						endTime: input.endTime
							? new Date(input.endTime).toISOString()
							: null,
						eventProperties,
						photoUrls: []
					},
					photos: photos
				},
				context: {
					hasUpload: true
				}
			})
			if (result.data?.createEvent) {
				toast.success('Мероприятие успешно создано!')
				router.push(`/dashboard/hosting/${result.data.createEvent.id}`)
			}
			previews.forEach(url => URL.revokeObjectURL(url))
			form.reset()
			setPreviews([])
		} catch (error) {
			toast.error('Ошибка при создании мероприятия')
			console.error('Error creating event:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

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
							<CustomFormField
								name='eventType'
								label='Тип мероприятия'
								type='select'
								options={Object.values(EventType).map(type => ({
									value: type,
									label: EventTypeTranslations[type]
								}))}
								className=''
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
								type='select'
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
									label='Максимальное количество участников(необязательно)'
									type='number'
									min={1}
									className='border-white/20'
								/>
							</div>
							<CustomFormField
								name='ageRestriction'
								label='Возрастное ограничение(необязательно)'
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

							{previews.length > 0 && (
								<div className='mb-4 flex flex-wrap gap-4'>
									{previews.map((preview, index) => (
										<div
											key={index}
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
								Загрузить картинки
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
							{isSubmitting ? 'Creating...' : 'Create Event'}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}

export default NewEvent
