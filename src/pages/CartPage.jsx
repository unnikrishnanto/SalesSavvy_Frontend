import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/images/site_logo_light.svg"
import profileIcon from "../assets/images/profile_icon.svg"
import leftArrow from "../assets/images/left_arrow.svg"
import axios from 'axios'
import CartItemCard from '../components/CartItemCard'
import OrderSummary from '../components/OrderSummary'
import LoadingAnimation from '../components/CustomerLoadingAnimation'
import { trefoil } from 'ldrs'
import LogoutAnimation from '../components/LogoutAnimation'

export default function CartPage() {
    
    // For payment animation
    const [verifyingPayment, setVerifyingPayment] = useState(false);
    const [initiatingPayment, setInitiatingPayment] = useState(false);
    trefoil.register();

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
        "https://salessavvy.onrender.com/api/cart/getItems",
        {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials : true
        }
    );

    if(response.status === 200){
        setUser(response.data.user);
        setCart(response.data.products);
        // This return the count of products in the cart for verification during order palacement
        return response.data.products;
    }
    } catch (error) {
    handleFetchingError("Couldn't load cart items")
    }
    }, [handleFetchingError]);

    useEffect(()=>{
        const fetchCart = async()=>{
            await fetchCartDetails();
            setIsLoading(false)
        }
        fetchCart();
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
                'https://salessavvy.onrender.com/api/cart/update',
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
            if(error.response && error.response?.status === 401){
                handleFetchingError('Session Expired');
            }
            alert(error?.response?.data?.message || "Couldn't update Count.");
        }
    }

    const deleteCartItem =async (prodId)=>{
        try {
            const response = await axios({

                url:'https://salessavvy.onrender.com/api/cart/remove',
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
            if(error.response && error.response?.status === 401){
                handleFetchingError('Session Expired');
            }
        }
    };

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
           navigate("/");
        }
    }

    return (
        <>
        { isLogingOut
                  ?
                    <LogoutAnimation/>
                  :
                  <div className='cart-main-div'>
                  <header className='cart-page-header'>
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
                                          setShowCart(false)
                                          setTimeout(() => {
                                            navigate("/customerHome");
                                          }, 600);  // Wait for exit animation to complete
                                      }}
                                  >Home</motion.li>
                      
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
          
                  {( initiatingPayment || verifyingPayment) ?
                          <div className='customer-loading-animation'>
                              <div>
                              <l-trefoil
                                  size="50"
                                  stroke="3.5"
                                  speed="1.5" 
                                  color="rgb(39, 173, 101)" 
                                  ></l-trefoil>
                                  <h3>{verifyingPayment ? 'Verifying Payment...' : 'Initiating Payment...' }</h3>   
                              </div>
                          </div>
                     :
          
                   isLoading?
                    
                      <LoadingAnimation message={'Loading Cart Items'}/>
                  :
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
                              <motion.img 
                                  whileHover={{scale: 1.2, boxShadow: '1px 1px 5px rgba(214, 214, 214, 0.7)'}}
                                  whileTap={{ scale: 0.8 }}
                                  transition={{type:'tween', duration:0.2, ease: 'easeInOut'}}
                                  src={leftArrow} alt="<-" />
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
                              <OrderSummary cart={ cart } setCart={setCart} amount={amount} user={user} fetchCartDetails={fetchCartDetails} setVerifyingPayment={setVerifyingPayment} setInitiatingPayment={setInitiatingPayment} />
                          }
                      </motion.div>
                      }
                  </AnimatePresence>
          
                  }
          
               
                  </div>        

        }
        
        </>


    )
    }
