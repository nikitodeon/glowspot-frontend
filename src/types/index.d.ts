import { EventProperty } from '@/graphql/generated/output'

declare global {
	interface HeaderProps {
		text: string
	}
	interface CardProps {
		event: any
		isFavorite: boolean
		onFavoriteToggle: () => void
		showFavoriteButton?: boolean
		propertyLink?: string
	}

	enum EventPropertyEnum {
		AGE_18_PLUS = '18+',
		AGE_21_PLUS = '21+',
		ALCOHOL_FREE = 'Без алкоголя',
		HEALTHY_LIFESTYLE = 'ЗОЖ',
		FAMILY_FRIENDLY = 'Семейное',
		PET_FRIENDLY = 'C животными',
		OUTDOOR = 'На улице',

		INDOOR = 'В помещении',

		ONLINE = 'Онлайн',

		CHARITY = 'Благотворительность'
	}

	export enum EventTypeEnum {
		EXHIBITION = 'Выставка',
		MEETUP = 'Встреча',
		WALK = 'Прогулка',
		PARTY = 'Вечеринка',
		CONCERT = 'Концерт',
		SPORT = 'Спорт',
		FESTIVAL = 'Фестиваль',
		LECTURE = 'Лекция',

		OTHER = 'Другое',
		MOVIE = 'Кино',
		THEATRE = 'Театр',

		STANDUP = 'Стендап',
		DANCE = 'Танцы',
		BOOK_CLUB = 'Книги',
		KARAOKE = 'Караоке',
		CYBERSPORT = 'Киберспорт',
		KIDS_EVENT = 'Для детей'
	}
}
export {}
