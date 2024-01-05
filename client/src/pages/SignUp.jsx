import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const req = await fetch('/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        }
      )
      const data = await req.json()
      if(data.success === false){
        setErr(data.message)
        setLoading(false)
        return;
      }
      setErr(null)
      setLoading(false)
      navigate('/sign-in')
    } catch (error) {
      setLoading(false)
      setErr(error)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <form className='flex flex-col gap-6 py-16 px-4 mt-20 rounded-lg bg-slate-200' onSubmit={handleSubmit}>
        <h1 className='text-3xl text-center font-semibold mb-6'>Sign up</h1>
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
            {loading ? 'Loading...' : 'Sign up'}
        </button>
        <div className='flex gap-2'>
        <p>Have an account?</p>
          <Link to='/sign-in'>
            <span className='text-blue-700'>Sign in</span>
          </Link>
        </div>
        <hr className='bg-slate-500 w-auto h-1 mx-2'/>
        <OAuth />
      </form>
      {err && <p className='text-red-500 mt-5'>{err}</p>}
    </div>
  )
}
