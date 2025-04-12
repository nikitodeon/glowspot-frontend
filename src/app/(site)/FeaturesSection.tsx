'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			staggerChildren: 0.2
		}
	}
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 }
}

const FeaturesSection = () => {
	return (
		<motion.div
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true }}
			variants={containerVariants}
			className='bg-white px-6 py-24 sm:px-8 lg:px-12 xl:px-16'
		>
			<div className='mx-auto max-w-4xl xl:max-w-6xl'>
				<motion.h2
					variants={itemVariants}
					className='mx-auto mb-12 w-full text-center text-3xl font-bold sm:w-2/3'
				>
					Быстро найдите нужное мероприятие с помощью удобных
					фильтров!
				</motion.h2>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 xl:gap-16'>
					{[0, 1, 2].map(index => (
						<motion.div key={index} variants={itemVariants}>
							<FeatureCard
								imageSrc={`/landing-search${3 - index}.png`}
								title={
									[
										'Надежные и верифицированные организаторы',
										'Простота и удобство в поиске',
										'Фильтры помогут найти то, что вам нужно!'
									][index]
								}
								description={
									[
										'Где лучшие события? Там, где проверенные организаторы!',
										'Находите самые актуальные события поблизости в два клика с помощью интерактивной карты!',
										'Фильтруйте мероприятия по интересам, месту и организаторам!'
									][index]
								}
								showButton={index === 1}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</motion.div>
	)
}

const FeatureCard = ({
	imageSrc,
	title,
	description,
	showButton
}: {
	imageSrc: string
	title: string
	description: string
	showButton: boolean
}) => (
	<div className='text-center'>
		<div className='mb-4 flex h-48 items-center justify-center rounded-lg p-4'>
			<Image
				src={imageSrc}
				width={400}
				height={400}
				className='h-full w-full object-contain'
				alt={title}
			/>
		</div>
		<h3 className='mb-2 text-xl font-semibold'>{title}</h3>
		<p className='mb-4'>{description}</p>
		{/* {showButton && (
			<Link
				href='/search'
				className='mt-10 inline-block rounded border border-gray-300 px-4 py-2 hover:bg-gray-100'
				scroll={false}
			>
				Искать
			</Link>
		)} */}
	</div>
)

export default FeaturesSection
