'use client'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import {
	EventStatus,
	EventType,
	PaymentType,
	useGetFilteredEventsQuery
} from '@/graphql/generated/output'

import { useAppSelector } from '@/store/redux/redux'

import { getMediaSource } from '@/utils/get-media-source'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string

const Map = () => {
	const router = useRouter()
	const mapContainerRef = useRef<HTMLDivElement | null>(null)
	const mapRef = useRef<mapboxgl.Map | null>(null)
	const resizeObserverRef = useRef<ResizeObserver | null>(null)

	const filters = useAppSelector(state => state.global.filters)
	// const isFiltersFullOpen = useAppSelector(
	// 	state => state.global.isFiltersFullOpen
	// )

	const [shouldInitMap, setShouldInitMap] = useState(false)

	function isValidDate(date: Date): boolean {
		return !isNaN(date.getTime())
	}

	const queryVariables = {
		filter: {
			location: filters.location !== 'any' ? filters.location : undefined,
			status:
				filters.status !== 'any'
					? (filters.status as EventStatus)
					: undefined,
			paymentType:
				filters.paymentType !== 'any'
					? (filters.paymentType as PaymentType)
					: undefined,
			eventType:
				filters.eventType && filters.eventType !== 'any'
					? (filters.eventType as unknown as EventType)
					: undefined,
			priceRange: filters.priceRange.every(v => v === null)
				? undefined
				: filters.priceRange.filter((v): v is number => v !== null),
			currency: filters.currency !== 'any' ? filters.currency : undefined,
			dateRange:
				filters.dateRange &&
				(filters.dateRange[0] || filters.dateRange[1])
					? [
							filters.dateRange[0] &&
							isValidDate(new Date(filters.dateRange[0]))
								? new Date(filters.dateRange[0]).toISOString()
								: null,
							filters.dateRange[1] &&
							isValidDate(new Date(filters.dateRange[1]))
								? new Date(filters.dateRange[1]).toISOString()
								: null
						]
					: undefined
		}
	}

	const {
		data,
		loading: isLoading,
		error: isError
	} = useGetFilteredEventsQuery({
		variables: queryVariables
	})

	const events = data?.getAllEvents || []

	useEffect(() => {
		const timeout = setTimeout(() => setShouldInitMap(true), 100)
		return () => clearTimeout(timeout)
	}, [])

	useEffect(() => {
		if (!shouldInitMap || isLoading || isError || !events) return

		const map = new mapboxgl.Map({
			container: mapContainerRef.current!,
			style: 'mapbox://styles/nikitodeon/cm98gli8900i601qz6nno327g',
			center: filters.coordinates || [27.57, 53.9],
			zoom: 9
		})

		mapRef.current = map

		const handleEventClick = (eventId: string) => {
			router.push(`/search/event/${eventId}`, {
				scroll: false
			})
		}

		events.forEach(event => {
			const marker = createEventMarker(event, map, handleEventClick)
			const markerElement = marker.getElement()
			const path = markerElement.querySelector("path[fill='#3FB1CE']")
			if (path) path.setAttribute('fill', '#000000')
		})

		resizeObserverRef.current = new ResizeObserver(() => {
			map.resize()
		})

		if (mapContainerRef.current) {
			resizeObserverRef.current.observe(mapContainerRef.current)
		}

		return () => {
			map.remove()
			resizeObserverRef.current?.disconnect()
		}
	}, [shouldInitMap, isLoading, isError, events, filters.coordinates, router])

	if (isLoading)
		return (
			<div className='flex h-full items-center justify-center'>
				Загрузка карты...
			</div>
		)

	if (isError || !events)
		return (
			<div className='flex h-full items-center justify-center text-red-500'>
				Ошибка загрузки мероприятий
			</div>
		)

	return (
		<div className='relative grow basis-5/12 rounded-xl'>
			<div
				className='map-container rounded-xl transition-all duration-500 ease-in-out'
				ref={mapContainerRef}
				style={{
					height: '100%',
					width: '100%',
					minHeight: '500px'
				}}
			/>
		</div>
	)
}

const createEventMarker = (
	event: any,
	map: mapboxgl.Map,
	onClick: (eventId: string) => void
) => {
	// Форматируем дату и время
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short'
			// year: 'numeric'
		})
	}

	const formatTime = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const el = document.createElement('div')
	el.className = 'custom-marker '
	el.style.backgroundImage = 'url("/logos/glowpinsmile.png")'
	el.style.width = '32px'
	el.style.height = '40px'
	el.style.backgroundSize = 'cover'
	el.style.cursor = 'pointer'

	const popupContent = document.createElement('div')
	popupContent.className =
		'bg-black text-white border border-white/10 rounded-lg p-3'
	popupContent.innerHTML = `
	  <div class="flex items-start gap-3">
		<div class="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
		  <img 
			src="${getMediaSource(event.photoUrls[0])}" 
			alt="${event.title}"
			class="w-full h-full object-cover"
			onerror="this.src='/placeholder-event.jpg'"
		  />
		</div>
		<div class="flex-1 min-w-0">
		  <button 
			class="text-left font-medium text-white hover:text-white/80 transition-colors w-full"
			data-event-id="${event.id}"
			id="event-button-${event.id}"
		  >
			${event.title}
		  </button>
		  <div class="flex items-center mt-1 text-sm">
			<span class="text-white/80">
			  ${event.paymentType === 'FREE' ? '' : `${event.price} ${event.currency}`}
			</span>
			
			<span class="text-white/80 flex items-center   ">
			  <!-- SVG иконка календаря -->
			  <svg class=" w-[18px] h-[18px] mr-2   text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
			  </svg>
			  <span class="${event.paymentType === 'FREE' ? 'mr-[16px]' : ''}">
			  ${formatDate(event.startTime)}</span>
			  <!-- SVG иконка часов -->
			  <svg class="mr-1 ml-[-8px]  w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			  </svg>
			  ${formatTime(event.startTime)}
			</span>
		  </div>
		</div>
	  </div>
	`

	const button = popupContent.querySelector('button')
	button?.addEventListener('click', e => {
		e.preventDefault()
		e.stopPropagation()
		onClick(event.id)
	})

	const marker = new mapboxgl.Marker(el)
		.setLngLat([
			event.location.coordinates.longitude,
			event.location.coordinates.latitude
		])
		.setPopup(
			new mapboxgl.Popup({
				offset: 25,
				className: 'mapboxgl-popup-custom'
			}).setDOMContent(popupContent)
		)
		.addTo(map)

	return marker
}
export default Map
