'use client'

// import { useGetAuthUserQuery } from "@/state/api";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'

import Sidebar from '@/components/layout/AppSidebar'
// import Navbar from '@/components/Navbar'
import { SidebarProvider } from '@/components/ui/commonApp/sidebar'

import { store } from '@/store/redux/store'

import { NAVBAR_HEIGHT } from '@/lib/constants'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	// const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
	const [queryClient] = useState(() => new QueryClient())
	const router = useRouter()
	const pathname = usePathname()
	const [isLoading, setIsLoading] = useState(true)

	// useEffect(() => {
	//   if (authUser) {
	//     const userRole = authUser.userRole?.toLowerCase();
	//     if (
	//       (userRole === "manager" && pathname.startsWith("/tenants")) ||
	//       (userRole === "tenant" && pathname.startsWith("/managers"))
	//     ) {
	//       router.push(
	//         userRole === "manager"
	//           ? "/managers/properties"
	//           : "/tenants/favorites",
	//         { scroll: false }
	//       );
	//     } else {
	//       setIsLoading(false);
	//     }
	//   }
	// }, [authUser, router, pathname]);

	// if (authLoading || isLoading) return <>Loading...</>;
	// if (!authUser?.userRole) return null;

	return (
		<SidebarProvider>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<div className='bg-primary-100 min-h-screen w-full'>
						{/* <Navbar /> */}
						<div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
							<main className='flex'>
								<Sidebar
									userType={
										'tenant'
										// authUser.userRole.toLowerCase()
									}
								/>
								<div className='flex-grow transition-all duration-300'>
									{children}
								</div>
							</main>
						</div>
					</div>
				</QueryClientProvider>
			</Provider>
		</SidebarProvider>
	)
}

export default DashboardLayout
