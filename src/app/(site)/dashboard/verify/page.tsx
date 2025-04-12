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
	const { user } = useCurrent()
	const isAdmin = user?.isAdmin
	if (!isAdmin) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-black p-6 text-gray-200'>
				Доступ запрещен. Требуются права администратора
			</div>
		)
	}
	return (
		<div className='min-h-screen bg-black p-6 text-gray-200'>
			<Tabs value={tab} onValueChange={setTab} className='space-y-4'>
				<TabsList className='grid w-full max-w-md grid-cols-2 gap-x-2 p-1'>
					<TabsTrigger
						value='search'
						className='data-[state=active]:border-[1px] data-[state=active]:bg-black data-[state=active]:text-white'
					>
						Поиск организаторов
					</TabsTrigger>
					<TabsTrigger
						value='latest'
						className='data-[state=active]:border-[1px] data-[state=active]:bg-black data-[state=active]:text-white'
					>
						Последние организаторы
					</TabsTrigger>
				</TabsList>

				<TabsContent value='search' className='space-y-4'>
					<form onSubmit={handleSearch} className='flex gap-2'>
						<Input
							className='flex-1 border-[2px] border-gray-600 bg-black text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-600'
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
								<Loader2 className='animate-spin' />
							) : (
								<Search className='' />
							)}
						</Button>
					</form>

					{searchResults && (
						<div className='space-y-4'>
							<div className='flex gap-2'>
								<Button
									variant='outline'
									className='bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900 hover:text-emerald-300'
									onClick={() => verifyUsers(true)}
									disabled={
										selectedUsers.length === 0 ||
										isVerifying
									}
								>
									<Check className='mr-2 h-4 w-4' />
									Верифицировать
								</Button>
								<Button
									variant='outline'
									className='bg-red-900/50 text-red-400 hover:bg-red-900 hover:text-red-300'
									onClick={() => verifyUsers(false)}
									disabled={
										selectedUsers.length === 0 ||
										isVerifying
									}
								>
									<X className='mr-2 h-4 w-4' />
									Снять верификацию
								</Button>
							</div>

							<div className='rounded-lg border border-gray-800'>
								<Table>
									<TableHeader className='bg-black'>
										<TableRow>
											<TableHead className='w-12 text-gray-400'>
												Выбрать
											</TableHead>
											<TableHead className='text-gray-400'>
												Email
											</TableHead>
											<TableHead className='text-gray-400'>
												Имя
											</TableHead>
											<TableHead className='text-gray-400'>
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
												<TableCell>
													<Checkbox
														checked={selectedUsers.includes(
															user.id
														)}
														onCheckedChange={() =>
															toggleUserSelection(
																user.id
															)
														}
														className='border-gray-700 data-[state=checked]:bg-gray-600'
													/>
												</TableCell>
												<TableCell>
													{user.email}
												</TableCell>
												<TableCell>
													{user.displayName ||
														user.username}
												</TableCell>
												<TableCell>
													{user.isVerified ? (
														<span className='text-emerald-400'>
															Подтвержден
														</span>
													) : (
														<span className='text-yellow-500'>
															Не подтвержден
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
									className='bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900 hover:text-emerald-300'
									onClick={() => verifyUsers(true)}
									disabled={
										selectedUsers.length === 0 ||
										isVerifying
									}
								>
									<Check className='mr-2 h-4 w-4' />
									Верифицировать выбранных
								</Button>
							</div>

							<div className='rounded-lg border border-gray-800'>
								<Table>
									<TableHeader className='bg-black'>
										<TableRow>
											<TableHead className='w-12 text-gray-400'>
												Выбрать
											</TableHead>
											<TableHead className='text-gray-400'>
												Email
											</TableHead>
											<TableHead className='text-gray-400'>
												Имя
											</TableHead>
											<TableHead className='text-gray-400'>
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
												<TableCell>
													<Checkbox
														checked={selectedUsers.includes(
															user.id
														)}
														onCheckedChange={() =>
															toggleUserSelection(
																user.id
															)
														}
														className='border-gray-700 data-[state=checked]:bg-gray-600'
													/>
												</TableCell>
												<TableCell>
													{user.email}
												</TableCell>
												<TableCell>
													{user.displayName ||
														user.username}
												</TableCell>
												<TableCell>
													{user.isVerified ? (
														<span className='text-emerald-400'>
															Подтвержден
														</span>
													) : (
														<span className='text-yellow-500'>
															Не подтвержден
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
								className='ml-[25%] w-[50%] rounded-xl border-white text-white hover:bg-white/10'
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
