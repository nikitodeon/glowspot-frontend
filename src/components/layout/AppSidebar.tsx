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
import React, { useEffect } from 'react'

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
	const { user } = useCurrent()
	const { open, openMobile, setOpenMobile, toggleSidebar } = useSidebar()
	const isAdmin = user?.isAdmin

	// Сбрасываем openMobile при переходе с мобилки
	useEffect(() => {
		const handler = () => {
			if (window.innerWidth >= 768 && openMobile) {
				setOpenMobile(false)
			}
		}
		window.addEventListener('resize', handler)
		return () => window.removeEventListener('resize', handler)
	}, [openMobile, setOpenMobile])

	const navLinks = [
		{ icon: Heart, label: 'Избранное', href: '/dashboard/favorites' },
		{ icon: PartyPopper, label: 'Участие', href: '/dashboard/attending' },
		{ icon: NotebookPen, label: 'Организация', href: '/dashboard/hosting' },
		{ icon: MapPinned, label: 'Карта', href: '/search' },
		{ icon: Settings, label: 'Настройки', href: '/dashboard/settings' },
		{ icon: House, label: 'Главная', href: '/' },
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

	const isOpen = open || openMobile

	return (
		<>
			{/* Гамбургер-кнопка только на мобилке */}
			<div className='fixed left-4 top-4 z-50 md:hidden'>
				<button onClick={toggleSidebar}>
					<Menu className='h-6 w-6 text-white' />
				</button>
			</div>

			{/* Блокающий фон при открытом мобильном сайдбаре */}
			{openMobile && (
				<div
					className='fixed inset-0 z-40 bg-black md:hidden'
					onClick={toggleSidebar}
				/>
			)}

			<Sidebar
				collapsible='icon'
				className='z-50'
				style={{ top: `${NAVBAR_HEIGHT + 15}px` }}
			>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<div
								className={cn(
									'mb-3 flex h-5 w-full items-center pt-3 md:min-h-[56px]',
									isOpen
										? 'justify-between md:px-6'
										: 'justify-center'
								)}
							>
								{isOpen ? (
									<>
										<h1 className='ml-5 text-xl font-bold text-white md:ml-0'>
											Управление
										</h1>
										<button
											className='ml-6 rounded-md p-2 hover:bg-gray-900 md:ml-0'
											onClick={toggleSidebar}
										>
											<X className='h-6 w-6 text-white' />
										</button>
									</>
								) : (
									<button
										className='rounded-md p-2 hover:bg-gray-900'
										onClick={toggleSidebar}
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
										onClick={
											openMobile
												? toggleSidebar
												: undefined
										}
										className={cn(
											'flex items-center transition-colors',
											isActive
												? 'border-l-4 border-white bg-black'
												: 'hover:bg-[#0d0d0d]',
											isOpen
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
														!isOpen && 'mx-auto'
													)}
												/>
												{isOpen && (
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
		</>
	)
}

export default AppSidebar
