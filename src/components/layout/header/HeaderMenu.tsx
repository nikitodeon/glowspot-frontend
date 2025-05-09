'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { Button } from '@/components/ui/commonAuth/Button'

import { useAuth } from '@/hooks/useAuth'

import { ProfileMenu } from './ProfileMenu'

export function HeaderMenu() {
	const t = useTranslations('layout.header.headerMenu')
	const { isAuthenticated, isHydrated } = useAuth()

	// Не рендерим ничего, пока Zustand не завершил гидратацию
	if (!isHydrated) {
		return <div className='ml-auto flex items-center gap-x-4' />
	}

	return (
		<div className='ml-auto flex items-center gap-x-4'>
			{isAuthenticated ? (
				<ProfileMenu />
			) : (
				<>
					<Link href='/account/login'>
						<Button variant='secondary'>{t('login')}</Button>
					</Link>
					<Link href='/account/create'>
						<Button>{t('register')}</Button>
					</Link>
				</>
			)}
		</div>
	)
}
