import Image from 'next/image'

import { HeaderMenu } from './HeaderMenu'

export function HeaderWithProps({ text }: HeaderProps) {
	return (
		<header className='flex h-full items-center justify-between border-b border-border bg-card p-4'>
			<div className='flex flex-1 items-center'>
				<Image
					src='/logos/longlogoblwh.png'
					alt='Logo'
					width={150}
					height={150}
					className=''
				/>
			</div>

			<div className='flex flex-1 justify-center'>
				<h1 className='text-xl font-semibold text-white'>{text}</h1>
			</div>

			<div className='flex flex-1 justify-end'>
				<HeaderMenu />
			</div>
		</header>
	)
}
