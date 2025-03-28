import {React, useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import logo from "../assets/images/site_logo_light.svg"
import profileIcon from "../assets/images/profile_icon.svg"
import leftArrow from "../assets/images/left_arrow.svg"
import defaultImage from '../assets/images/default_image.svg'

import LoadingAnimation from '../components/CustomerLoadingAnimation'
import LogoutAnimation from "../components/LogoutAnimation";

export default function OrdersPage() {

// For loading animation
const [isLoading, setIsLoading] = useState(true);

// For logout animation
const [isLogingOut, setIsLogingOut] = useState(false);

// to execute dropdown animation
const [isOpen, setIsOpen] =  useState(false)

// for refering dropdown menu for closing effect
const dropdownRef = useRef();

// Close dropdown when clicking outside
useEffect(() => {
function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
    }
}
document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const navigate = useNavigate();
const [showOrders, setShowOrders] = useState(true);

const [user,setUser] = useState({
username : "Guest"
})

const [orders, setOrders] = useState([]);

const  [fetchingError,setFetchingError] = useState(false)

// To handle errors in API calls
const handleFetchingError = useCallback((message)=>{
    setFetchingError((prev)=>{
    if(!prev){
        confirm(message + "Login again....");
        navigate("/")
        return true
    }
    return prev;
    })
}, [navigate])

const fetchOrderDetails = useCallback(async () =>{
try {
const response = await axios.get(
    "https://salessavvy.onrender.com/api/orders",
    {
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials : true
    }
);

if(response.status === 200){
    setUser(response.data?.user)
    let sortedOrder = response.data?.orders.sort((a, b)=> new Date(b.time) - new Date(a.time)); 
    setOrders(sortedOrder);
}
} catch (error) {
handleFetchingError("Couldn't load Order items")
}
}, [handleFetchingError]);

useEffect(()=>{
    const fetchOrders = async ()=>{
        await fetchOrderDetails();
        setIsLoading(false)
    }
    fetchOrders();
    
}, [fetchOrderDetails]);



const logout = async ()=>{
    try {
        setIsLogingOut(true);
        // sending a post request to logout endpoint to delete token 
        const response = await axios.post(
        "https://salessavvy.onrender.com/api/logout",
        {},
        {
            headers:{
            "Content-Type": "application/json"
            },
            withCredentials : true
        }
    );

    if(response.status === 200){
        navigate("/");
    }
    
    } catch (error) {
        navigate("/");
    }
}

  return (
    <>
    { isLogingOut
          ?
            <LogoutAnimation/>
          :
          <div className='orders-main-div'>
          <header className="orders-page-header">
              <div className='logo-div l-d-2'>
              <img className='header-logo' src={logo} alt="site logo" />
              <h2>SalesSavvy</h2>
              </div>
     
              <div className='nav-tail'>
              <div className="profile-dropdown"
                ref={dropdownRef}
                onClick ={()=> setIsOpen(prev=> !prev)}
              >
                  <div className="profile-icon-div p-i-div-2">
                      <img
                      className="profile-icon" 
                      src={profileIcon} 
                      alt="profile" 
                      />
                      <p>{user?.username || "GuestAccount"}</p>
                  </div>
                  {
                      <motion.div
                          className="options-div"
                          animate={{top: isOpen? 105: -150}}
                          transition={{type:"spring"}}
                          >
                          <ul>
                          <motion.li
                          whileHover={{scale:1.06}}
                          whileTap={{ x: -50, backgroundColor: "rgb(12, 241, 230)"}}
                          onClick={()=> navigate("/profile")}
                          >Profile</motion.li>
              
                          <motion.li
                              whileHover={{scale:1.06}}
                              whileTap={{ x: -50, backgroundColor: "rgb(12, 241, 230)"}}
                              onClick={()=> {
                                 setShowOrders(false)
                                 setTimeout(() => {
                                     navigate("/customerHome");
                                 }, 600);  // Wait for exit animation to complete
                              }}
                          >Home</motion.li>
              
                          <motion.li
                          whileHover={{scale:1.06}}
                          whileTap={{ x: -50, backgroundColor: "rgb(12, 241, 230)"}}
                          onClick={()=> navigate("/cart")}
                          >Cart</motion.li>
                          <motion.li
                          whileHover={{scale:1.06}}
                          whileTap={{ x: -50 , backgroundColor: "rgb(241, 12, 12)"}}
                          onClick={logout}
                          >Logout</motion.li>
                          </ul>
                      </motion.div>
                          
                  }
                  </div>
              </div>  
          </header>
          {
             isLoading ? 
                 <LoadingAnimation message={"Loading Order History"}/>
             :
             <AnimatePresence>
              {showOrders &&
                 <motion.div
                 initial={{x : 1000}}
                 animate={{x : 0}}
                 transition={{type : 'tween', duration:0.8 , ease: 'easeInOut'}}
                 exit={{x: 1000, opacity: 0}}
                 className='orders-body'>
                     <div className='orders-body-heading'>
                         <div 
                         className="home-nav" 
                         onClick={()=> {
                             setShowOrders(false)
                             setTimeout(() => {
                                 navigate("/customerHome");
                                 }, 600);  // Wait for exit animation to complete
                         }}
                         >
                          <motion.img 
                             whileHover={{scale: 1.2, boxShadow: '1px 1px 5px rgba(214, 214, 214, 0.7)'}}
                             whileTap={{ scale: 0.8 }}
                             transition={{type:'tween', duration:0.2, ease: 'easeInOut'}}
                             src={leftArrow} alt="<-" />
                         </div>
                         <h2>Your Orders</h2>
                     </div>
                     <div className="order-list-div">
                         {
                             (orders.length == 0) ?
                                 <h4 className="empty-order-msg">No orders yet! Start shopping and place your first order.</h4>    
                             :
                             orders.map((item, index)=>{
                             return <div
                                         className="order-item-card"
                                         key={index}
                                         >
                                     <div className="order-item-heading">
                                         <p>Order ID: {item.orderId}</p>
                                     </div>
                                     <div className="order-item-body">
                                         <motion.img
                                             whileHover={{scale: 1.1}} 
                                             src={item.imgUrl || defaultImage} 
                                             alt="Image Not Found" 
                                             onError={e=>{
                                                 e.target.onerror = null;  // Prevent infinite loop 
                                                 e.target.src =defaultImage
                                                 }} />
                                         <div className="order-item-description" >
                                         <h3>{item.name}</h3>
                                         <h4>{item.description}</h4>    
                                         <p><span>Quantity : </span>{item.quantity}</p>
                                         <p><span>Price Per Unit:</span> ₹ {item.pricePerUnit}</p>
                                         <p><span>Total :</span> ₹ {item.totalAmount}</p>
                                         </div> 
                                     </div>
                                         
                                 </div> 
                             })
                         }
                 </div>
                 </motion.div>
              }
             </AnimatePresence>
     
     
     
          }
     
              </div>
     

    }
    </>
 )
 }

