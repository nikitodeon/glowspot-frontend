import { EventProperty } from '@/graphql/generated/output'

declare global {
	interface AppSidebarProps {
		userType: 'manager' | 'tenant'
	}
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
	// enum AmenityEnum {
	// 	WasherDryer = 'WasherDryer',
	// 	AirConditioning = 'AirConditioning',
	// 	Dishwasher = 'Dishwasher',
	// 	HighSpeedInternet = 'HighSpeedInternet',
	// 	HardwoodFloors = 'HardwoodFloors',
	// 	WalkInClosets = 'WalkInClosets',
	// 	Microwave = 'Microwave',
	// 	Refrigerator = 'Refrigerator',
	// 	Pool = 'Pool',
	// 	Gym = 'Gym',
	// 	Parking = 'Parking',
	// 	PetsAllowed = 'PetsAllowed',
	// 	WiFi = 'WiFi'
	// }
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
	// enum PropertyTypeEnum {
	// 	Rooms = 'Rooms',
	// 	Tinyhouse = 'Tinyhouse',
	// 	Apartment = 'Apartment',
	// 	Villa = 'Villa',
	// 	Townhouse = 'Townhouse',
	// 	Cottage = 'Cottage'
	// }
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
