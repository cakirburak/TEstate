import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/Header';
import CreateListing from './pages/CreateListing';
import PrivateProfileRoute from './components/PrivateProfileRoute';
import UpdateListing from './pages/UpdateListing';

export default function App() {
  return <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/sign-in' element={<SignIn />}></Route>
      <Route path='/sign-up' element={<SignUp />}></Route>
      <Route path='/about' element={<About />}></Route>
      <Route element={<PrivateProfileRoute />}>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/create-listing' element={<CreateListing />}></Route>
        <Route path='/update-listing/:listingId' element={<UpdateListing />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>;
}
