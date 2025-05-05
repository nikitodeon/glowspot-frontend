'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Check, Loader2, Search, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/commonApp/button'
import { Checkbox } from '@/components/ui/commonApp/checkbox'
import { Input } from '@/components/ui/commonApp/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/commonAuth/Table'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/components/ui/commonAuth/Tabs'

import { useCurrent } from '@/hooks/useCurrent'

interface User {
	id: string
	email: string
	username: string
	displayName: string
	isVerified: boolean
}

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_REST_SERVER_URL,
	withCredentials: true
})

const OrganizersVerificationTabs = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedUsers, setSelectedUsers] = useState<string[]>([])
	const [tab, setTab] = useState('search')
	const [page, setPage] = useState(1)
	const itemsPerPage = 10

	const {
		data: searchResults,
		isLoading: isSearching,
		refetch: searchUsers
	} = useQuery({
		queryKey: ['search-users', searchTerm],
		queryFn: async () => {
			const { data } = await api.get(
				'/api/organizers/verification/users',
				{
					params: {
						email: searchTerm || undefined,
						username: searchTerm || undefined,
						skip: 0,
						take: itemsPerPage
					}
				}
			)
			return data as User[]
		},
		enabled: false
	})

	const {
		data: latestOrganizers,
		isLoading: isLoadingLatest,
		refetch: refetchLatest
	} = useQuery({
		queryKey: ['latest-organizers', page],
		queryFn: async () => {
			const { data } = await api.get(
				'/api/organizers/verification/users',
				{
					params: {
						skip: (page - 1) * itemsPerPage,
						take: itemsPerPage,
						isVerified: false
					}
				}
			)
			return data as User[]
		}
	})

	const { mutate: verifyUsers, isPending: isVerifying } = useMutation({
		mutationFn: async (verify: boolean) => {
			await Promise.all(
				selectedUsers.map(userId =>
					api.post('/api/organizers/verification', {
						userId,
						isVerified: verify
					})
				)
			)
		},
		onSuccess: () => {
			toast.success(
				selectedUsers.length > 1
					? 'Пользователи обновлены'
					: 'Пользователь обновлен',
				{
					style: {
						background: '#1a1a1a',
						color: '#fff',
						border: 'none'
					}
				}
			)
			setSelectedUsers([])
			searchUsers()
			refetchLatest()
		},
		onError: () =>
			toast.error('Ошибка при обновлении', {
				style: { background: '#1a1a1a', color: '#fff', border: 'none' }
			})
	})

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		searchUsers()
	}

	const toggleUserSelection = (userId: string) => {
		setSelectedUsers(prev =>
			prev.includes(userId)
				? prev.filter(id => id !== userId)
				: [...prev, userId]
		)
	}

	const loadMore = () => {
		setPage(prev => prev + 1)
	}
	const { user, isLoadingProfile } = useCurrent()
	if (isLoadingProfile || !user) {
		return (
			<div className='flex items-center justify-center bg-black p-6 text-gray-200'>
				<Loader2 className='animate-spin' />
			</div>
		)
	}

	if (!user.isAdmin) {
		return (
			<div className='flex items-center justify-center bg-black p-6 text-gray-200'>
				Доступ запрещен. Требуются права администратора
			</div>
		)
	}

	return (
		<div className='bg-black p-4 text-gray-200'>
			<Tabs
				value={tab}
				onValueChange={setTab}
				className='space-y-4 sm:w-full md:min-w-[500px]'
			>
				<TabsList className='grid grid-cols-2 gap-2 p-1 sm:max-w-md sm:gap-4'>
					<TabsTrigger
						value='search'
						className='py-1 text-xs data-[state=active]:border-[1px] data-[state=active]:bg-black data-[state=active]:text-white sm:py-2 sm:text-sm'
					>
						Поиск
					</TabsTrigger>
					<TabsTrigger
						value='latest'
						className='py-1 text-xs data-[state=active]:border-[1px] data-[state=active]:bg-black data-[state=active]:text-white sm:py-2 sm:text-sm'
					>
						Последние
					</TabsTrigger>
				</TabsList>

				<TabsContent value='search' className='space-y-4'>
					<form
						onSubmit={handleSearch}
						className='flex flex-wrap gap-2'
					>
						<Input
							className='flex-1 border-[2px] border-gray-600 bg-black text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-600 sm:text-base'
							placeholder='Поиск по email или имени'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
						<Button
							type='submit'
							className='bg-white hover:bg-gray-700'
							disabled={isSearching}
						>
							{isSearching ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<Search className='h-4 w-4' />
							)}
						</Button>
					</form>

					{searchResults && (
						<div className='space-y-4'>
							<div className='flex flex-wrap gap-2'>
								<Button
									variant='outline'
									className='bg-emerald-900/50 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-900 hover:text-emerald-300 sm:px-4 sm:py-2 sm:text-sm'
									onClick={() => verifyUsers(true)}
									disabled={
										selectedUsers.length === 0 ||
										isVerifying
									}
								>
									<Check className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
									Верифицировать
								</Button>
								<Button
									variant='outline'
									className='bg-red-900/50 px-2 py-1 text-xs text-red-400 hover:bg-red-900 hover:text-red-300 sm:px-4 sm:py-2 sm:text-sm'
									onClick={() => verifyUsers(false)}
									disabled={
										selectedUsers.length === 0 ||
										isVerifying
									}
								>
									<X className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
									Снять
								</Button>
							</div>

							<div className='overflow-x-auto rounded-lg border border-gray-800'>
								<Table className='min-w-full'>
									<TableHeader className='bg-black'>
										<TableRow>
											<TableHead className='w-8 px-2 text-xs text-gray-400 sm:w-12 sm:px-4 sm:text-sm'>
												Выбрать
											</TableHead>
											<TableHead className='px-2 text-xs text-gray-400 sm:px-4 sm:text-sm'>
												Email
											</TableHead>
											<TableHead className='px-2 text-xs text-gray-400 sm:px-4 sm:text-sm'>
												Имя
											</TableHead>
											<TableHead className='px-2 text-xs text-gray-400 sm:px-4 sm:text-sm'>
												Статус
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{searchResults.map(user => (
											<TableRow
												key={user.id}
												className='hover:bg-black'
											>
												<TableCell className='px-2 sm:px-4'>
													<Checkbox
														checked={selectedUsers.includes(
															user.id
														)}
														onCheckedChange={() =>
															toggleUserSelection(
																user.id
															)
														}
														className='h-4 w-4 border-gray-700 data-[state=checked]:bg-gray-600'
													/>
												</TableCell>
												<TableCell className='px-2 text-xs sm:px-4 sm:text-sm'>
													<div className='max-w-[100px] truncate sm:max-w-none'>
														{user.email}
													</div>
												</TableCell>
												<TableCell className='px-2 text-xs sm:px-4 sm:text-sm'>
													<div className='max-w-[80px] truncate sm:max-w-none'>
														{user.displayName ||
															user.username}
													</div>
												</TableCell>
												<TableCell className='px-2 text-xs sm:px-4 sm:text-sm'>
													{user.isVerified ? (
														<span className='text-emerald-400'>
															Подтв.
														</span>
													) : (
														<span className='text-yellow-500'>
															Не подтв.
														</span>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
					)}
				</TabsContent>

				<TabsContent value='latest' className='space-y-4'>
					{isLoadingLatest ? (
						<div className='flex justify-center py-8'>
							<Loader2 className='h-8 w-8 animate-spin text-gray-600' />
						</div>
					) : (
						<>
							<div className='flex justify-center'>
								<Button
									variant='outline'
									className='bg-emerald-900/50 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-900 hover:text-emerald-300 sm:px-4 sm:py-2 sm:text-sm'
									onClick={() => verifyUsers(true)}
									disabled={
										selectedUsers.length === 0 ||
										isVerifying
									}
								>
									<Check className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
									Верифицировать
								</Button>
							</div>

							<div className='overflow-x-auto rounded-lg border border-gray-800'>
								<Table className='min-w-full'>
									<TableHeader className='bg-black'>
										<TableRow>
											<TableHead className='w-8 px-2 text-xs text-gray-400 sm:w-12 sm:px-4 sm:text-sm'>
												Выбрать
											</TableHead>
											<TableHead className='px-2 text-xs text-gray-400 sm:px-4 sm:text-sm'>
												Email
											</TableHead>
											<TableHead className='px-2 text-xs text-gray-400 sm:px-4 sm:text-sm'>
												Имя
											</TableHead>
											<TableHead className='px-2 text-xs text-gray-400 sm:px-4 sm:text-sm'>
												Статус
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{latestOrganizers?.map(user => (
											<TableRow
												key={user.id}
												className='hover:bg-gray-900/50'
											>
												<TableCell className='px-2 sm:px-4'>
													<Checkbox
														checked={selectedUsers.includes(
															user.id
														)}
														onCheckedChange={() =>
															toggleUserSelection(
																user.id
															)
														}
														className='h-4 w-4 border-gray-700 data-[state=checked]:bg-gray-600'
													/>
												</TableCell>
												<TableCell className='px-2 text-xs sm:px-4 sm:text-sm'>
													<div className='max-w-[100px] truncate sm:max-w-none'>
														{user.email}
													</div>
												</TableCell>
												<TableCell className='px-2 text-xs sm:px-4 sm:text-sm'>
													<div className='max-w-[80px] truncate sm:max-w-none'>
														{user.displayName ||
															user.username}
													</div>
												</TableCell>
												<TableCell className='px-2 text-xs sm:px-4 sm:text-sm'>
													{user.isVerified ? (
														<span className='text-emerald-400'>
															Подтв.
														</span>
													) : (
														<span className='text-yellow-500'>
															Не подтв.
														</span>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							<Button
								variant='outline'
								className='ml-[10%] w-[80%] rounded-xl border-white px-2 py-1 text-xs text-white hover:bg-white/10 sm:ml-[25%] sm:w-[50%] sm:px-4 sm:py-2 sm:text-sm'
								onClick={loadMore}
								disabled={isLoadingLatest}
							>
								{isLoadingLatest ? (
									<Loader2 className='mx-auto h-4 w-4 animate-spin' />
								) : (
									'Загрузить еще'
								)}
							</Button>
						</>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default OrganizersVerificationTabs
