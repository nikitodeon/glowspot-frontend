// components/MultiSelectWrapper.tsx
'use client'

import dynamic from 'next/dynamic'

// components/MultiSelectWrapper.tsx

const MultiSelect = dynamic(
	() => import('./Multiselect').then(mod => mod.MultiSelect),
	{
		ssr: false,
		loading: () => (
			<div className='h-[38px] w-full animate-pulse rounded-md bg-gray-800' />
		)
	}
)

export default MultiSelect
