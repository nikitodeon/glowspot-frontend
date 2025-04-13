import * as React from 'react'

const Dialog = ({ children, open, onOpenChange }: any) => {
	return (
		<div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
			{children}
		</div>
	)
}

const DialogOverlay = ({ children, className, onClick }: any) => {
	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${className}`}
			onClick={onClick}
		>
			{children}
		</div>
	)
}

const DialogContent = React.forwardRef(
	({ children, className, onClick }: any, ref: any) => {
		return (
			<div
				ref={ref}
				className={`relative mx-auto my-10 w-full ${className}`}
				onClick={onClick}
			>
				{children}
			</div>
		)
	}
)

export { Dialog, DialogOverlay, DialogContent }
