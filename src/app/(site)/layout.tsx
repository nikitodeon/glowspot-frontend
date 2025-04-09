'use client'

import { useParams, usePathname } from 'next/navigation'
import { type PropsWithChildren, useEffect } from 'react'

import { HeaderWithProps } from '@/components/layout/header/HeaderWithProps'

import { useGetEventByIdLazyQuery } from '@/graphql/generated/output'

import StoreProvider from '@/store/redux/redux'

export default function SiteLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const pathname = usePathname()
	const params = useParams()
	const eventId = params.id as string | undefined

	// Используем lazy query
	const [getEventById, { data, loading: eventLoading }] =
		useGetEventByIdLazyQuery()

	// Вызываем запрос только при изменении eventId
	useEffect(() => {
		if (eventId) {
			getEventById({ variables: { getEventByIdId: eventId } })
		}
	}, [eventId, getEventById])

	const title = data?.getEventById?.title || ''

	const headerTexts: Record<string, string> = {
		'/dashboard/hosting': 'Организация мероприятий',
		'/dashboard/attending': 'Участие в мероприятиях',
		'/dashboard/favorites': 'Избранное',
		'/dashboard/settings': 'Настройки',
		'/search': 'Мероприятия на карте',

		...(eventId ? { [`/dashboard/hosting/${eventId}`]: title } : {}),
		...(eventId ? { [`/dashboard/attending/${eventId}`]: title } : {}),
		...(eventId ? { [`/dashboard/favorites/${eventId}`]: title } : {})
	}

	const headerText = headerTexts[pathname]

	return (
		<div className='flex h-full flex-col'>
			<div className='flex-1'>
				<div className='fixed inset-y-0 z-50 h-[65px] w-full'>
					<HeaderWithProps text={headerText} />
				</div>
				<StoreProvider>{children}</StoreProvider>
			</div>
		</div>
	)
}
