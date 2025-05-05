import Link from 'next/link'
import { PropsWithChildren } from 'react'

import { Button } from '@/components/ui/commonAuth/Button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/components/ui/commonAuth/Card'
import RotatingLogo from '@/components/ui/elements/RotatingLogo'

interface AuthWrapperProps {
	heading: string
	backButtonLabel?: string
	backButtonHref?: string
}

export function AuthWrapper({
	children,
	heading,
	backButtonLabel,
	backButtonHref
}: PropsWithChildren<AuthWrapperProps>) {
	return (
		<div className='flex h-full items-center justify-center'>
			<Card className='w-[350px] sm:w-[450px]'>
				<CardHeader className='flex-row items-center justify-center gap-x-4'>
					<RotatingLogo
						backgroundSrc={'/logos/bglogoblwh.png'}
						foregroundSrc={'/logos/frlogoblwh.png'}
					/>
				</CardHeader>
				<CardContent>{children}</CardContent>
				<CardFooter className='-mt-2'>
					{backButtonLabel && backButtonHref && (
						<Link href={backButtonHref} className='w-full'>
							<Button
								variant='ghost'
								className='w-full hover:bg-black'
							>
								{backButtonLabel}
							</Button>
						</Link>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
