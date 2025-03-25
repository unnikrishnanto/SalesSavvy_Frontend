import  { React, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/images/site_logo_light.svg"
import cartIcon from "../assets/images/cart_icon.svg"
import profileIcon from "../assets/images/profile_icon.svg"
import axios from 'axios'


export default function CustomerProfileHeader({user, cartCount}) {
  
  const navigate  = useNavigate();
  // for refering dropdown menu for closing effect
  const dropdownRef = useRef();
  // to exeute dropdown animation
  const [isOpen, setIsOpen] =  useState(false)

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


  const logout = async ()=>{
      try {
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
          // console.log("Logout Successful");
          navigate("/");
        }
        
      } catch (error) {
        if(error.response?.status === 401){
          navigate("/")
        }else{
          alert("Logout failed..");
        }
      }
  }
  
  return (
    <header className='profile-page-header'>
      <div className='logo-div l-d-2'>
      <img className='header-logo' src={logo} alt="site logo" />
      <h2>SalesSavvy</h2>
      </div>

      <div className='nav-tail'>
        <motion.div 
          className='header-cart-info profile-cart-info'
          onClick={()=>navigate("/cart")}
          whileHover={{scale:1.1}}
          >
          <img src={cartIcon} alt="" />
          <p className='cart-count-div' >{cartCount || 0}</p>
        </motion.div>
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
            onClick={()=> navigate("/customerHome")}
            >Home</motion.li>

            <motion.li
             whileHover={{scale:1.06}}
             whileTap={{ x: -50, backgroundColor: "rgb(12, 241, 230)"}}
             onClick={()=> navigate("/cart")}
            >Cart</motion.li>

            <motion.li
            whileHover={{scale:1.06}}
            whileTap={{ x: -50, backgroundColor: "rgb(12, 241, 230)"}}
            onClick={()=> navigate("/orders")}
            >Orders</motion.li>
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
  )
}
