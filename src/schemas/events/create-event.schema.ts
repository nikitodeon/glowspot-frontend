import { z } from 'zod'

import { EventType, PaymentType } from '@/graphql/generated/output'

const datetimeLocalSchema = z.string().refine(val => {
	return !isNaN(Date.parse(val))
}, 'Invalid date format')

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const eventSchema = z.object({
	title: z.string().min(1, 'Title is required').max(30),
	description: z.string().min(1, 'Description is required'),
	startTime: datetimeLocalSchema,
	endTime: datetimeLocalSchema.optional(),
	photos: z
		.array(
			z.instanceof(File).refine(file => file.size <= MAX_FILE_SIZE, {
				message: 'Max image size is 10MB'
			})
		)
		.min(1, 'At least one photo is required'),

	eventType: z.nativeEnum(EventType),
	eventProperties: z.array(z.string()).optional(),
	paymentType: z.nativeEnum(PaymentType),
	price: z.coerce.number().min(0).optional(),
	currency: z.string().default('BYN'),
	isPrivate: z.boolean().default(false),
	maxParticipants: z.coerce.number().int().min(1).optional(),
	tags: z.array(z.string()).optional(),
	ageRestriction: z.coerce.number().int().min(0).max(21).optional(),
	address: z.string().min(1, 'Address is required'),
	city: z.string().min(1, 'City is required'),
	placeName: z.string().optional()
})

export type EventFormData = z.infer<typeof eventSchema>
