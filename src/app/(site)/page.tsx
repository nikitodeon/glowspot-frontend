import React from 'react'

import CallToActionSection from './CallToActionSection'
import DiscoverSection from './DiscoverSection'
import FeaturesSection from './FeaturesSection'
import FooterSection from './FooterSection'
import HeroSection from './HeroSection'

const Home = () => {
	return (
		<div>
			<HeroSection />
			<FeaturesSection />
			{/* <DiscoverSection /> */}
			<CallToActionSection />
			<FooterSection />
		</div>
	)
}

export default Home
