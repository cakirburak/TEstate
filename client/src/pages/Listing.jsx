import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";


export default function Listing() {

  const [listing, setListing] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    const getListing = async () => {
      const req = await fetch(`/api/listing/get/${params.listingId}`)
      const data = await req.json()
      if(data.success === false) {
        console.error("Could not get listing from database!")
        setError("Something Went Wrong!")
        return
      }
      setListing(data)
      setLoading(false)
    }

    getListing()
  }, [])
  console.log(listing);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listing.imageUrls.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? listing.imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="p-3 pb-8 max-w-5xl mx-auto bg-slate-200 mt-6 shadow-xl">
      { loading ? <p className="text-center">Loading...</p> : error ? <p className="text-center">{error}</p> :
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
          </div>
        </div>
      }
    </div>
  )
}
