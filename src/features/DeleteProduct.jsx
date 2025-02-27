import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios';
import { hatch } from 'ldrs'
  

export default function DeleteProduct({setShowOptionsPopup, handleFetchingError}) {
  // Registering loading animation
  hatch.register()

  
  const [isDeleting, setIsDeleting] = useState(false);  

  // For automatically focusing on input field on load
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    if (!isDeleting) {
        inputRef.current?.focus();
      }  // Automatically focus on load
  }, [isDeleting]);
  
  const [productId, setProductId] = useState('')
  
  const closePopup = ()=>{
    setShowOptionsPopup(prev=>{
        const updatedState = [...prev]; 
        updatedState[3] = false;
        return updatedState;
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setIsDeleting(true)
     

    // Validate numeric values
    if (productId <= 0) {
        alert("ID must be numeric and greater then zero. Please enter correct details.");
        setIsDeleting(false);
        return;
    }

    // Deleting product from DB
    try {
     const response = await axios({
      method : 'DELETE',  
      url: 'http://localhost:9090/admin/products/delete',
      data:{productId},
      headers:{"Content-Type" : 'application/json'},
      withCredentials: true
    });
     console.log(response);
     
     if(response.status === 200){
        alert("Product Deleted Successfuly");
     }
        
    } catch (error) {
      if(error.response && error.response.status === 401){
        handleFetchingError(error.response?.data?.message || "Something went wrong.")
     } else {
        console.log(error);
        alert(error.response?.data?.message);
     }
    } finally{
      // Clearing Field
      setProductId('')
      setIsDeleting(false)
    }
  }

  return (
    <motion.div className='admin-popup'
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity:0}}
          transition={{type:'tween' ,duration: 0.5}}
          >
        <motion.div className="delete-product-form-container">
            <h3>DELETE A PRODUCT</h3>
            {isDeleting ?
              <div className='loading-animation-div'>
                <l-hatch
                size="35"
                stroke="3.5"
                speed="1.5" 
                color="rgb(39, 173, 101)" 
                ></l-hatch>
                <h3>Removing the product from database..</h3>    
              </div>
            :
            <motion.form 
              onSubmit={handleSubmit} 
              className='delete-product-form' 
              initial={{scale: 0, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{type:"spring", duration:1.2}}
              >
                  <label>Enter Id of the product to be deleted ?</label>
                  <input 
                  ref={inputRef}
                  value={productId}
                  placeholder='Enter Product ID'
                  type="number" 
                  onChange={(e)=> setProductId( e.target.value === "" ? "" : Number(e.target.value))}
                  required/>

              
                <motion.button
                  whileHover={{scale: 1.05, color: 'rgba(233, 70, 10, 0.65)'}}
                  whileTap={{scale: 0.95}}
                >DELETE PRODUCT</motion.button>
              </motion.form>
            }
            

            <motion.button
            whileHover={{scale: 1.1, color: 'rgb(242, 229, 118)'}}
            whileTap={{scale: 0.9}}
            onClick={()=>closePopup()}
            >CLOSE</motion.button>

        </motion.div>
    </motion.div>
  )
}
