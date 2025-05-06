import { z } from 'zod'

export const createAccountSchema = z.object({
	username: z
		.string()
		.min(1)
		.regex(/^[a-zA-Zа-яА-ЯёЁ0-9]+(?:-[a-zA-Zа-яА-ЯёЁ0-9]+)*$/, {
			message:
				'Имя пользователя может содержать буквы (в т.ч. русские), цифры и дефисы'
		}),
	email: z.string().email().min(3),
	password: z.string().min(8)
})

export type TypeCreateAccountSchema = z.infer<typeof createAccountSchema>
