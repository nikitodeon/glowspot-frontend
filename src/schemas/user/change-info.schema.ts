import { z } from 'zod'

export const changeInfoSchema = z.object({
	username: z
		.string()
		.min(1)
		.regex(/^[a-zA-Zа-яА-ЯёЁ0-9]+(?:-[a-zA-Zа-яА-ЯёЁ0-9]+)*$/, {
			message:
				'Имя пользователя может содержать буквы (в т.ч. русские), цифры и дефисы'
		}),
	displayName: z.string().min(1),
	bio: z.string().max(300)
})

export type TypeChangeInfoSchema = z.infer<typeof changeInfoSchema>
