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

		// Create previews
		const newPreviews = files.map(file => URL.createObjectURL(file))
		setPreviews(prev => [...prev, ...newPreviews])

		// Update form value
		const currentPhotos = form.getValues('photos') || []
		form.setValue('photos', [...currentPhotos, ...files], {
			shouldValidate: true
		})
	}

	const removeImage = (index: number) => {
		// Revoke the object URL to avoid memory leaks
		URL.revokeObjectURL(previews[index])

		// Update previews
		const updatedPreviews = [...previews]
		updatedPreviews.splice(index, 1)
		setPreviews(updatedPreviews)

		// Update form value
		const updatedPhotos = [...form.getValues('photos')]
		updatedPhotos.splice(index, 1)
		form.setValue('photos', updatedPhotos, { shouldValidate: true })
	}

	const onSubmit = async (data: EventFormData) => {
		setIsSubmitting(true)
		try {
			const { photos, ...input } = data

			const eventProperties = input.eventProperties || [] // Ensure it's always an array
			const photoUrls = previews // Assuming previews contain valid uploaded URLs

			await createEvent({
				variables: {
					input: {
						...input,
						startTime: new Date(input.startTime).toISOString(),
						endTime: input.endTime
							? new Date(input.endTime).toISOString()
							: null,
						eventProperties, // Include eventProperties
						photoUrls // Include uploaded image URLs
					}
				}
			})

			// Clean up object URLs
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
		<div className='dashboard-container'>
			<div className='rounded-xl bg-white p-6'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-10 p-4'
						encType='multipart/form-data'
					>
						{/* Basic Information */}
						<div>
							<h2 className='mb-4 text-lg font-semibold'>
								Basic Information
							</h2>
							<div className='space-y-4'>
								<CustomFormField
									name='title'
									label='Event Title'
								/>
								<CustomFormField
									name='description'
									label='Description'
									type='textarea'
								/>
							</div>
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
									type='datetime-local'
								/>
								<CustomFormField
									name='endTime'
									label='End Time (optional)'
									type='datetime-local'
								/>
							</div>
						</div>

						{/* Event Type */}
						<div className='space-y-6'>
							<h2 className='mb-4 text-lg font-semibold'>
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
							/>
							<CustomFormField
								name='tags'
								label='Tags (comma separated)'
								type='multi-input'
							/>
						</div>

						{/* Payment Information */}
						<div className='space-y-6'>
							<h2 className='mb-4 text-lg font-semibold'>
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
							/>
							{form.watch('paymentType') !== 'FREE' && (
								<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
									<CustomFormField
										name='price'
										label='Price'
										type='number'
										min={0}
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
									/>
								</div>
							)}
						</div>

						{/* Event Settings */}
						<div className='space-y-6'>
							<h2 className='mb-4 text-lg font-semibold'>
								Event Settings
							</h2>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<CustomFormField
									name='isPrivate'
									label='Private Event'
									type='switch'
								/>
								<CustomFormField
									name='maxParticipants'
									label='Max Participants (optional)'
									type='number'
									min={1}
								/>
							</div>
							<CustomFormField
								name='ageRestriction'
								label='Age Restriction (optional)'
								type='number'
								min={0}
								max={21}
							/>
						</div>

						{/* Location */}
						<div className='space-y-6'>
							<h2 className='mb-4 text-lg font-semibold'>
								Location
							</h2>
							<CustomFormField name='address' label='Address' />
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<CustomFormField name='city' label='City' />
								<CustomFormField
									name='placeName'
									label='Place/Venue Name (optional)'
								/>
							</div>
						</div>

						{/* Photos Section */}
						<div>
							<h2 className='mb-4 text-lg font-semibold'>
								Event Photos
							</h2>

							{/* Image Previews */}
							{previews.length > 0 && (
								<div className='mb-4 flex flex-wrap gap-4'>
									{previews.map((preview, index) => (
										<div
											key={index}
											className='group relative'
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

							{/* File Input */}
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
							className='bg-primary-700 mt-8 w-full text-white'
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
