import React from 'react'
import {Routes, Route, BrowserRouter} from "react-router-dom"
import SignUp from './utils/SignUp'
import Login from './utils/Login'
import CustomerDashboard from './utils/CustomerDashboard'
import AdminDashboard from './utils/AdminDashboard'
import CartPage from './utils/CartPage'
import OrdersPage from './utils/OrdersPage'
import CustomerProfile from './utils/CustomerProfile'


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
