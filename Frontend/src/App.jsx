import React from 'react'
import {Route , Routes} from 'react-router-dom'
import Userlogin from './pages/Userlogin'
import Usersignup from './pages/Usersignup'
import UtilitySignup from './page/UtilitySignup'
import UtilityLogin from './page/UtilityLogin'

import DashboardContent from './pages/DashboardContent'

import Portal from './pages/Portal'
import ServiceInfo from './pages/ServiceInfo'

import BookingDetails from './pages/BookingDetails'
import ProviderDashboard from './page/ProviderDashboard'
import LiveCity from './components/LiveCity'
import ChooseAddress from './components/ChooseAddress'
import BookService from './components/BookService'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  return (
    <div>
   {/* {User == null? <Userlogin/> : <DashboardContent/>} */}
    <Routes>
      <Route path="/" element={<Portal />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="/signup" element={<Usersignup/>}/>
       <Route path="/login" element={<Userlogin/>}/>
        <Route path="/utility-signup" element={<UtilitySignup/>}/>
         <Route path="/utility-login" element={<UtilityLogin/>}/>
          {/* <Route path="/home" element={<Home/>}/> */}
            
          <Route path="/dashboard" element={<DashboardContent/>}/>
            <Route path="/serviceInfo" element={<ServiceInfo/>}/>
            <Route path="/booking-details" element={<BookingDetails/>}/>
            <Route path="/provider-board" element={<ProviderDashboard providerId= '68b33c49bce45a0306416c6b'/>}/>
            <Route path="/live-city" element={<LiveCity />} />
            <Route path="/choose-address" element={<ChooseAddress />} />
             <Route path="/book-service" element={<BookService />} />
             <Route path="/choose-address" element={<ChooseAddress />} />

             <Route path="/admin/login" element={<AdminLogin />} />
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
            


    </Routes>
    </div>
  )
}

export default App