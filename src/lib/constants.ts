import {
	Amphora,
	Bath,
	Bike,
	BookOpenText,
	Building,
	Bus,
	Cable,
	Cake,
	Car,
	Castle,
	Cigarette,
	Clapperboard,
	Drama,
	Dumbbell,
	Ellipsis,
	Footprints,
	Gamepad2,
	GraduationCap,
	Hammer,
	Handshake,
	Home,
	LucideIcon,
	Maximize,
	MicVocal,
	Mountain,
	PartyPopper,
	PawPrint,
	PersonStanding,
	Phone,
	Piano,
	Speech,
	Sprout,
	Theater,
	Thermometer,
	Trees,
	Tv,
	VenetianMask,
	VolumeX,
	Warehouse,
	Waves,
	Wifi
} from 'lucide-react'

import {
	EventProperty,
	EventStatus,
	EventType,
	PaymentType
} from '@/graphql/generated/output'

// export enum AmenityEnum {
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

export enum EventPropertyEnum {
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

export const EventPropertyIcons: Record<EventPropertyEnum, LucideIcon> = {
	'18+': PawPrint,
	'21+': Dumbbell,
	'Без алкоголя': Cigarette,
	ЗОЖ: VolumeX,
	Семейное: Hammer,
	'C животными': PawPrint,
	'На улице': Bus,
	'В помещении': Home,
	Онлайн: Phone,
	Благотворительность: Sprout
}

export enum HighlightEnum {
	HighSpeedInternetAccess = 'HighSpeedInternetAccess',
	WasherDryer = 'WasherDryer',
	AirConditioning = 'AirConditioning',
	Heating = 'Heating',
	SmokeFree = 'SmokeFree',
	CableReady = 'CableReady',
	SatelliteTV = 'SatelliteTV',
	DoubleVanities = 'DoubleVanities',
	TubShower = 'TubShower',
	Intercom = 'Intercom',
	SprinklerSystem = 'SprinklerSystem',
	RecentlyRenovated = 'RecentlyRenovated',
	CloseToTransit = 'CloseToTransit',
	GreatView = 'GreatView',
	QuietNeighborhood = 'QuietNeighborhood'
}
export enum EventStatusEnum {
	Archived = 'ARCHIVED',
	Cancelled = 'CANCELLED',
	Completed = 'COMPLETED',
	Ongoing = 'ONGOING',
	Upcoming = 'UPCOMING'
}

export const HighlightIcons: Record<HighlightEnum, LucideIcon> = {
	HighSpeedInternetAccess: Wifi,
	WasherDryer: Waves,
	AirConditioning: Thermometer,
	Heating: Thermometer,
	SmokeFree: Cigarette,
	CableReady: Cable,
	SatelliteTV: Tv,
	DoubleVanities: Maximize,
	TubShower: Bath,
	Intercom: Phone,
	SprinklerSystem: Sprout,
	RecentlyRenovated: Hammer,
	CloseToTransit: Bus,
	GreatView: Mountain,
	QuietNeighborhood: VolumeX
}

// export enum PropertyTypeEnum {
// 	Rooms = 'Rooms',
// 	Tinyhouse = 'Tinyhouse',
// 	Apartment = 'Apartment',
// 	Villa = 'Villa',
// 	Townhouse = 'Townhouse',
// 	Cottage = 'Cottage'
// }
export enum EventTypeEnum {
	EXHIBITION = 'EXHIBITION',
	MEETUP = 'MEETUP',
	WALK = 'WALK',
	PARTY = 'PARTY',
	CONCERT = 'CONCERT',
	SPORT = 'SPORT',
	FESTIVAL = 'FESTIVAL',
	LECTURE = 'LECTURE',

	OTHER = 'OTHER',

	MOVIE = 'MOVIE',
	THEATRE = 'THEATRE',

	STANDUP = 'STANDUP',
	DANCE = 'DANCE',
	BOOK_CLUB = 'BOOK_CLUB',
	KARAOKE = 'KARAOKE',
	CYBERSPORT = 'CYBERSPORT',
	KIDS_EVENT = 'KIDS_EVENT'
}

export const EventTypeIcons: Record<EventTypeEnum, LucideIcon> = {
	[EventTypeEnum.EXHIBITION]: Amphora,
	[EventTypeEnum.MEETUP]: Handshake,
	[EventTypeEnum.WALK]: Footprints,
	[EventTypeEnum.PARTY]: PartyPopper,
	[EventTypeEnum.CONCERT]: Piano,
	[EventTypeEnum.SPORT]: Bike,
	[EventTypeEnum.FESTIVAL]: VenetianMask,
	[EventTypeEnum.LECTURE]: GraduationCap,

	[EventTypeEnum.MOVIE]: Clapperboard,
	[EventTypeEnum.THEATRE]: Drama,

	[EventTypeEnum.STANDUP]: Speech,
	[EventTypeEnum.DANCE]: PersonStanding,
	[EventTypeEnum.BOOK_CLUB]: BookOpenText,
	[EventTypeEnum.KARAOKE]: MicVocal,
	[EventTypeEnum.CYBERSPORT]: Gamepad2,
	[EventTypeEnum.KIDS_EVENT]: Cake,
	[EventTypeEnum.OTHER]: Ellipsis
}
// export const EventTypeLabelsRu: Record<EventTypeEnum, string> = {
// 	EXHIBITION: 'Выставка',
// 	MEETUP: 'Встреча',
// 	WALK: 'Прогулка',
// 	PARTY: 'Вечеринка',
// 	CONCERT: 'Концерт',
// 	SPORT: 'Спорт',
// 	FESTIVAL: 'Фестиваль',
// 	LECTURE: 'Лекция',
// 	// WORKSHOP: 'Мастер-класс',
// 	OTHER: 'Другое',

// 	THEATRE: 'Театр',
// 	MOVIE: 'Кино',
// 	// TOUR = 'Экскурсия',
// 	STANDUP: 'Стендап',
// 	DANCE: 'Танцы',
// 	BOOK_CLUB: 'Книги',
// 	KARAOKE: 'Караоке',
// 	CYBERSPORT: 'Киберспорт',
// 	KIDS_EVENT: 'Для детей'
// }

export const EventTypeLabelsRu: Record<EventType, string> = {
	[EventTypeEnum.EXHIBITION]: 'Выставка',
	[EventTypeEnum.MEETUP]: 'Встреча',
	[EventTypeEnum.WALK]: 'Прогулка',
	[EventTypeEnum.PARTY]: 'Вечеринка',
	[EventTypeEnum.CONCERT]: 'Концерт',
	[EventTypeEnum.SPORT]: 'Спорт',
	[EventTypeEnum.FESTIVAL]: 'Фестиваль',
	[EventTypeEnum.LECTURE]: 'Лекция',

	[EventTypeEnum.OTHER]: 'Другое',

	[EventTypeEnum.THEATRE]: 'Театр',
	[EventTypeEnum.MOVIE]: 'Кино',

	[EventTypeEnum.STANDUP]: 'Стендап',
	[EventTypeEnum.DANCE]: 'Танцы',
	[EventTypeEnum.BOOK_CLUB]: 'Книги',
	[EventTypeEnum.KARAOKE]: 'Караоке',
	[EventTypeEnum.CYBERSPORT]: 'Киберспорт',
	[EventTypeEnum.KIDS_EVENT]: 'Для детей'
}
export const EventTypeTranslations: Record<EventType, string> = {
	[EventType.BookClub]: 'Книжный клуб',
	[EventType.Concert]: 'Концерт',
	[EventType.Cybersport]: 'Киберспорт',
	[EventType.Dance]: 'Танцы',
	[EventType.Exhibition]: 'Выставка',
	[EventType.Festival]: 'Фестиваль',
	[EventType.Karaoke]: 'Караоке',
	[EventType.KidsEvent]: 'Для детей',
	[EventType.Lecture]: 'Лекция',
	[EventType.Meetup]: 'Встреча',
	[EventType.Movie]: 'Кино',
	[EventType.Other]: 'Другое',
	[EventType.Party]: 'Вечеринка',
	[EventType.Sport]: 'Спорт',
	[EventType.Standup]: 'Стендап',
	[EventType.Theatre]: 'Театр',
	[EventType.Walk]: 'Прогулка'
}

export const EventPropertyTranslations: Record<EventProperty, string> = {
	[EventProperty.Age_18Plus]: '18+',
	[EventProperty.Age_21Plus]: '21+',
	[EventProperty.AlcoholFree]: 'Без алкоголя',
	[EventProperty.Charity]: 'Благотворительное',
	[EventProperty.FamilyFriendly]: 'Для всей семьи',
	[EventProperty.HealthyLifestyle]: 'ЗОЖ',
	[EventProperty.Indoor]: 'В помещении',
	[EventProperty.Online]: 'Онлайн',
	[EventProperty.Outdoor]: 'На улице',
	[EventProperty.PetFriendly]: 'Можно с питомцами'
}
export const EventStatusTranslations: Record<EventStatus, string> = {
	[EventStatus.Archived]: 'Архивировано',
	[EventStatus.Cancelled]: 'Отменено',
	[EventStatus.Completed]: 'Завершено',
	[EventStatus.Ongoing]: 'Активное',
	[EventStatus.Upcoming]: 'Предстоящее'
}
export const PaymentTypeTranslations: Record<PaymentType, string> = {
	[PaymentType.Donation]: 'По желанию',
	[PaymentType.Free]: 'Бесплатно',
	[PaymentType.PaymentRequired]: 'Требуется оплата'
}

// Add this constant at the end of the file
export const NAVBAR_HEIGHT = 102 // in pixels

// Test users for development
export const testUsers = {
	tenant: {
		username: 'Carol White',
		userId: 'us-east-2:76543210-90ab-cdef-1234-567890abcdef',
		signInDetails: {
			loginId: 'carol.white@example.com',
			authFlowType: 'USER_SRP_AUTH'
		}
	},
	tenantRole: 'tenant',
	manager: {
		username: 'John Smith',
		userId: 'us-east-2:12345678-90ab-cdef-1234-567890abcdef',
		signInDetails: {
			loginId: 'john.smith@example.com',
			authFlowType: 'USER_SRP_AUTH'
		}
	},
	managerRole: 'manager'
}
