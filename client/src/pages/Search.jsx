import { useState, useEffect, useRef } from 'react'
import { FaLocationDot, FaBed, FaBath} from 'react-icons/fa6';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Search() {


    // dropdown utils
    const [selectedOption, setSelectedOption] = useState('Latest');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();
    const options = ['Latest', 'Oldest', 'price high to low', 'price low to high'];
    //

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams(); // to get the prev query data
    const [listingData, setListingData] = useState([])
    const navigate = useNavigate()
    const [searchFormData, setSearchFormData] = useState({
        type: 'all',
        offer: false,
        furnished: false,
        parking: false,
        sort: 'createdAt',
        order: 'desc'
    })

    const handleFormChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent') {
            setSearchFormData({
              ...searchFormData,
              type: e.target.id,
            })
        }

        if(e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished'){
            setSearchFormData({
                ...searchFormData,
                [e.target.id]: e.target.checked,
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const searchTermFromUrl = searchParams.get('searchTerm')
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm',searchTermFromUrl)
        urlParams.set('type',searchFormData.type)
        urlParams.set('offer',searchFormData.offer)
        urlParams.set('furnished',searchFormData.furnished)
        urlParams.set('parking',searchFormData.parking)
        urlParams.set('sort',searchFormData.sort)
        urlParams.set('order',searchFormData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)

        try {
            setLoading(true)
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json()
            if(data.success === false){
                setError(true)
                return
            }
            setError(false)
            setLoading(false)
            setListingData(data)
        } catch (error) {
            setError(true)
        }
    }

    useEffect(() => {
        setSearchFormData({
            type: 'all',
            offer: false,
            furnished: false,
            parking: false,
            sort: 'createdAt',
            order: 'desc'
        })

        const fetchListings = async () => {
            try {
                setLoading(true)
                const urlParams = new URLSearchParams()
                urlParams.set('searchTerm', searchParams.get('searchTerm'))
                const searchQuery = urlParams.toString()
                const res = await fetch(`/api/listing/get?${searchQuery}`)
                const data = await res.json()
                if(data.success === false){
                    setError(true)
                    return
                }
                setError(false)
                setLoading(false)
                setListingData(data)
                navigate(`/search?${searchQuery}`)
            } catch (error) {
                setError(true)
            }
        }
        fetchListings()

    },[searchParams.get('searchTerm')])


    const handleOptionChange = (option) => {
        const optionIndex = options.indexOf(option)
        let order,sort = ''
        switch (optionIndex) {
            case 0:
                sort = 'createdAt'
                order = 'desc'
                break;
            case 1:
                sort = 'createdAt'
                order = 'asc'
                break;
            case 2:
                sort = 'regularPrice'
                order = 'desc'
                break;
            case 3:
                sort = 'regularPrice'
                order = 'asc'
                break;
        }
        setSearchFormData({ ...searchFormData, sort: sort, order: order})
        setSelectedOption(option);
        closeDropdown();
    };
  
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
  
    const closeDropdown = () => {
        setIsOpen(false);
    };

    return (
        <div className="px-3 py-8 max-w-7xl mx-auto bg-slate-200 mt-6 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-2 mx-2 sm:gap-3 sm:me-0">
                <div className="flex w-full sm:w-1/4 bg-slate-300 rounded-lg self-start mb-2">
                    <form className='p-4 w-full' onSubmit={handleSubmit}>
                        <p className='font-semibold pb-1 hover:cursor-default'>Type</p>
                        <label className="flex flex-row items-center ps-2">
                            <input
                                type="radio"
                                className="form-radio text-indigo-600 hover:cursor-pointer"
                                id="rent"
                                checked={searchFormData.type === 'rent'}
                                onChange={handleFormChange}
                            />
                            <span className="ml-2">Rent</span>
                        </label>
                        <label className="flex flex-row items-center ps-2">
                            <input
                                type="radio"
                                className="form-radio text-indigo-600 hover:cursor-pointer"
                                id="sale"
                                checked={searchFormData.type === 'sale'}
                                onChange={handleFormChange}
                            />
                            <span className="ml-2">Sale</span>
                        </label>
                        <hr className='my-2 h-0.5 bg-slate-400' />
                        <p className='font-semibold pb-1 hover:cursor-default'>Offer</p>
                        <label className="flex flex-row items-center ps-2">
                            <input
                                className='hover:cursor-pointer'
                                type="checkbox" id='offer'
                                onChange={handleFormChange}
                                checked={searchFormData.offer}
                            />
                            <span className="ml-2">Discount</span>
                        </label>
                        <hr className='my-2 h-0.5 bg-slate-400' />
                        <p className='font-semibold pb-1 hover:cursor-default'>Amenities</p>
                        <label className="flex flex-row items-center ps-2">
                            <input
                                className='hover:cursor-pointer'
                                type="checkbox" id='parking'
                                onChange={handleFormChange}
                                checked={searchFormData.parking}
                            />
                            <span className="ml-2">Parking</span>
                        </label>
                        <label className="flex flex-row items-center ps-2">
                            <input
                                className='hover:cursor-pointer'
                                type="checkbox" id='furnished'
                                onChange={handleFormChange}
                                checked={searchFormData.furnished}
                            />
                            <span className="ml-2">Furnished</span>
                        </label>
                        <hr className='my-2 h-0.5 bg-slate-400' />
                        <div className="container relative" ref={dropdownRef}>
                            <p className='font-semibold pb-1 hover:cursor-default'>Sort</p>
                            <div className="relative w-full inline-block text-left">
                                <button
                                type="button"
                                onClick={toggleDropdown}
                                className="inline-flex justify-between w-full items-center p-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700"
                                >
                                {selectedOption}
                                <svg
                                    className={`w-5 h-5 ml-2 -mr-1 transform transition-transform duration-300 ${
                                    isOpen ? 'rotate-180' : 'rotate-0'
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                                </button>

                                {isOpen && (
                                <div className="relative origin-top-right right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                    {options.map((option) => (
                                        <button
                                        key={option}
                                        onClick={() => handleOptionChange(option)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        role="menuitem"
                                        >
                                        {option}
                                        </button>
                                    ))}
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                        <button className='w-full py-1 bg-slate-700 text-center text-white rounded-md mt-5'>Search</button>
                    </form>
                </div>
                <div className="flex w-full flex-wrap gap-2 flex-col sm:flex-row mx-auto">
                { loading ? <p className='text-center w-full mt-4'>Loading...</p> : listingData.length == 0 ?
                    <p className='text-center w-full mt-4'>There is no listing for your search criteria(s)</p>
                    :
                    listingData.map(listing => (
                            <div className="w-full sm:w-80 shadow-md hover:shadow-xl hover:cursor-pointer rounded-lg mb-2" key={listing._id}
                                onClick={() => { navigate(`/listing/${listing._id}`)}}
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
                                    <div className="flex flex-row gap-1">
                                        $<p className={`${listing.offer ? 'line-through' : ''}`}>{listing.regularPrice}{listing.type === 'rent' && !listing.offer ? <span className="italic"> / month</span> : ''}</p>
                                        { !listing.offer ? null : <p>-</p> }
                                        { !listing.offer ? null :
                                            <p>{listing.discountPrice}{listing.type === 'rent' ? <span className="italic"> / month</span> : ''}</p>
                                        }
                                    </div>
                                    <div className="flex flex-row gap-5">
                                        <p className='flex items-center gap-1 text-lg'>{listing.bedrooms}<FaBed /></p>
                                        <p className='flex items-center gap-1 text-lg'>{listing.bathrooms}<FaBath /></p>
                                    </div>
                                </div>
                            </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}
