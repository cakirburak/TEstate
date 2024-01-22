import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"
import { FaLocationDot } from "react-icons/fa6"

export default function Listing() {

	const [listing, setListing] = useState(null)
	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)
	const [landlord, setLandlord] = useState(null)
	const [currentIndex, setCurrentIndex] = useState(0)

	const params = useParams()

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" })
		const getListingAndLandlordInfo = async () => {
			try {
				const listingReq = await fetch(`/api/listing/get/${params.listingId}`)
				const listingData = await listingReq.json()

				if (listingData.success === false) {
					console.error("Could not get listing from the database!")
					setError("Something Went Wrong!")
					return
				}

				setListing(listingData)

				// Now that you have the listing, fetch landlord info
				const landlordReq = await fetch(`/api/user/get-user-info/${listingData.userRef}`)
				const landlordData = await landlordReq.json()

				if (landlordData.success === false) {
					console.log(landlordData.message)
					return
				}

				setLandlord(landlordData)
				setLoading(false)

			} catch (error) {
				console.error("An error occurred:", error)
				setError("Something Went Wrong!")
			}
		}

		// Call the combined function to get listing and landlord info
		getListingAndLandlordInfo()
	}, [])

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % listing.imageUrls.length)
	}

	const prevSlide = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? listing.imageUrls.length - 1 : prevIndex - 1
		)
	}

	const handleSendEmail = () => {
		// Replace 'mailto:' with the recipient's email address
		const emailTo = landlord.email
		const subject = `Information Request for Your Listing on TEstate - ${listing.title}`
		const body = 'Hi there!\n\nI would like to ask couple of questions about your listing. If it is still available I am here to talk...\n\nSincerely'

		// Create the mailto URL
		const mailtoURL = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

		// Open the default email client with the mailto URL
		window.open(mailtoURL, '_blank')
	}

	return (
		<div className="p-3 pb-8 max-w-5xl mx-auto bg-slate-200 mt-6 shadow-xl">
			{loading ? <p className="text-center my-72">Loading...</p> : error ? <p className="text-center">{error}</p> :
				<div className="flex flex-col">
					<div className="flex flex-col sm:flex-row gap-4 m-2">
						<div className="relative w-full flex-1 border border-slate-300 self-start">
							<div className="overflow-hidden w-full">
								<div
									className="flex transition-transform duration-300 ease-in-out"
									style={{ transform: `translateX(${-currentIndex * 100}%)` }}
								>
									{listing.imageUrls.map((image, index) => (
										<div key={index} className="w-full h-64 sm:h-96 flex-shrink-0 bg-black">
											<img src={image} alt={`slide ${index}`} className="object-fill h-64 sm:h-96 mx-auto" />
										</div>
									))}
								</div>
							</div>
							<button
								className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded"
								onClick={prevSlide}
							>
								<FaArrowLeft />
							</button>
							<button
								className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded"
								onClick={nextSlide}
							>
								<FaArrowRight />
							</button>
						</div>
						<div className="flex flex-col flex-1 gap-4">
							<div className="text-xl font-semibold">{listing.title}</div>
							<div className="px-2 bg-slate-400 w-fit">{listing.type === 'rent' ? 'For Rent' : 'For Sale'}</div>
							<p className="flex items-center gap-2 sm:mb-4"><FaLocationDot />{listing.address}</p>
							{/* userRef        */}
							<table className="min-w-full bg-white border border-gray-300">
								<tbody>
									<tr>
										<td className="py-2 px-4 border-b border-r w-1/2">Price</td>
										<td className={`py-2 px-4 border-b ${listing.offer ? 'line-through' : ''}`}>${listing.regularPrice}{listing.type === 'rent' ? <span className="italic"> / month</span> : ''}</td>
									</tr>
									{!listing.offer ? null :
										<tr>
											<td className="py-2 px-4 border-b border-r">Discounted Price</td>
											<td className="py-2 px-4 border-b">${listing.discountPrice}{listing.type === 'rent' ? <span className="italic"> / month</span> : ''}</td>
										</tr>
									}
									<tr>
										<td className="py-2 px-4 border-b border-r w-1/2"># Bedrooms</td>
										<td className="py-2 px-4 border-b">{listing.bedrooms}</td>
									</tr>
									<tr >
										<td className="py-2 px-4 border-b  border-r"># Bathrooms</td>
										<td className="py-2 px-4 border-b">{listing.bathrooms}</td>
									</tr>
									<tr >
										<td className="py-2 px-4 border-b  border-r">Furnished</td>
										<td className="py-2 px-4 border-b">{listing.furnished ? 'Yes' : 'No'}</td>
									</tr>
									<tr >
										<td className="py-2 px-4 border-b  border-r">Parking Place</td>
										<td className="py-2 px-4 border-b">{listing.parking ? 'Yes' : 'No'}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<hr className="h-1 my-2 mx-10 bg-slate-300" />
					<div className="p-2 m-2 mt-2 border border-slate-300">
						<p className="text-lg ms-2 mb-2">Description</p>
						<p className="ms-2">{listing.description}</p>
					</div>
					<div className="flex justify-end">
						<button
							className="bg-slate-500 hover:bg-slate-700 text-white font-bold me-2 py-2 px-4 rounded w-fit"
							onClick={handleSendEmail}
						>
							Contact with Landlord
						</button>
					</div>
				</div>
			}
		</div>
	)
}
