'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2
		}
	}
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 }
}

const DiscoverSection = () => {
	return (
		<motion.div
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true, amount: 0.8 }}
			variants={containerVariants}
			className='mb-16 bg-white py-12'
		>
			<div className='mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 xl:max-w-7xl xl:px-16'>
				<motion.div
					variants={itemVariants}
					className='my-12 text-center'
				>
					<h2 className='text-3xl font-semibold leading-tight text-gray-800'>
						Открывайте
					</h2>
					<p className='mt-4 text-lg text-gray-600'>
						Куда пойти? Мы знаем ответ!
					</p>
					<p className='mx-auto mt-2 max-w-3xl text-gray-500'></p>
				</motion.div>
				<div className='grid grid-cols-1 gap-8 text-center md:grid-cols-3 lg:gap-12 xl:gap-16'>
					{[
						{
							imageSrc: '/landing-icon-wand.png',
							title: '',
							description: ''
						},
						{
							imageSrc: '/landing-icon-calendar.png',
							title: '',
							description: ''
						},
						{
							imageSrc: '/landing-icon-heart.png',
							title: '',
							description: ''
						}
					].map((card, index) => (
						<motion.div key={index} variants={itemVariants}>
							<DiscoverCard {...card} />
						</motion.div>
					))}
				</div>
			</div>
		</motion.div>
	)
}

const DiscoverCard = ({
	imageSrc,
	title,
	description
}: {
	imageSrc: string
	title: string
	description: string
}) => (
	<div className='bg-primary-50 rounded-lg px-4 py-12 shadow-lg md:h-72'>
		<div className='bg-primary-700 mx-auto mb-4 h-10 w-10 rounded-full p-[0.6rem]'>
			<Image
				src={imageSrc}
				width={30}
				height={30}
				className='h-full w-full'
				alt={title}
			/>
		</div>
		<h3 className='mt-4 text-xl font-medium text-gray-800'>{title}</h3>
		<p className='mt-2 text-base text-gray-500'>{description}</p>
	</div>
)

export default DiscoverSection
