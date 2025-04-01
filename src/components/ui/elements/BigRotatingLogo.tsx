import { motion } from 'framer-motion'

interface RotatingLogoProps {
	backgroundSrc: string
	foregroundSrc: string
}

const BigRotatingLogo = ({
	backgroundSrc,
	foregroundSrc
}: RotatingLogoProps) => {
	return (
		<div className='justify-centeк relative flex h-[800px] w-[1200px] items-center overflow-hidden'>
			{/* Фоновая (вращающаяся) картинка */}
			<motion.img
				src={backgroundSrc}
				alt='Background'
				className='absolute h-full w-full object-contain'
				animate={{ rotate: 360 }}
				transition={{
					repeat: Infinity,
					duration: 100,
					ease: 'linear'
				}}
			/>

			{/* Передняя (неподвижная) картинка */}
			{/* <img
        src={foregroundSrc}
        alt='Foreground'
        className='absolute'
        style={{ width: 110, height: 87 }}
      /> */}
		</div>
	)
}

export default BigRotatingLogo
