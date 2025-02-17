import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/images/salessavvy_logo.png"
import profileIcon from "../assets/images/profile_icon.png"
import leftArrow from "../assets/images/left_arrow.png"
import axios from 'axios'
import CartItemCard from './CartItemCard'
import OrderSummary from './OrderSummary'


export default function CartPage() {
 
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


    return (
        <div className='cart-main-div'>
        <header>
            <div className='logo-div'>
            <img className='header-logo' src={logo} alt="site logo" />
            <h2>SalesSavvy</h2>
            </div>

            <div className='nav-tail'>
                <div className="profile-icon-div">
                    <img
                    className="profile-icon" 
                    src={profileIcon} 
                    alt="profile" 
                    />
                    <p>{user?.username || "GuestAccount"}</p>
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
                <OrderSummary cart={ cart } amount={amount}/>
            }
        </motion.div>
        }
        </AnimatePresence>

        </div>
    )
    }
