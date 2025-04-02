import {
	Building,
	FileText,
	Heart,
	Home,
	Menu,
	Settings,
	X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

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

const AppSidebar = ({ userType }: AppSidebarProps) => {
	const pathname = usePathname()
	const { toggleSidebar, open } = useSidebar()

	const navLinks =
		userType === 'manager'
			? [
					{
						icon: Building,
						label: 'Properties',
						href: '/managers/properties'
					},
					{
						icon: FileText,
						label: 'Applications',
						href: '/managers/applications'
					},
					{
						icon: Settings,
						label: 'Settings',
						href: '/managers/settings'
					}
				]
			: [
					{
						icon: Heart,
						label: 'Любимые',
						href: '/dashboards/favorites'
					},
					{
						icon: FileText,
						label: 'Участвую',
						href: '/dashboard/attending'
					},
					{
						icon: Home,
						label: 'Организую',
						href: '/dashboard/hosting'
					},
					{
						icon: Settings,
						label: 'Настройки',
						href: '/dashboard/settings'
					}
				]

	return (
		<Sidebar
			collapsible='icon'
			className='fixed left-0 bg-black shadow-lg'
			style={{
				top: `${NAVBAR_HEIGHT}px`,
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
									<h1 className='text-xl font-bold text-[#7f8fa3]'>
										{userType === 'manager'
											? 'Manager View'
											: 'Renter View'}
									</h1>
									<button
										className='rounded-md p-2'
										onClick={() => toggleSidebar()}
									>
										<X className='h-6 w-6 text-[#7f8fa3]' />
									</button>
								</>
							) : (
								<button
									className='rounded-md p-2'
									onClick={() => toggleSidebar()}
								>
									<Menu className='h-6 w-6 text-[#7f8fa3]' />
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
											? 'ььborder ььborder-white ььbg-[#3c404e]'
											: 'hover:bgnn-gray-800',
										open
											? 'px-7 py-7'
											: 'justify-center p-7'
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
													'h-5 w-5 transition-colors',
													isActive
														? 'text-white'
														: 'text-[#7f8fa3]',
													!open && 'mx-auto ml-3' // Центрируем иконку в свернутом состоянии
												)}
											/>
											{open && ( // Показываем текст только когда сайдбар открыт
												<span
													className={cn(
														'font-medium transition-colors',
														isActive
															? 'text-white'
															: 'text-[#7f8fa3]'
													)}
												>
													{link.label}
												</span>
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
