import { motion } from 'framer-motion'

interface RotatingLogoProps {
	backgroundSrc: string
	foregroundSrc: string
	size?: number
}

const RotatingLogo = ({
	backgroundSrc,
	foregroundSrc,
	size = 150
}: RotatingLogoProps) => {
	return (
		<div
			className='relative flex items-center justify-center'
			style={{ width: 140, height: 140 }}
		>
			{/* Фоновая (вращающаяся) картинка */}
			<motion.img
				src={backgroundSrc}
				alt='Background'
				className='absolute'
				style={{ width: 140, height: 140 }}
				animate={{ rotate: 360 }}
				transition={{ repeat: Infinity, duration: 100, ease: 'linear' }}
			/>

			{/* Передняя (неподвижная) картинка */}
			<img
				src={foregroundSrc}
				alt='Foreground'
				className='absolute'
				style={{ width: 88, height: 64 }}
			/>
		</div>
	)
}

export default RotatingLogo
