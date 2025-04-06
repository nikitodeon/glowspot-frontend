import {
	Bath,
	Building,
	Bus,
	Cable,
	Car,
	Castle,
	Cigarette,
	Dumbbell,
	Hammer,
	Home,
	LucideIcon,
	Maximize,
	Mountain,
	PawPrint,
	Phone,
	Sprout,
	Thermometer,
	Trees,
	Tv,
	VolumeX,
	Warehouse,
	Waves,
	Wifi
} from 'lucide-react'

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
	[EventTypeEnum.EXHIBITION]: Home,
	[EventTypeEnum.MEETUP]: Home,
	[EventTypeEnum.WALK]: Home,
	[EventTypeEnum.PARTY]: Home,
	[EventTypeEnum.CONCERT]: Home,
	[EventTypeEnum.SPORT]: Home,
	[EventTypeEnum.FESTIVAL]: Home,
	[EventTypeEnum.LECTURE]: Home,

	[EventTypeEnum.OTHER]: Home,
	[EventTypeEnum.MOVIE]: Home,
	[EventTypeEnum.THEATRE]: Home,

	[EventTypeEnum.STANDUP]: Home,
	[EventTypeEnum.DANCE]: Home,
	[EventTypeEnum.BOOK_CLUB]: Home,
	[EventTypeEnum.KARAOKE]: Home,
	[EventTypeEnum.CYBERSPORT]: Home,
	[EventTypeEnum.KIDS_EVENT]: Home
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

export const EventTypeLabelsRu: Record<EventTypeEnum, string> = {
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

// Add this constant at the end of the file
export const NAVBAR_HEIGHT = 52 // in pixels

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
