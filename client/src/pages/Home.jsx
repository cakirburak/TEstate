import React, { useState, useEffect } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { FaLocationDot, FaBed, FaBath, FaCouch, FaCarSide } from 'react-icons/fa6'

import { Link, useNavigate } from 'react-router-dom'

export default function Home() {

	const [offerListings, setOfferListings] = useState([])
	const [saleListings, setSaleListings] = useState([])
	const [rentListings, setRentListings] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch('/api/listing/get?offer=true&limit=4')
				const data = await res.json()
				setOfferListings(data)
				fetchRentListings()
			} catch (error) {
				console.log(error)
			}
		}

		const fetchRentListings = async () => {
			try {
				const res = await fetch('/api/listing/get?type=rent&limit=4')
				const data = await res.json()
				setRentListings(data)
				fetchSaleListings()
			} catch (error) {
				console.log(error)
			}
		}

		const fetchSaleListings = async () => {
			try {
				const res = await fetch('/api/listing/get?type=sale&limit=4')
				const data = await res.json()
				setSaleListings(data)
			} catch (error) {
				log(error)
			}
		}
		fetchOfferListings()
	}, [])

	return (
		<div>
			<div className="relative w-full">
				<img className='select-none relative' src="https://imgtr.ee/images/2024/01/23/6bdd5be21af549fdc84b24b73fbc1415.jpeg" alt="Banner" />
				<Link
					to={'/search?searchTerm='}
					className='flex  items-center gap-2 absolute left-1/2 transform -translate-x-1/2 bottom-5 sm:bottom-16 md:bottom-32 border border-slate-700  text-sm sm:text-lg text-slate-600 bg-slate-200 hover:bg-slate-300 px-2 py-1 sm:px-4 sm:py-2 rounded-lg'>
					Start Browsing Now <FaArrowRight />
				</Link>
			</div>
			<div className='max-w-8xl mx-auto p-3 flex flex-col gap-8 my-10'>
				{offerListings && offerListings.length > 0 && (
					<div>
						<div className='mb-7 text-center'>
							<h2 className='text-3xl font-semibold text-slate-600'>Recent offers</h2>
						</div>
						<div className='flex flex-wrap gap-4 justify-center'>
							{offerListings.map((listing) => (
								<div className="w-full bg-slate-200 sm:w-80 shadow-md hover:shadow-xl hover:cursor-pointer rounded-lg mb-2" key={listing._id}
									onClick={() => { navigate(`/listing/${listing._id}`) }}
								>
									<img src={listing.imageUrls[0]} className='w-full h-60 object-cover rounded-t-lg' alt="" />
									<div className="space-y-2 p-3">
										<h3 className="text-xl font-semibold text-nowrap truncate">
											{listing.title}
										</h3>
										<p className="flex items-center gap-2 sm:mb-4 truncate"><FaLocationDot />{listing.address}</p>
										<p className="text-gray-600 line-clamp-3 text-sm min-h-auto sm:min-h-16">
											{listing.description}
										</p>
										<div className="flex flex-row gap-1 text-slate-800 text-lg">
											$<p className={`${listing.offer ? 'line-through' : ''}`}>{listing.regularPrice}{listing.type === 'rent' && !listing.offer ? <span className="italic"> / month</span> : ''}</p>
											{!listing.offer ? null : <p>-</p>}
											{!listing.offer ? null :
												<p>{listing.discountPrice}{listing.type === 'rent' ? <span className="italic"> / month</span> : ''}</p>
											}
										</div>
										<div className="flex flex-row gap-5">
											<p className='flex items-center gap-1 text-lg'>{listing.bedrooms}<FaBed /></p>
											<p className='flex items-center gap-1 text-lg'>{listing.bathrooms}<FaBath /></p>
											{listing.furnished && <p className='flex items-center gap-2 text-lg'> <FaCouch /></p>}
											{listing.parking && <p className='flex items-center gap-2 text-lg'> <FaCarSide /></p>}

										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				<hr className='mx-4' />
				{rentListings && rentListings.length > 0 && (
					<div className=''>
						<div className='mb-7 text-center'>
							<h2 className='text-3xl font-semibold text-slate-600'>Recent places for rent</h2>
						</div>
						<div className='flex flex-wrap gap-4 justify-center'>
							{rentListings.map((listing) => (
								<div className="w-full bg-slate-200 sm:w-80 shadow-md hover:shadow-xl hover:cursor-pointer rounded-lg mb-2" key={listing._id}
									onClick={() => { navigate(`/listing/${listing._id}`) }}
								>
									<img src={listing.imageUrls[0]} className='w-full h-60 object-cover rounded-t-lg' alt="" />
									<div className="space-y-2 p-3">
										<h3 className="text-xl font-semibold text-nowrap truncate">
											{listing.title}
										</h3>
										<p className="flex items-center gap-2 sm:mb-4 truncate"><FaLocationDot />{listing.address}</p>
										<p className="text-gray-600 line-clamp-3 text-sm min-h-auto sm:min-h-16">
											{listing.description}
										</p>
										<div className="flex flex-row gap-1 text-slate-800 text-lg">
											$<p className={`${listing.offer ? 'line-through' : ''}`}>{listing.regularPrice}{listing.type === 'rent' && !listing.offer ? <span className="italic"> / month</span> : ''}</p>
											{!listing.offer ? null : <p>-</p>}
											{!listing.offer ? null :
												<p>{listing.discountPrice}{listing.type === 'rent' ? <span className="italic"> / month</span> : ''}</p>
											}
										</div>
										<div className="flex flex-row gap-5">
											<p className='flex items-center gap-1 text-lg'>{listing.bedrooms}<FaBed /></p>
											<p className='flex items-center gap-1 text-lg'>{listing.bathrooms}<FaBath /></p>
											{listing.furnished && <p className='flex items-center gap-2 text-lg'> <FaCouch /></p>}
											{listing.parking && <p className='flex items-center gap-2 text-lg'> <FaCarSide /></p>}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				<hr className='mx-4' />
				{saleListings && saleListings.length > 0 && (
					<div className=''>
						<div className='mb-7 text-center'>
							<h2 className='text-3xl font-semibold text-slate-600'>Recent places for sale</h2>
						</div>
						<div className='flex flex-wrap gap-4 justify-center'>
							{saleListings.map((listing) => (
								<div className="w-full bg-slate-200 sm:w-80 shadow-md hover:shadow-xl hover:cursor-pointer rounded-lg mb-2" key={listing._id}
									onClick={() => { navigate(`/listing/${listing._id}`) }}
								>
									<img src={listing.imageUrls[0]} className='w-full h-60 object-cover rounded-t-lg' alt="" />
									<div className="space-y-2 p-3">
										<h3 className="text-xl font-semibold text-nowrap truncate">
											{listing.title}
										</h3>
										<p className="flex items-center gap-2 sm:mb-4 truncate"><FaLocationDot />{listing.address}</p>
										<p className="text-gray-600 line-clamp-3 text-sm min-h-auto sm:min-h-16">
											{listing.description}
										</p>
										<div className="flex flex-row gap-1 text-slate-800 text-lg">
											$<p className={`${listing.offer ? 'line-through' : ''}`}>{listing.regularPrice}{listing.type === 'rent' && !listing.offer ? <span className="italic"> / month</span> : ''}</p>
											{!listing.offer ? null : <p>-</p>}
											{!listing.offer ? null :
												<p>{listing.discountPrice}{listing.type === 'rent' ? <span className="italic"> / month</span> : ''}</p>
											}
										</div>
										<div className="flex flex-row gap-5">
											<p className='flex items-center gap-1 text-lg'>{listing.bedrooms}<FaBed /></p>
											<p className='flex items-center gap-1 text-lg'>{listing.bathrooms}<FaBath /></p>
											{listing.furnished && <p className='flex items-center gap-2 text-lg'> <FaCouch /></p>}
											{listing.parking && <p className='flex items-center gap-2 text-lg'> <FaCarSide /></p>}

										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
