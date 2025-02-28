import {React, useCallback, useEffect, useState} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {motion, AnimatePresence} from "framer-motion"
import CustomerDashboardHeader from "../components/CustomerDashboardHeader"
import ProductCard from "../components/ProductCard"
import LoadingAnimation from '../components/CustomerLoadingAnimation'


export default function CustomerDashboard() {

  // For loading animation
  const [isLoading, setIsLoading] = useState(true);

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
          "http://localhost:9090/api/cart/count",
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
          url:"http://localhost:9090/api/user/details", 
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
        `http://localhost:9090/api/products?category=${category || "shirts"}`,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      if(response.status === 200){
        setProducts(response?.data?.products || [])
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

  const changeCategory = (newCategory)=>{
    setProducts([]); // Clear the product list to trigger exit animation
    setTimeout(() => {
      fetchProducts(newCategory); // Fetch new products 
    }, 300); // 300ms delay for exit animation 
  }



  const addToCart = useCallback(async (productId)=>{
    try {
      const response = await axios.post(
        "http://localhost:9090/api/cart/add",
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
        alert("Item Not added.try again")
    }
  }, [user.username, fetchCartCount, handleFetchingError]);


  return (
    <>		
      <CustomerDashboardHeader {...{ user, changeCategory, cartCount }} />
      
      {isLoading ?
       <LoadingAnimation/>
      : 
      < motion.div className="product-div">
          <AnimatePresence>
          {
            products.map((p, i)=>{
              return <ProductCard key={p.productId} product={p} addToCart= {addToCart}/>
            })
          }
          </AnimatePresence>
        </motion.div>
      }

    

    </>
  )
}
