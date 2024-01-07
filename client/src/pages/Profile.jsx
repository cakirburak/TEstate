import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
} from '../redux/user/userSlice.js'
import { FaArrowDown, FaArrowUp } from "react-icons/fa";


export default function Profile() {

  const fileRef = useRef(null)
  const [imgFile, setImgFile] = useState(undefined)
  const [fileUploadPerc, setFileUploadPerc] = useState(0)
  const [fileUploadErr, setFileUploadErr] = useState(false)

  const [formData, setFormData] = useState({})
  const [formChanged, setFormChanged] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const { currentUser,loading, error } = useSelector(state => state.user)

  const dispatch = useDispatch()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
    setFormChanged(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const req = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await req.json()
      if(data.success === false) {
        dispatch(updateUserFailure(data.message))
        setFormChanged(false)
        return
      }
      
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
      setFormChanged(false)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
      setFormChanged(false)
    }
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

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action is irreversible and will permanently delete all associated data!')
    if(confirmDelete){
      try {
        dispatch(deleteUserStart())
        const req = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE'
        })

        const data = await req.json()
        if(data.success != true) {
          dispatch(deleteUserFailure(data.message))
        }
        dispatch(deleteUserSuccess(data))
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
    }
  }

  const handleLogOut = async () => {
    try {
      dispatch(signOutUserStart())
      const req = await fetch('/api/auth/signout', {
        method: 'GET'
      })
      const data = await req.json()
      if(data.success != true){
        dispatch(signOutUserFailure(data.message))
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }
  
  return (
    <div className='max-w-prose mx-auto'>
      <div className="relative inline-block text-left bg-slate-200 mt-6 w-full">
        <button
          className="inline-flex justify-between w-full items-center px-6 py-2 text-slate-600 hover:text-gray-800 focus:outline-none"
          onClick={toggleDropdown}
        >Profile
          <span className="text-lg">{isOpen ? <FaArrowUp /> : <FaArrowDown />}</span>
        </button>
        {isOpen && (
          <div className="max-w-full mx-auto origin-top-right relative right-0 mt-2 rounded-md shadow-lg">
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
                    defaultValue={currentUser.username} 
                    onChange={handleChange}
                  />
                  <input
                    type="text" 
                    placeholder='email adress' 
                    className='border p-3 rounded-lg' 
                    id='email' 
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                  />
                  <input
                    type="password" 
                    placeholder='password' 
                    className='border p-3 rounded-lg' 
                    id='password' 
                    onChange={handleChange}
                  />
                  <button
                    disabled={!formChanged || loading}
                    className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-70'>
                      {loading ?  'Loading...' : 'Update'}
                  </button>
                  { updateSuccess && <p className='text-center text-green-700'>Update has completed successfully!</p>}
                  { error && <p className='text-center text-red-700'>{error}</p>}
                  <div className="flex justify-between mt-5 mx-1">
                    <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
                    <span onClick={handleLogOut} className="text-blue-700 cursor-pointer">Sign out</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}