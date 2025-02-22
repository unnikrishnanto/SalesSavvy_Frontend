import {React, useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import logo from "../assets/images/salessavvy_logo.png"
import profileIcon from "../assets/images/profile_icon.png"
import leftArrow from "../assets/images/left_arrow.png"

export default function OrdersPage() {

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
    "http://localhost:9090/api/orders",
    {
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials : true
    }
);

if(response.status === 200){
    console.log(response.data);
    setUser(response.data?.user)
    let sortedOrder = response.data?.orders.sort((a, b)=> new Date(b.time) - new Date(a.time)); 
    setOrders(sortedOrder);
}
} catch (error) {
console.log(error);
handleFetchingError("Couldn't load Order items")
}
}, [handleFetchingError]);

useEffect(()=>{
    fetchOrderDetails()
}, [fetchOrderDetails]);



const logout = async ()=>{
    try {
        // sending a post request to logout endpoint to delete token 
        const response = await axios.post(
        "http://localhost:9090/api/logout",
        {},
        {
            headers:{
            "Content-Type": "application/json"
            },
            withCredentials : true
        }
    );

    if(response.status === 200){
        console.log("Logout Successful");
        navigate("/");
    }
    
    } catch (error) {
    console.log("Logout failed..");
    console.log("Error: " + error);
    }
}

  return (
     <div className='orders-main-div'>
     <header className="orders-page-header">
         <div className='logo-div'>
         <img className='header-logo' src={logo} alt="site logo" />
         <h2>SalesSavvy</h2>
         </div>

         <div className='nav-tail'>
         <div className="profile-dropdown"
           ref={dropdownRef}
           onClick ={()=> setIsOpen(prev=> !prev)}
         >
             <div className="profile-icon-div">
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
                     animate={{top: isOpen? 105: -110}}
                     transition={{type:"spring"}}
                     >
                     <ul>
                     <motion.li
                     whileHover={{scale:1.06}}
                     whileTap={{ x: -50, backgroundColor: "rgb(12, 241, 230)"}}
                     onClick={()=> console.log("Profile")}
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
                    <img src={leftArrow} alt="<-" />
                    <p>Click here to go back to home</p>
                </div>
                <h2>Your Orders</h2>
            </div>
            <div className="order-list-div">
                {orders.map((item)=>{
                    return <div
                             className="order-item-card"
                             key={item.productId}
                             >
                            <div className="order-item-heading">
                                <p>Order ID: {item.orderId}</p>
                            </div>
                            <div className="order-item-body">
                             <img src={item.imgUrl} alt="" />
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

     </div>
 )
 }

