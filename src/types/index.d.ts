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
}
export {}
