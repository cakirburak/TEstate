import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';

export default function Profile() {

  const fileRef = useRef(null)
  const [imgFile, setImgFile] = useState(undefined)
  const [fileUploadPerc, setFileUploadPerc] = useState(0)
  const [fileUploadErr, setFileUploadErr] = useState(false)

  const [formData, setFormData] = useState({})
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useSelector(state => state.user)
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("submitted");
  }

  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }
  
  const closeDropdown = () => {
    setIsOpen(false);
  }

  useEffect(() => {
    if(imgFile){
      handleImgUpload(imgFile)
    }
  },[imgFile])

  const handleImgUpload = (imgFile) => {
    const storage = getStorage(app)
    const imgFileName = new Date().getTime() + imgFile.name
    const storageRef = ref(storage, imgFileName)
    const uploadTask = uploadBytesResumable(storageRef, imgFile)

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(progress);
        setFileUploadPerc(Math.round(progress))
      },
      (error) => { setFileUploadErr(true) },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => 
          setFormData({ ...formData, avatar:downloadUrl })
        )
      }
    )
  }
  console.log(formData);

  return (
    <div className='max-w-prose mx-auto'>
      <div className="relative inline-block text-left bg-slate-200 mt-6 w-full">
        <button
          className="inline-flex justify-between w-full items-center px-6 py-2 text-slate-600 hover:text-gray-800 focus:outline-none"
          onClick={toggleDropdown}
        >Profile
          <span className="text-lg">▾</span> {/* Minimal menu icon */}
        </button>

        {isOpen && (
          <div
            className="max-w-full mx-auto origin-top-right relative right-0 mt-2 rounded-md shadow-lg"
            onBlur={closeDropdown}
          >
            <div>
              <div className='max-w-full mx-auto'>
                <input type="file" ref={fileRef} hidden accept='image/*' onChange={ (e) => setImgFile(e.target.files[0]) }/>
                <img onClick={ () => fileRef.current.click() } className='rounded-full mx-auto my-4 w-24 h-24 hover:cursor-pointer' src={formData.avatar || currentUser.avatar} alt="Profile Picture" />
                <p className='text-sm text-center'>
                  { fileUploadErr ? (
                     <span className='text-red-700'>Error Image Upload ( Image size should be less than 2mb)</span>
                     ) : fileUploadPerc > 0 && fileUploadPerc < 100 ? (
                      <span className='text-slate-700'>{`Uploading %${fileUploadPerc}`}</span>
                     ) : fileUploadPerc === 100 ? (
                      <span className='text-green-700'>Image Uploaded Successfully!</span>
                     ) : ('')
                  }
                </p>
                <form className='flex flex-col gap-6 py-8 px-6 rounded-md bg-slate-200' onSubmit={handleSubmit}>
                  <input
                    type="text" 
                    placeholder='username' 
                    className='border p-3 rounded-lg' 
                    id='username' 
                    onChange={handleChange}
                  />
                  <input
                    type="text" 
                    placeholder='email adress' 
                    className='border p-3 rounded-lg' 
                    id='email' 
                    onChange={handleChange}
                  />
                  <input
                    type="text" 
                    placeholder='password' 
                    className='border p-3 rounded-lg' 
                    id='password' 
                    onChange={handleChange}
                  />
                  <button
                    disabled={loading} 
                    className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>
                      {loading ? 'Loading...' : 'Update'}
                  </button>
                  <div className="flex justify-between mt-5 mx-1">
                    <span className="text-red-700 cursor-pointer">Delete account</span>
                    <span className="text-red-700 cursor-pointer">Sign out</span>
                  </div>
                </form>
                {err && <p className='text-red-500 mt-5'>{err}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}