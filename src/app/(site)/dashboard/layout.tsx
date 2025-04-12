'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'

import Sidebar from '@/components/layout/AppSidebar'
import { SidebarProvider } from '@/components/ui/commonApp/sidebar'

import { NAVBAR_HEIGHT } from '@/lib/constants'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<SidebarProvider>
			<QueryClientProvider client={queryClient}>
				<div className='bg-primary-100 minпп-h-screen w-full'>
					<div style={{ marginTop: `${NAVBAR_HEIGHT - 40}px` }}>
						<main className='flex'>
							<Sidebar />
							<div className='flex-grow transition-all duration-300'>
								{children}
							</div>
						</main>
					</div>
				</div>
			</QueryClientProvider>
		</SidebarProvider>
	)
}

export default DashboardLayout
