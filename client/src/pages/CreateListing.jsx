
export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto bg-slate-200 mt-6 shadow-2xl">
        <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
        <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col flex-1 gap-4">
                <input className="border rounded-lg p-3" type="text" placeholder="Title" id="title" minLength={10} maxLength={62 } required/>
                <textarea className="border rounded-lg p-3" type="text" placeholder="Description" id="description" required/>
                <input className="border rounded-lg p-3" type="text" placeholder="Address" id="address" required/>
                <hr className="h-1 bg-slate-400"/>
                <div className="flex flex-wrap justify-start gap-6 mx-1">
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" id="sale" />
                        <span>For Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" id="rent" />
                        <span>For Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" id="parking" />
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" id="furnished" />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input className="w-5" type="checkbox" id="offer" />
                        <span>Offer</span>
                    </div>
                </div>
                <hr className="h-1 bg-slate-400"/>
                <div className="flex flex-col gap-6 mx-1">
                    <div className="flex items-center gap-2">
                        <input className="px-3 py-1 border border-gray-300 rounded-lg" type="number" min={1} max={10} id="bedrooms" required />
                        <p># Bedrooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className="px-3 py-1 border border-gray-300 rounded-lg" type="number" min={1} max={10} id="bathrooms" required />
                        <p># Bathrooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className="px-3 py-1 w-24 border border-gray-300 rounded-lg" type="number" min={1} max={10} id="regularPrice" required />
                        <div className="flex flex-col">
                            <p>Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className="px-3 py-1 w-24 border border-gray-300 rounded-lg" type="number" min={1} max={10} id="discountPrice" required />
                        <div className="flex flex-col">
                            <p>Discounted Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
                <p className="font-semibold">Images:<span className="font-normal text-gray-600 ms-2">First image will be cover(max 6).</span></p>
                <div className="flex gap-2">
                    <input className="p-2 border border-gray-300 rounded" type="file" id="images" accept="image/*" multiple />
                    <button className="border border-slate-700 p-2 w-28 text-slate-700 rounded hover:shadow-lg disabled:opacity-80" >Upload</button>
                </div>
                <button className="p-3 bg-green-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-70" >Create Listing</button>
            </div>
        </form>
    </main>
  )
}
