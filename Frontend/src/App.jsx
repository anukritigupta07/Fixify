import React from 'react'
import {Route , Routes} from 'react-router-dom'
import Userlogin from './pages/Userlogin'
import Usersignup from './pages/Usersignup'
import UtilitySignup from './page/UtilitySignup'
import UtilityLogin from './page/UtilityLogin'
// import Home from  './pages/Home'
import DashboardContent from './pages/DashboardContent'
import Start from './pages/Start'
import Portal from './pages/Portal'
import ServiceInfo from './pages/ServiceInfo'
import ProtectedRoute from './components/ProtectedRoute'
import BookingDetails from './pages/BookingDetails'
import ProviderDashboard from './page/ProviderDashboard'
import LiveCity from './components/LiveCity'
import ChooseAddress from './components/ChooseAddress'
import BookService from './components/BookService'
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
            


    </Routes>
    </div>
  )
}

export default App