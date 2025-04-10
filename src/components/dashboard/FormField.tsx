'use client'

import { registerPlugin } from 'filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { Edit, Plus, X } from 'lucide-react'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FilePond } from 'react-filepond'
import {
	ControllerRenderProps,
	FieldValues,
	useFieldArray,
	useFormContext
} from 'react-hook-form'

import { Button } from '@/components/ui/commonApp/button'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/commonApp/form'
import { Input } from '@/components/ui/commonApp/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/commonApp/select'
import { Switch } from '@/components/ui/commonApp/switch'
import { Textarea } from '@/components/ui/commonApp/textarea'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

interface FormFieldProps {
	name: string
	label: string
	type?:
		| 'text'
		| 'email'
		| 'textarea'
		| 'number'
		| 'select'
		| 'switch'
		| 'password'
		| 'file'
		| 'multi-input'
		| 'datetime-local'
		| 'tags'
		| 'datepicker'
		| 'title'
		| 'select-update'
		| 'select-update-new'
	// Добавлен новый тип
	placeholder?: string
	options?: { value: string; label: string }[]
	accept?: string
	className?: string
	labelClassName?: string
	inputClassName?: string
	value?: string
	disabled?: boolean
	multiple?: boolean
	isIcon?: boolean
	initialValue?: string | number | boolean | string[]
	min?: number
	max?: number
	showTimeSelect?: boolean // Добавлено для DatePicker
	dateFormat?: string // Добавлено для DatePicker
}

export const CustomFormField: React.FC<FormFieldProps> = ({
	name,
	label,
	type = 'text',
	placeholder,
	options,
	accept,
	className,
	inputClassName,
	labelClassName,
	disabled = false,
	multiple = false,
	isIcon = false,
	initialValue,
	min,
	max,
	showTimeSelect = true, // По умолчанию показываем выбор времени
	dateFormat = 'MMMM d, yyyy h:mm aa' // Формат по умолчанию
}) => {
	const { control } = useFormContext()

	const renderFormControl = (
		field: ControllerRenderProps<FieldValues, string>
	) => {
		switch (type) {
			case 'textarea':
				return (
					<Textarea
						placeholder={placeholder}
						{...field}
						maxLength={2000}
						rows={3}
						className={`border-gray-200 p-4 ${inputClassName}`}
					/>
				)
			case 'select':
				return (
					<Select
						value={field.value ?? (initialValue as string) ?? ''}
						defaultValue={field.value || (initialValue as string)}
						onValueChange={field.onChange}
					>
						<SelectTrigger
							className={`w-full border-gray-200 p-4 ${inputClassName}`}
						>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent className='w-full border-gray-200 bg-black text-white shadow'>
							{options?.map(option => (
								<SelectItem
									key={option.value}
									value={option.value}
									className='cursor-pointer hover:bg-gray-800 focus:bg-gray-800'
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)
			case 'select-update-new':
				return null
			case 'select-update':
				return (
					<Select value={field.value} onValueChange={field.onChange}>
						<SelectTrigger>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent className='w-full border-gray-200 bg-black text-white shadow'>
							{options?.map(option => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)
			case 'switch':
				return (
					<div className='flex items-center space-x-2'>
						<Switch
							checked={field.value}
							onCheckedChange={field.onChange}
							id={name}
							className={`text-customgreys-dirtyGrey ${inputClassName}`}
						/>
						<FormLabel htmlFor={name} className={labelClassName}>
							{label}
						</FormLabel>
					</div>
				)
			case 'file':
				return (
					<FilePond
						className={`${inputClassName}`}
						onupdatefiles={fileItems => {
							const files = fileItems.map(
								fileItem => fileItem.file
							)
							field.onChange(files)
						}}
						allowMultiple={true}
						labelIdle={`Drag & Drop your images or <span class="filepond--label-action">Browse</span>`}
						credits={false}
					/>
				)
			case 'number':
				return (
					<Input
						type='number'
						placeholder={placeholder}
						{...field}
						className={`border-gray-200 p-4 ${inputClassName}`}
						disabled={disabled}
						min={min}
						max={max}
					/>
				)
			case 'datetime-local':
				return (
					<Input
						type='datetime-local'
						placeholder={placeholder}
						{...field}
						className={`border-gray-200 p-4 ${inputClassName}`}
						disabled={disabled}
					/>
				)
			case 'datepicker':
				return (
					<div className='dark-datepicker'>
						<DatePicker
							selected={
								field.value ? new Date(field.value) : null
							}
							onChange={(date: Date | null) => {
								if (date) {
									field.onChange(date.toISOString())
								} else {
									field.onChange(null)
								}
							}}
							showTimeSelect={showTimeSelect}
							timeFormat='HH:mm'
							timeIntervals={15}
							dateFormat={dateFormat}
							className={`w-full rounded-md border border-white bg-black p-4 text-white ${inputClassName}`}
							placeholderText={placeholder}
							disabled={disabled}
							calendarClassName='!bg-black !border-white !text-white'
							dayClassName={() => 'hover:bg-gray-800 text-white'}
							weekDayClassName={() => 'text-white'}
							monthClassName={() => 'text-white'}
							timeClassName={() =>
								'bg-black text-white border-t border-white'
							}
							popperClassName='!bg-black !border-white'
							//   headerClassName="!bg-black !border-b-white"
							//   yearDropdownClassName="!bg-black !text-white"
							//   monthDropdownClassName="!bg-black !text-white"
							dropdownMode='select'
							renderCustomHeader={({
								monthDate,
								customHeaderCount,
								decreaseMonth,
								increaseMonth
							}) => (
								<div className='flex items-center justify-between bg-black px-2 py-1'>
									<button
										onClick={decreaseMonth}
										className='rounded p-1 text-white hover:bg-gray-800'
									>
										{'<'}
									</button>
									<span className='text-white'>
										{monthDate.toLocaleString('en-US', {
											month: 'long',
											year: 'numeric'
										})}
									</span>
									<button
										onClick={increaseMonth}
										className='rounded p-1 text-white hover:bg-gray-800'
									>
										{'>'}
									</button>
								</div>
							)}
						/>
					</div>
				)
			case 'multi-input':
				return (
					<MultiInputField
						name={name}
						control={control}
						placeholder={placeholder}
						inputClassName={inputClassName}
					/>
				)
			case 'tags':
				return (
					<MultiInputField
						name={name}
						control={control}
						placeholder={placeholder}
						inputClassName={inputClassName}
					/>
				)
			case 'title':
				return (
					<Input
						type={type}
						placeholder={placeholder}
						{...field}
						maxLength={50}
						className={`border-gray-200 p-4 ${inputClassName}`}
						disabled={disabled}
					/>
				)
			default:
				return (
					<Input
						type={type}
						placeholder={placeholder}
						{...field}
						className={`border-gray-200 p-4 ${inputClassName}`}
						disabled={disabled}
					/>
				)
		}
	}

	return (
		<FormField
			control={control}
			name={name}
			defaultValue={initialValue}
			render={({ field }) => (
				<FormItem
					className={`${
						type !== 'switch' && 'rounded-md'
					} relative ${className}`}
				>
					{type !== 'switch' && (
						<div className='flex items-center justify-between'>
							<FormLabel className={`text-sm ${labelClassName}`}>
								{label}
							</FormLabel>

							{!disabled &&
								isIcon &&
								type !== 'file' &&
								type !== 'multi-input' && (
									<Edit className='text-customgreys-dirtyGrey size-4' />
								)}
						</div>
					)}
					<FormControl>
						{renderFormControl({
							...field,
							value:
								field.value !== undefined
									? field.value
									: initialValue
						})}
					</FormControl>
					<FormMessage className='text-red-500' />
				</FormItem>
			)}
		/>
	)
}

interface MultiInputFieldProps {
	name: string
	control: any
	placeholder?: string
	inputClassName?: string
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({
	name,
	control,
	placeholder,
	inputClassName
}) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name
	})

	return (
		<div className='space-y-2'>
			{fields.map((field, index) => (
				<div key={field.id} className='flex items-center space-x-2'>
					<FormField
						control={control}
						name={`${name}.${index}`}
						render={({ field }) => (
							<FormControl>
								<Input
									{...field}
									placeholder={placeholder}
									className={`flex-1 border border-white bg-black p-4 ${inputClassName}`}
								/>
							</FormControl>
						)}
					/>
					<Button
						type='button'
						onClick={() => remove(index)}
						variant='ghost'
						size='icon'
						className='text-customgreys-dirtyGrey'
					>
						<X className='h-4 w-4' />
					</Button>
				</div>
			))}
			<Button
				type='button'
				onClick={() => append('')}
				variant='outline'
				size='sm'
				className='text-customgreys-dirtyGrey mt-2'
			>
				<Plus className='mr-2 h-4 w-4' />
				Добавить
			</Button>
		</div>
	)
}
