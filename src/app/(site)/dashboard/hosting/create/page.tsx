'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { CustomFormField } from '@/components/dashboard/FormField'
import { Button } from '@/components/ui/commonApp/button'
import { Form, FormField, FormMessage } from '@/components/ui/commonApp/form'

import { EventType, PaymentType } from '@/graphql/generated/output'
import { CreateEventDocument } from '@/graphql/generated/output'

import {
	EventFormData,
	eventSchema
} from '@/schemas/events/create-event.schema'

const NewEvent = () => {
	const [createEvent] = useMutation(CreateEventDocument)
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
			paymentType: PaymentType.Free,
			price: 0,
			currency: 'BYN',
			isPrivate: false,
			address: '',
			city: 'Minsk',
			tags: []
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

			await createEvent({
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

			previews.forEach(url => URL.revokeObjectURL(url))
			form.reset()
			setPreviews([])
		} catch (error) {
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
								Basic Information
							</h2>
							<CustomFormField
								name='title'
								label='Event Title'
								className='border-white/20'
							/>
							<CustomFormField
								name='description'
								label='Description'
								type='textarea'
								className='border-white/20'
							/>
						</div>

						{/* Date & Time */}
						<div className='space-y-6'>
							<h2 className='mb-4 text-lg font-semibold'>
								Date & Time
							</h2>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<CustomFormField
									name='startTime'
									label='Start Time'
									type='datepicker'
								/>
								<CustomFormField
									name='endTime'
									label='End Time (optional)'
									type='datepicker'
								/>
							</div>
						</div>

						{/* Event Type */}
						<div className='space-y-6 border-b pb-6'>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Event Type
							</h2>
							<CustomFormField
								name='eventType'
								label='Event Type'
								type='select'
								options={Object.values(EventType).map(type => ({
									value: type,
									label: type
								}))}
								className=''
							/>
							<CustomFormField
								name='tags'
								label='Tags (comma separated)'
								type='multi-input'
								className='border-white/20'
							/>
						</div>

						{/* Payment Information */}
						<div className='space-y-6 border-b border-white/20 pb-6'>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Payment Information
							</h2>
							<CustomFormField
								name='paymentType'
								label='Payment Type'
								type='select'
								options={Object.values(PaymentType).map(
									type => ({
										value: type,
										label: type
									})
								)}
								className='border-white/20'
							/>
							{form.watch('paymentType') !== 'FREE' && (
								<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
									<CustomFormField
										name='price'
										label='Price'
										type='number'
										min={0}
										className='border-white/20'
									/>
									<CustomFormField
										name='currency'
										label='Currency'
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
								Event Settings
							</h2>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<CustomFormField
									name='isPrivate'
									label='Private Event'
									type='switch'
									className='border-white/20'
								/>
								<CustomFormField
									name='maxParticipants'
									label='Max Participants (optional)'
									type='number'
									min={1}
									className='border-white/20'
								/>
							</div>
							<CustomFormField
								name='ageRestriction'
								label='Age Restriction (optional)'
								type='number'
								min={0}
								max={21}
								className='border-white/20'
							/>
						</div>

						{/* Location */}
						<div className='space-y-6 border-b border-white/20 pb-6'>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Location
							</h2>
							<CustomFormField
								name='address'
								label='Address'
								className='border-white/20'
							/>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<CustomFormField
									name='city'
									label='City'
									className='border-white/20'
								/>
								<CustomFormField
									name='placeName'
									label='Place/Venue Name (optional)'
									className='border-white/20'
								/>
							</div>
						</div>

						{/* Photos Section */}
						<div>
							<h2 className='mb-4 text-lg font-semibold text-white'>
								Event Photos
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
								Upload Photos
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
							className='bg-primary-500 hover:bg-primary-600 mt-8 w-full border-white/20 text-white'
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
