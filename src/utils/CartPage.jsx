import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/images/salessavvy_logo.png"
import profileIcon from "../assets/images/profile_icon.png"
import leftArrow from "../assets/images/left_arrow.png"
import axios from 'axios'
import CartItemCard from './CartItemCard'
import OrderSummary from './OrderSummary'


export default function CartPage() {
    
    // to exeute dropdown animation
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
    const [showCart, setShowCart] = useState(true);

    const [user,setUser] = useState({
    username : "Guest"
    })

    const [cart, setCart] = useState([]);

    const [amount, setAmount] = useState(0);

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

    const fetchCartDetails = useCallback(async () =>{
    try {
    const response = await axios.get(
        "http://localhost:9090/api/cart/getItems",
        {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials : true
        }
    );

    if(response.status === 200){
        console.log(response.data);
        setUser(response.data.user);
        setCart(response.data.products);
    }
    } catch (error) {
    console.log(error);
    handleFetchingError("Couldn't load cart items")
    }
    }, [handleFetchingError]);

    useEffect(()=>{
        fetchCartDetails();
    }, [fetchCartDetails]);

    const calculateTotal = useCallback( ()=>{
        return cart.reduce((sum, product) =>(sum+ (product.price * product.quantity)), 0).toFixed(2);
        }, [cart])

    useEffect(()=>{
        setAmount(calculateTotal())
    }, [cart])

    const updateCart = async (prod, qty)=>{
        try {

            const response = await axios.put(
                'http://localhost:9090/api/cart/update',
                {
                    username: user.username,
                    productId: prod,
                    quantity: qty
                },
                {
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    withCredentials : true
                }
            );

            if(response.status === 200){
                if(qty == 0){
                    setCart(prev=> {
                        return prev.filter((item, index)=>item.productId !== prod);
                    })
                } else {
                    setCart(prev=> {
                        return prev.map((item, index)=>item.productId === prod ? {...item, "quantity": qty}: item)
                    })
                }
            }
            
        } catch (error) {
            console.log("Error: " + error);
        }
    }

    const deleteCartItem =async (prodId)=>{
        try {

            const response = await axios({

                url:'http://localhost:9090/api/cart/remove',
                method: "DELETE",
                data: {
                    username: user.username,
                    productId: prodId,
                },
                
                headers: {
                    "Content-Type" : "application/json"
                },
                withCredentials : true
            
            });

            if(response.status === 200){
                setCart(prev=> {
                    return prev.filter((item, index)=>item.productId !== prodId )
                })
            }
            
        } catch (error) {
            console.log("Error: " + error);
        }
    };

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
        <div className='cart-main-div'>
        <header>
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
                            onClick={()=> navigate("/customerHome")}
                        >Home</motion.li>
            
                        <motion.li
                        whileHover={{scale:1.06}}
                        whileTap={{ x: -50, backgroundColor: "rgb(12, 241, 230)"}}
                        onClick={()=> console.log("Orders")}
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
        <AnimatePresence>
        {showCart &&
        <motion.div
         initial={{x : 1000}}
         animate={{x : 0}}
         transition={{type : 'tween', duration:0.8 , ease: 'easeInOut'}}
         exit={{x: 1000, opacity: 0}}
         className='cart-body'>

            <div className='items-summary-div'>
            <div className='cart-body-headding'>
                <div 
                className="home-nav" 
                onClick={()=> {
                    setShowCart(false)
                    setTimeout(() => {
                        navigate("/customerHome");
                      }, 600);  // Wait for exit animation to complete
                }}
                >
                    <img src={leftArrow} alt="<-" />
                    <p>Click here to go back to home</p>
                </div>
                <h2>Shopping Cart</h2>
                <p>You hava {cart.length} products in your cart</p>
            </div>

                <div className='cart-items-div'>
                <ul>
                    {cart.map((item, index)=>{
                        return <li
                            key={item.productId} 
                        >
                        <CartItemCard item={item} updateCart = {updateCart} deleteCartItem={deleteCartItem} />
                        </li>
                    })}
                </ul>
                </div>
            </div>
            {cart.length >0 &&
                <OrderSummary cart={ cart } amount={amount} user={user}/>
            }
        </motion.div>
        }
        </AnimatePresence>

        </div>
    )
    }
