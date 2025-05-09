import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	split
} from '@apollo/client'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import Cookies from 'js-cookie'

import {
	SERVER_URL
	//  WEBSOCKET_URL
} from './constants/url.constants'

// Для работы с куками

loadErrorMessages()
loadDevMessages()

// Функция для получения сессии из куки
const getSessionFromCookie = () => {
	const session = Cookies.get('session') // Получаем сессию из куки
	return session ? `Bearer ${session}` : null
}
// const httpLink = createHttpLink({
// 	uri: process.env.NEXT_PUBLIC_SERVER_URL,
// 	credentials: 'include'
// })
const httpLink = createUploadLink({
	uri: SERVER_URL,
	credentials: 'include',
	headers: {
		'apollo-require-preflight': 'true'
	}
})

// const wsLink = new WebSocketLink({
// 	uri: WEBSOCKET_URL,
// 	options: {
// 		reconnect: true
// 	}
// })

// const splitLink = split(
// 	({ query }) => {
// 		const definition = getMainDefinition(query)

// 		return (
// 			definition.kind === 'OperationDefinition' &&
// 			definition.operation === 'subscription'
// 		)
// 	},
// 	wsLink,
// 	httpLink
// )

export const client = new ApolloClient({
	link: httpLink,
	uri: SERVER_URL,
	// link: splitLink,
	cache: new InMemoryCache({}),
	credentials: 'include', // Обеспечивает отправку кук с запросами
	headers: {
		'Content-Type': 'application/json',
		Authorization: getSessionFromCookie() || '' // Добавляем сессию из куки в заголовок
	}
})
