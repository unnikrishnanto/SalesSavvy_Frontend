import  { React, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/images/site_logo_light.svg"
import cartIcon from "../assets/images/cart_icon.svg"
import profileIcon from "../assets/images/profile_icon.svg"
import NavBar from './NavBar'
import axios from 'axios'

export default function CustomerDashboardHeader({user,changeCategory, cartCount, setIsLogingOut}) {
  
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
          // console.log("Logout Successful");
          navigate("/");
        }
        
      } catch (error) {
          navigate("/")
      }
  }
  
  return (
    <header className='customer-dashboard-header'>
      <div className='logo-div'>
      <img className='header-logo' src={logo} alt="site logo" />
      <h2>SalesSavvy</h2>
      </div>

      <NavBar changeCategory={changeCategory} />


      <div className='nav-tail'>
        <motion.div 
          className='header-cart-info'
          onClick={()=>navigate("/cart")}
          whileHover={{scale:1.1}}
          >
            
          <img src={cartIcon} alt=''/>
          <p className='cart-count-div' >{cartCount || 0}</p>
        </motion.div>
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
