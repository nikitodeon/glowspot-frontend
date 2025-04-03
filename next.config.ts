import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts')

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'example.com',
				port: '',
				pathname: '/**'
			},
			{
				protocol: 'https',
				hostname: '5375df3e-5c53-487e-bb4b-4d88babc32ca.selstorage.ru'
			}
		]
	}
}

export default withNextIntl(nextConfig)
