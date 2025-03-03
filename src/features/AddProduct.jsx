import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios';
import AdminLoadingAnimation from '../components/AdminLoadingAnimation';


export default function AddProduct({setShowOptionsPopup, handleFetchingError}) {

  // For tracking weather an addition is in progress
  const [isAdding, setIsAdding] = useState(false); 

  // For automatically focusing on input field on load
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    if (!isAdding) {
        inputRef.current?.focus();
      }  // Automatically focus on load
  }, [isAdding]);


 
  const [product, setProduct] = useState({
    name : '',
    description : '',
    price : 0.0,
    categoryId : null,
    stock : 0,
    imgUrl: null

  })
  
  const closePopup = ()=>{
    setShowOptionsPopup(prev=>{
        const updatedState = [...prev]; 
        updatedState[2] = false;
        return updatedState;
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setIsAdding(true)
     
     const trimmedProduct = {
        ...product,
        name: product.name.trim(),
        description: product.description.trim(),
        imgUrl: product.imgUrl.trim(),
    };

    // Validate numeric values
    if (trimmedProduct.price <= 0 || trimmedProduct.stock < 0 || trimmedProduct.categoryId <= 0) {
        alert("Invalid numeric values. Please enter correct details.");
        setIsAdding(false);
        return;
    }

    // Adding product to DB
    try {
     const response = await axios.post(
        'http://localhost:9090/admin/products/add',
        {...trimmedProduct},
        {
            headers:{"Content-Type" : 'application/json'},
            withCredentials: true
        }
     );
     
     if(response.status === 201){
        alert("Product Created Successfuly with ID: " + response.data.product.productId);
        setIsAdding(false);
     }
        
    } catch (error) {
        if(error.response && error.response.status === 401){
            handleFetchingError(error.response?.data?.message || "Something went wrong.")
         } else {
            alert(error.response?.data?.message);
         }
    } finally{
        // Clearing Fields
        setProduct(prev =>({
            name : '',
            description : '',
            price : 0.0,
            categoryId : null,
            stock : 0,
            imgUrl: ''
        }));
        setIsAdding(false);
    }
  }

  return (
    <motion.div className='admin-popup'
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity:0}}
      transition={{type:'tween' ,duration: 0.5}}>
        <motion.div className="add-product-form-container">
            <h3>ADD A PRODUCT</h3>
            {isAdding ?
                
            <AdminLoadingAnimation message={"Adding product to database"}/>
            :
            <motion.form 
                onSubmit={handleSubmit} 
                className='add-product-form'
                initial={{scale: 0, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{type:"spring", duration:1.2}}
                >
                <div>
                    <label>Product Name</label>
                    <input 
                    ref={inputRef}
                    value={product.name}
                    placeholder='Enter Product Name'
                    type="text" 
                    onChange={(e)=> setProduct(prev=>({
                        ...prev,
                        name : e.target.value
                    }))}
                    required/>
                </div>
                
                <div>
                    <label 
                    >Description</label>

                    <textarea
                    rows={3}
                    value={product.description}
                    placeholder='Enter Product Description' 
                    onChange={(e)=> setProduct(prev=>({
                        ...prev,
                        description : e.target.value
                    }))}
                    required></textarea>
                </div>

                <div>
                    <label>Product Price</label>
                    <input 
                    value={product.price}
                    placeholder='Enter Product Price'
                    type="number" 
                    onChange={(e)=> setProduct(prev=>({
                        ...prev,
                        price :  e.target.value === "" ? "" : Number(e.target.value)
                    }))}
                    required/>
                </div>

                <div>
                    <label>Category ID</label>
                    <input 
                    value={product.categoryId}
                    placeholder='Enter Category ID For The Product'
                    type="number" 
                    onChange={(e)=> setProduct(prev=>({
                        ...prev,
                        categoryId :  e.target.value === "" ? "" : Number(e.target.value)
                    }))}
                    required/>
                </div>

                <div>
                    <label>Stock</label>
                    <input 
                    value={product.stock}
                    placeholder='Enter Product Stock'
                    type="number" 
                    onChange={(e)=> setProduct(prev=>({
                        ...prev,
                        stock :  e.target.value === "" ? "" : Number(e.target.value)
                    }))}
                    required/>
                </div>

                <div>
                    <label>Product Image URL</label>
                    <input 
                    value={product.imgUrl}
                    placeholder='Enter URL For Product Image'
                    type="text" 
                    onChange={(e)=> setProduct(prev=>({
                        ...prev,
                        imgUrl : e.target.value
                    }))}
                    required/>
                </div>
                    <motion.button
                    whileHover={{scale: 1.05, backgroundColor: 'rgba(16, 212, 19, 0.65)'}}
                    whileTap={{scale: 0.95}}
                    >ADD PRODUCT</motion.button>
                    
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
