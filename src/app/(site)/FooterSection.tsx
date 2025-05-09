import {
	faFacebook,
	faInstagram,
	faLinkedin,
	faTwitter,
	faYoutube
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const FooterSection = () => {
	return (
		<footer className='border-t border-gray-200 py-20'>
			<div className='mx-auto max-w-4xl px-6 sm:px-8'>
				<div className='flex flex-col items-center justify-evenly md:flex-row'>
					<nav className='mb-4'>
						<ul className='flex space-x-6 text-white'>
							<li>О нас</li>
							<li>Связаться</li>
							<li>FAQ</li>
						</ul>
					</nav>
					<div className='mb-4 flex space-x-4 text-white'>
						<a
							href='#'
							aria-label='Facebook'
							className='hover:text-primary-600'
						>
							<FontAwesomeIcon
								icon={faFacebook}
								className='h-6 w-6'
							/>
						</a>
						<a
							href='#'
							aria-label='Instagram'
							className='hover:text-primary-600'
						>
							<FontAwesomeIcon
								icon={faInstagram}
								className='h-6 w-6'
							/>
						</a>
						<a
							href='#'
							aria-label='Twitter'
							className='hover:text-primary-600'
						>
							<FontAwesomeIcon
								icon={faTwitter}
								className='h-6 w-6'
							/>
						</a>
						<a
							href='#'
							aria-label='Linkedin'
							className='hover:text-primary-600'
						>
							<FontAwesomeIcon
								icon={faLinkedin}
								className='h-6 w-6'
							/>
						</a>
						<a
							href='#'
							aria-label='Youtube'
							className='hover:text-primary-600'
						>
							<FontAwesomeIcon
								icon={faYoutube}
								className='h-6 w-6'
							/>
						</a>
					</div>
				</div>
				<div className='mt-8 flex justify-center space-x-4 text-center text-sm text-gray-500'>
					<span>© GLOWSPOT. All rights reserved.</span>

					<div>Условия использования</div>
					<div> Политика файлов сookie</div>
				</div>
			</div>
		</footer>
	)
}

export default FooterSection
