import React from 'react'

import CallToActionSection from './CallToActionSection'
import FeaturesSection from './FeaturesSection'
import FooterSection from './FooterSection'
import HeroSection from './HeroSection'

const Home = () => {
	return (
		<div>
			<HeroSection />
			<FeaturesSection />

			<CallToActionSection />
			<FooterSection />
		</div>
	)
}

export default Home
