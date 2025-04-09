// components/ui/commonApp/dialog.tsx
import { Cross2Icon } from '@radix-ui/react-icons'
import * as React from 'react'

const Dialog = ({ children, open, onOpenChange }: any) => {
	return (
		<div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
			{children}
		</div>
	)
}

const DialogOverlay = ({ children, className }: any) => {
	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${className}`}
		>
			{children}
		</div>
	)
}

const DialogContent = ({ children, className }: any) => {
	return (
		<div className={`relative mx-auto my-10 w-full ${className}`}>
			{children}
		</div>
	)
}

export { Dialog, DialogOverlay, DialogContent }
