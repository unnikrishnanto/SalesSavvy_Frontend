import {React, useCallback, useEffect, useState} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {motion, AnimatePresence} from "framer-motion"
import CustomerDashboardHeader from "../components/CustomerDashboardHeader"
import ProductCard from "../components/ProductCard"
import LogoutAnimation from "../components/LogoutAnimation"


export default function CustomerDashboard() {

  // For loading animation
  const [isLoading, setIsLoading] = useState(true);

  // For logout animation
  const [isLogingOut, setIsLogingOut] = useState(false);


  // for route navigation
  const navigate = useNavigate();

  // to detect if any of the api calls have failed
  const [fetchingError, setFetchingError] = useState(false);

  // storing user details
  const [user, setUser] = useState({
    name: "Guest"
  });

  const [cartCount, setCartCount] = useState(0);

  // Storing products in the selected category
  const [products, setProducts] = useState([]);

  //
  const [AllProducts, setAllProducts] = useState({
    'shirts': null,
    'pants': null,
    'mobiles': null, 
    'multimedia': null, 
    'accessories': null
  })

  // Empty Array for creating Skeletons for loading animation 
  const loadingDivs = new Array(12).fill(null);

  // To inform and navigate in acse of error
  // also prevents mutiple alerts and navigations in call of mutiple failiures.
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

  // To fetch cart count associated with a user (token based)
  const fetchCartCount =useCallback(async () => {
      try {
        const response = await axios.get(
          "https://salessavvy.onrender.com/api/cart/count",
          {
          headers:{
            "Content-Type" : "application/json"
          },
          withCredentials : true // to add cookies in request
        });
  
        if(response.status === 200){
          setCartCount(response.data?.count || 0);
        }
        
      } catch (error) {
        handleFetchingError("Couldn't load user details.")
      }
  
    }, [handleFetchingError]);
  

  
  const fetchUser= useCallback(
    async () => {
      try {
        const response = await axios({
          url:"https://salessavvy.onrender.com/api/user/details", 
          method: "GET",
          headers :{
            "Content-Type" : "application/json"
          },
          withCredentials: true
        });
    
        if(response.status === 200){
          
          setUser(response.data?.user);
        }
            
      } catch (error) {
        handleFetchingError("Couldn't load user details.");
      }
    },[handleFetchingError]);

  
  const fetchProducts = useCallback( async ( category ) => {
    try{ 
      const response = await axios.get(
        `https://salessavvy.onrender.com/api/products?category=${category || "shirts"}`,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      if(response.status === 200){
        setProducts(response?.data?.products || [])
        setAllProducts(state=>({
          ...state,
          [category]:  response?.data?.products
        }));
       
      } 
    }catch(error){
     handleFetchingError("Couldn't load product details.")
    }
  }, [handleFetchingError]);

  

  useEffect(()=>{
    const fetchData = async () => {
      try {
        // Promise all will make parallel API calls
        await Promise.all([fetchUser(), fetchCartCount(), fetchProducts("shirts")]);
        setIsLoading(false)
      } catch (error) {
        console.error("Error in initial data fetching:", error);
      }
    };

    fetchData();

  },[fetchProducts, fetchUser, fetchCartCount])

  const changeCategory = async (newCategory) => {
    setProducts([]); // Clear the product list to trigger exit animation
      setTimeout(async () => {
        setIsLoading(true)
        if(AllProducts[newCategory] != null){ 
          setProducts(AllProducts[newCategory]);  
        } else {
          await fetchProducts(newCategory); // Fetch new products
        } 
        setIsLoading(false)
      }, 300); // 300ms delay for exit animation 
  }



  const addToCart = useCallback(async (productId)=>{
    try {
      const response = await axios.post(
        "https://salessavvy.onrender.com/api/cart/add",
        {
          username: user.username,
          productId: productId
        },
        {
        headers : {
          "Content-Type": "application/json"
        },
        withCredentials : true
        }
      );
      if(response.status === 200){
        await fetchCartCount();
      }
    } catch (error) {
      
      if(error?.status === 401)
        handleFetchingError("Authorization failed...")
      else
        alert("Item Not added: " + error?.response?.data?.message)
    }
  }, [user.username, fetchCartCount, handleFetchingError]);


  return (
    <>		
      { isLogingOut
          ?
            <LogoutAnimation/>
          :
      <>
      <CustomerDashboardHeader {...{ user, changeCategory, cartCount, setIsLogingOut }} />
      < motion.div className="product-div">
      {isLoading ?
       
        loadingDivs.map((_, index)=>{
          
        return   <div className="product-card " key={index}>
        <div className="product-image skeleton-loader" />
        <h3 className="skeleton-loader"></h3>
        <div className="product-price skeleton-loader"></div>
        <button className="add-to-cart-button skeleton-loader">ADD TO CART</button>
      </div>
        })
      : 
      
          <AnimatePresence>
          {
            products.map((p, i)=>{
              return <ProductCard key={p.productId} product={p} addToCart= {addToCart}/>
            })
          }
          </AnimatePresence>
      }
      </motion.div>
      </>
}
    </>
  )
}
