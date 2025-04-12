import Image from 'next/image'
import Link from 'next/link'

import { HeaderMenu } from './HeaderMenu'

// import { Search } from './Search'

export function Header() {
	return (
		<header className='flex h-full items-center gap-x-4 border-b border-border bg-card p-4'>
			{/* <Logo /> */}
			<div className='flex items-center'>
				<Link href='/search'>
					<Image
						src='/logos/longlogoblwh.png'
						alt=' Logo'
						width={150}
						height={150}
						className=''
					/>
				</Link>
			</div>
			{/* <Search /> */}
			<HeaderMenu />
		</header>
	)
}
