import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from "firebase/storage"
import { getAuth } from "firebase/auth"
import { useState } from "react"
import { app } from "../firebase"

export default function CreateListing() {
  
  const [formData, setFormData] = useState({
    imageUrls: [],
  })
  const [imgFiles, setImgFiles] = useState([])
  const [uploadImgError, setUploadImgError] = useState(false)
  const [uploading, setUploading] = useState(false)

  // to be able to upload multiple images to firebase
  // there has to be a promise chain in order to resolve them properly
  const handleImgSubmit = (e) => {
    if(imgFiles.length > 0  && (formData.imageUrls.length + imgFiles.length) < 7){
      setUploading(true)
      setUploadImgError(false)
      const promises = []

      for (let i = 0; i < imgFiles.length; i++) {
        promises.push(storeImage(imgFiles[i]))        
      }

      Promise.all(promises).then((urls) => {
        setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
        setUploadImgError(false)
        setUploading(false)
      }).catch((error) => {
        setUploadImgError('Image size has to be less than 2mb!')
        setUploading(false)
      })

    } else {
      if(imgFiles.length == 0 ){
        setUploadImgError('Choose at least one image to upload!')
      } else {
        setUploadImgError('You can only upload 6 images!')
      }
      setUploading(false)
    }
  }


  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const handleImgRemoveFromFormData = async (url) => {
    
    const updatedImgUrls = formData.imageUrls.filter( (imgUrl) => imgUrl != url)
    setFormData({ ...formData, imageUrls: updatedImgUrls})

    const storage = getStorage(app)
    const fileRef = ref(storage, url)
    const auth = getAuth(app)
    await deleteObject(fileRef, auth).then(() => {
      console.log('File Deleted from Firebase!');
    }).catch((error) => console.log(error))
  }

  return (
    <main className="p-3 pb-8 max-w-4xl mx-auto bg-slate-200 mt-6 shadow-xl">
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
                    <input onChange={(e) => setImgFiles(e.target.files)} className="p-2 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={handleImgSubmit} 
                      className="border border-slate-700 p-2 text-slate-700 rounded hover:shadow-lg disabled:opacity-80"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                {uploadImgError && <p className="text-sm text-red-600">{uploadImgError}</p> }
                {
                  formData.imageUrls.length > 0 && formData.imageUrls.map((url) => (
                    <div key={url} className="flex justify-between p-2 border border-slate-300 items-center">
                      <img src={url} alt="listing-image" className="w-20 h-20 object-contain rounded-lg" />
                      <button type="button" onClick={() => handleImgRemoveFromFormData(url)} className="p-2 text-red-700 rounded-lg hover:text-red-500">Delete</button>
                    </div>
                  ))
                }
                <button className="p-3 bg-green-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-70" >Create Listing</button>
            </div>
        </form>
    </main>
  )
}
