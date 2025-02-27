import React from 'react'
import {Routes, Route, BrowserRouter} from "react-router-dom"
import SignUp from './auth/SignUp'
import Login from './auth/Login'
import CustomerDashboard from './pages/CustomerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import CustomerProfile from './pages/CustomerProfile'


export default function AppRoutes() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>} ></Route>
            <Route path='/register' element={<SignUp/>} ></Route>
            <Route path='/customerHome' element={<CustomerDashboard/>}></Route>
            <Route path='/adminHome' element={<AdminDashboard/>}></Route>
            <Route path='/cart' element={<CartPage/>}></Route>
            <Route path="/orders" element={<OrdersPage/>}></Route>
            <Route path='/profile' element={<CustomerProfile/>}></Route>
        </Routes>
    </BrowserRouter>
  )
}
