'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CallToActionSection = () => {
	return (
		<div className='relative py-24'>
			<Image
				src='/landing-call-to-action.jpg'
				alt='Rentiful Search Section Background'
				fill
				className='object-cover object-center'
			/>
			<div className='absolute inset-0 bg-black bg-opacity-60'></div>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				transition={{ duration: 0.5 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className='relative mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12 xl:max-w-6xl xl:px-16'
			>
				<div className='flex flex-col items-center justify-between md:flex-row'>
					<div className='mb-6 md:mb-0 md:mr-10'>
						<h2 className='text-2xl font-bold text-white'>
							Найдите свое идеальное мероприятие сегодня!
						</h2>
					</div>
					<div>
						<p className='mb-3 text-white'>
							Огоньки на карте – ваш проводник в мир событий.
							Каждый день появляются мероприятия, и мы помогаем
							вам найти то, что вам нужно.
						</p>
						<div className='flex justify-center gap-4 md:justify-start'>
							<button
								onClick={() =>
									window.scrollTo({
										top: 0,
										behavior: 'smooth'
									})
								}
								className='text-primary-700 hover:bg-primary-500 inline-block rounded-lg bg-white px-6 py-3 font-semibold hover:bg-[] hover:bg-gray-200'
							>
								Найти!
							</button>
							<Link
								href='/signup'
								className='bg-secondary-500 hover:bg-secondary-600 inline-block rounded-lg border-2 border-black px-6 py-3 font-semibold text-white hover:bg-white/10'
								scroll={false}
							>
								Регистрация
							</Link>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	)
}

export default CallToActionSection
