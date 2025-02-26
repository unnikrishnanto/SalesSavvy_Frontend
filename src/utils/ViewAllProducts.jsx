import React, { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios';
import { useEffect } from 'react';
import { waveform } from 'ldrs';

export default function ViewAllProducts({setShowOptionsPopup, handleFetchingError}) {
  
  // Registering Loading animation
  waveform.register();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([])
  
  const closePopup = ()=>{
    setShowOptionsPopup(prev=>{
        const updatedState = [...prev]; 
        updatedState[1] = false;
        return updatedState;
    })
  }

  const fetchAllProducts = useCallback(
    async()=>{
        try{
            const response = await axios.get(
                'http://localhost:9090/admin/products/all',
                {
                    headers:{"Content-Type":'application/json'},
                    withCredentials: true
                }
            );
            console.log(response);
            
            if(response.status === 200){
                console.log(response?.data?.products);
                setProducts(response?.data?.products)
            }

        } catch(err){
            console.log("Error: ");
            handleFetchingError(err?.data?.message || "Something weent wrong. ")
        }

    }, [handleFetchingError]);
 
  useEffect(()=>{
    const fetchProducts = async()=>{
        await fetchAllProducts();
        setIsLoading(false);
    }
    fetchProducts();
  }, [fetchAllProducts])  
  return (
    <motion.div className='admin-popup'
         initial={{y : -600, opacity: 0}}
         animate={{y : 0, opacity: 1}}
         exit={{y : -800, opacity: 0}}
         transition={{type:'spring', duration:1.2, ease:'easeIn'}}>
        <motion.div className="view-all-products-div">
            <h3>All Products</h3>
            <div className='admin-table-container'>
            {isLoading?
            
            <div className='loading-animation-div'>
                <l-waveform
                size="35"
                stroke="3.5"
                speed="1" 
                color="rgb(39, 173, 101)" 
               ></l-waveform>
               <h3>Loading all the Products</h3>    
            </div>
            :
            <table className='admin-table'>
                    <tr>
                        <th>PRODUCT ID</th>
                        <th>NAME</th>
                        <th>DESCRIPTION</th>
                        <th>CATEGORY</th>
                        <th>PRICE (₹)</th>
                        <th>STOCK</th>
                    </tr>
                    {products.length === 0 ?
                        <tr>
                            <td colSpan={5}
                                style={{textAlign: 'center'}}
                            >No Products to Display...</td>
                        </tr>
                        
                    :
                    
                    products.map((p, index) =>{
                        return (<tr key={index} >
                                <td>{p.productId}</td>
                                <td>{p.name}</td>
                                <td>{p.description}</td>
                                <td>{p.category}</td>
                                <td>{p.price.toFixed(2)}</td>
                                <td>{p.stock}</td>
                            </tr>)
                    })
                    
                }
            </table>}
            </div>
            
            <motion.button
            whileHover={{scale: 1.1, color: 'rgba(39, 39, 38, 0.65)'}}
            whileTap={{scale: 0.9}}
            onClick={()=>closePopup()}
            >X</motion.button>

        </motion.div>
    </motion.div>
  )
}
