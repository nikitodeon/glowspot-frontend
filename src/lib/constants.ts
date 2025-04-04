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
	WORKSHOP = 'WORKSHOP',
	OTHER = 'OTHER'
}

export const EventTypeIcons: Record<EventTypeEnum, LucideIcon> = {
	// Rooms: Home,
	// Tinyhouse: Warehouse,
	// Apartment: Building,
	// Villa: Castle,
	// Townhouse: Home,
	// Cottage: Trees

	EXHIBITION: Home,
	MEETUP: Home,
	WALK: Home,
	PARTY: Home,
	CONCERT: Home,
	SPORT: Home,
	FESTIVAL: Home,
	LECTURE: Home,
	WORKSHOP: Home,
	OTHER: Home
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
