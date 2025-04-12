'use client'

import {
	CheckCircle,
	Heart,
	House,
	MapPinned,
	Menu,
	NotebookPen,
	PartyPopper,
	Settings,
	X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { useCurrent } from '@/hooks/useCurrent'

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '../ui/commonApp/sidebar'

import { NAVBAR_HEIGHT } from '@/lib/constants'
import { cn } from '@/lib/utils'

const AppSidebar = () => {
	const pathname = usePathname()
	const { toggleSidebar, open } = useSidebar()
	const { user } = useCurrent()
	const isAdmin = user?.isAdmin

	const navLinks = [
		{
			icon: Heart,
			label: 'Избранное',
			href: '/dashboard/favorites'
		},
		{
			icon: PartyPopper,
			label: 'Участие',
			href: '/dashboard/attending'
		},
		{
			icon: NotebookPen,
			label: 'Организация',
			href: '/dashboard/hosting'
		},
		{
			icon: MapPinned,
			label: 'Карта',
			href: '/search'
		},
		{
			icon: Settings,
			label: 'Настройки',
			href: '/dashboard/settings'
		},
		{
			icon: House,
			label: 'Главная',
			href: '/'
		},
		...(isAdmin
			? [
					{
						icon: CheckCircle,
						label: 'Верификация',
						href: '/dashboard/verify',
						isAdmin: true
					}
				]
			: [])
	]

	return (
		<Sidebar
			collapsible='icon'
			className='fixed left-0 border-r border-gray-900 bg-black'
			style={{
				top: `${NAVBAR_HEIGHT - 40}px`,
				height: `calc(100vh - ${NAVBAR_HEIGHT}px)`
			}}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<div
							className={cn(
								'mb-3 flex min-h-[56px] w-full items-center pt-3',
								open ? 'justify-between px-6' : 'justify-center'
							)}
						>
							{open ? (
								<>
									<h1 className='text-xl font-bold text-white'>
										Управление
									</h1>
									<button
										className='rounded-md p-2 hover:bg-gray-900'
										onClick={() => toggleSidebar()}
									>
										<X className='h-6 w-6 text-white' />
									</button>
								</>
							) : (
								<button
									className='rounded-md p-2 hover:bg-gray-900'
									onClick={() => toggleSidebar()}
								>
									<Menu className='h-6 w-6 text-gray-400' />
								</button>
							)}
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu>
					{navLinks.map(link => {
						const isActive = pathname === link.href

						return (
							<SidebarMenuItem key={link.href}>
								<SidebarMenuButton
									asChild
									className={cn(
										'flex items-center transition-colors',
										isActive
											? 'bgjj-[#1f2937] borderkk-[0.5px] border-l-4 border-white bg-black'
											: 'hover:bg-[#0d0d0d]',
										open
											? 'px-6 py-5'
											: 'justify-center p-5'
									)}
								>
									<Link
										href={link.href}
										className='w-full'
										scroll={false}
									>
										<div className='flex items-center gap-3'>
											<link.icon
												className={cn(
													'h-5 w-5',
													isActive
														? 'text-white'
														: 'text-gray-400',
													!open && 'mx-auto'
												)}
											/>
											{open && (
												<div className='flex flex-col'>
													<span
														className={cn(
															'font-medium',
															isActive
																? 'text-white'
																: 'text-gray-400'
														)}
													>
														{link.label}
													</span>
													{link.isAdmin && (
														<span className='mt-0.5 text-xs text-gray-500'>
															Админ
														</span>
													)}
												</div>
											)}
										</div>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	)
}

export default AppSidebar
