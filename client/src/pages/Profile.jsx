import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
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
    console.log("submitted");
  }

  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }
  
  const closeDropdown = () => {
    setIsOpen(false);
  }

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
            className="max-w-prose mx-auto origin-top-right relative right-0 mt-2 rounded-md shadow-lg"
            onBlur={closeDropdown}
          >
            <div>
              {/* Your dropdown menu items go here */}

              <div className='max-w-full mx-auto'>
                <img className='rounded-full mx-auto mt-4' src={currentUser.avatar} alt="Profile Picture" />
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
                  <div className="flex justify-between mt-5">
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