import { z } from 'zod'

import {
	EventProperty,
	EventType,
	PaymentType
} from '@/graphql/generated/output'

const datetimeLocalSchema = z.string().refine(val => {
	return !isNaN(Date.parse(val))
}, 'Invalid date format')

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const eventSchema = z.object({
	title: z.string().min(1, 'Название обязательно').max(50),
	description: z.string().min(1, 'Описание обязательно').max(2000),
	startTime: datetimeLocalSchema,
	endTime: datetimeLocalSchema.optional(),
	photos: z
		.array(
			z.instanceof(File).refine(file => file.size <= MAX_FILE_SIZE, {
				message: 'Максимальный размер файла 10MB'
			})
		)
		.min(1, 'Пожалуйста, добавьте хотя бы одно фото'),

	eventType: z.nativeEnum(EventType),
	// eventProperties: z.array(z.string()).optional(),
	eventProperties: z.nativeEnum(EventProperty).array().optional(),
	paymentType: z.nativeEnum(PaymentType),
	price: z.coerce.number().min(0).optional(),
	currency: z.string().default('BYN'),
	isPrivate: z.boolean().default(false),
	maxParticipants: z.coerce.number().int().optional(),
	tags: z.array(z.string()).optional(),
	ageRestriction: z.coerce.number().int().min(0).max(21).optional(),
	address: z.string().min(1, 'Адрес обязателен'),
	city: z.string().min(1, 'Город обязателен'),
	placeName: z.string().optional()
})

export type EventFormData = z.infer<typeof eventSchema>
