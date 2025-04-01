import type { PropsWithChildren } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '../commonAuth/Card'

interface FormWrapperProps {
	heading: string
}

export function FormWrapper({
	children,
	heading
}: PropsWithChildren<FormWrapperProps>) {
	return (
		<Card>
			<CardHeader className='p-4'>
				<CardTitle className='text-lg'>{heading}</CardTitle>
			</CardHeader>
			<CardContent className='p-0'>{children}</CardContent>
		</Card>
	)
}
