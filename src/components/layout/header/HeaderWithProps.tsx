import { Plus, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { HeaderMenu } from './HeaderMenu'

export function HeaderWithProps({ text }: HeaderProps) {
	return (
		<header className='flex h-full items-center justify-between border-b border-white/20 bg-black p-4'>
			<div className='flex flex-1 items-center'>
				<Link href='/search'>
					<Image
						src='/logos/longlogoblwh.png'
						alt='Logo'
						width={150}
						height={150}
						className=''
					/>
				</Link>
			</div>

			<div className='flex items-center justify-center gap-4'>
				<h1 className='text-xl font-semibold text-white'>{text}</h1>

				{text === 'Организация мероприятий' && (
					<Link
						href='/dashboard/hosting/create'
						className='flex items-center gap-1 rounded-full border border-white/20 bg-black px-3 py-1 text-sm font-medium text-white hover:bg-white/10'
					>
						<Plus className='h-4 w-4' />
						Создать мероприятие
					</Link>
				)}
				{/* {(text === 'Участие в мероприятиях' ||
					text === 'Избранное') && (
					<Link
						href='/dashboard/events/search'
						className='flex items-center gap-1 rounded-full border border-white/20 bg-black px-3 py-1 text-sm font-medium text-white hover:bg-white/10'
					>
						<Search className='h-4 w-4' />
						Искать мероприятие на карте
					</Link>
				)} */}
			</div>

			<div className='flex flex-1 justify-end'>
				<HeaderMenu />
			</div>
		</header>
	)
}
