import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

export default function Header() {
    const { currentUser } = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault()
        // get url parameters as object with URLSearchParams
        // you can set and get thoose parameters
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    // keep the current value of the query for the navigated page
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    },[location.search])

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className="grid grid-cols-3 items-center max-w-7xl mx-auto p-3">
                <Link to='/'>
                    <h1 className='font-bold text-xl flex flex-wrap'>
                        <span className='text-slate-500'>T</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                        <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-full'/>
                        <button>
                            <FaSearch className='text-slate-600' />
                        </button>
                </form>
                <ul className='flex justify-end gap-8'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                    </Link>
                    <Link to='/profile'>
                        { currentUser ? (
                            <img className='rounded-full w-7 h-7 object-cover' src={currentUser.avatar} alt="profile" referrerPolicy="no-referrer"/>
                        ) : (
                            <li className='text-slate-700 hover:underline'>Sign in</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}
