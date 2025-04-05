'use client'

import React from 'react'
import { Controller } from 'react-hook-form'
import Select from 'react-select'

interface MultiSelectProps {
	control: any
	name: string
	options: { value: string; label: string }[]
	label?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
	control,
	name,
	options,
	label
}) => {
	return (
		<div className='space-y-2'>
			{label && <label className='text-sm text-white'>{label}</label>}
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<Select
						isMulti
						options={options}
						value={options.filter(option =>
							field.value?.includes(option.value)
						)}
						onChange={selected => {
							field.onChange(
								selected?.map(option => option.value)
							)
						}}
						className='react-select-container'
						classNamePrefix='react-select'
						styles={{
							control: provided => ({
								...provided,
								backgroundColor: 'black',
								borderColor: 'white'
							}),
							menu: provided => ({
								...provided,
								backgroundColor: 'black'
							}),
							option: (provided, state) => ({
								...provided,
								backgroundColor: state.isFocused
									? 'rgb(31 41 55)'
									: 'black',
								color: 'white'
							}),
							multiValue: provided => ({
								...provided,
								backgroundColor: 'rgb(55 65 81)'
							}),
							multiValueLabel: provided => ({
								...provided,
								color: 'white'
							})
						}}
					/>
				)}
			/>
		</div>
	)
}
