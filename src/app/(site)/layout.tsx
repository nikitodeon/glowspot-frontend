'use client'

import { useParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { HeaderWithProps } from '@/components/layout/header/HeaderWithProps'

import { useGetEventByIdLazyQuery } from '@/graphql/generated/output'

export default function SiteLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const pathname = usePathname()
	const params = useParams()
	const eventId = params.id as string | undefined

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
		'/dashboard/verify': 'Верификация организаторов',
		'/search': 'Мероприятия на карте',
		'/dashboard/hosting/create': 'Создание мероприятия',
		'/dashboard/hosting/edit': 'Редактирование мероприятия',
		...(eventId ? { [`/dashboard/hosting/${eventId}`]: title } : {}),
		...(eventId ? { [`/dashboard/attending/${eventId}`]: title } : {}),
		...(eventId ? { [`/dashboard/favorites/${eventId}`]: title } : {})
	}

	const headerText = headerTexts[pathname]

	return (
		<div className='overfhlow-hidden flex h-full flex-col'>
			<div className='flex-1'>
				<div className='fixed inset-y-0 z-50 h-[65px] w-full'>
					<HeaderWithProps text={headerText} />
				</div>
				{children}
			</div>
		</div>
	)
}
