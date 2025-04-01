import {
	faFacebook,
	faInstagram,
	faLinkedin,
	faTwitter,
	faYoutube
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

const FooterSection = () => {
	return (
		<footer className='border-t border-gray-200 py-20'>
			<div className='mx-auto max-w-4xl px-6 sm:px-8'>
				<div className='flex flex-col items-center justify-evenly md:flex-row'>
					{/* <div className='mb-4'>
						<Link
							href='/'
							className='text-xl font-bold text-white'
							scroll={false}
						>
							GLOWSPOTS
						</Link>
					</div> */}
					<nav className='mb-4'>
						<ul className='flex space-x-6 text-white'>
							<li>
								<Link href='/about'>О нас</Link>
							</li>
							<li>
								<Link href='/contact'>Связаться</Link>
							</li>
							<li>
								<Link href='/faq'>FAQ</Link>
							</li>
							{/* <li>
								<Link href='/terms'>Условия использования</Link>
							</li> */}
							{/* <li>
								<Link href='/privacy'>Privacy</Link>
							</li> */}
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
					<span>© GLOWSPOTS. All rights reserved.</span>
					{/* <Link href='/privacy'>Privacy Policy</Link> */}
					<Link href='/terms'>Условия использования</Link>
					<Link href='/cookies'>Политика файлов сookie </Link>
				</div>
			</div>
		</footer>
	)
}

export default FooterSection
