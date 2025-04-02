import Image from 'next/image'

import { HeaderMenu } from './HeaderMenu'

// import { Logo } from './Logo'
// import { Search } from './Search'

export function Header() {
// { title, subtitle }: HeaderProps
	return (
		<header className='flex h-full items-center gap-x-4 border-b border-border bg-card p-4'>
			{/* <Logo /> */}
			<div className='flex items-center'>
				<Image
					src='/logos/longlogoblwh.png'
					alt=' Logo'
					width={150}
					height={150}
					className=''
				/>
				{/* 
				<div className='mb-5'>
					<h1 className='text-xl font-semibold'>{title}</h1>
					<p className='mt-1 text-sm text-gray-500'>{subtitle}</p>
				</div> */}
				{/* <div className='text-xl font-bold text-primary'>
					RENT
					<span className='text-secondary-500 hover:!text-primary-300 font-light'>
						IFUL
					</span>
				</div> */}
			</div>
			{/* <Search /> */}
			<HeaderMenu />
		</header>
	)
}
