import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios';
import AdminLoadingAnimation from '../components/AdminLoadingAnimation';
  

export default function ManageProduct({setShowOptionsPopup, handleFetchingError}) {
  const [isDeleting, setIsDeleting] = useState(false); 
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); 

  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);


  // For automatically focusing on input field on load
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    if (!isFetching) {
        inputRef.current?.focus();
      }  // Automatically focus on load
  }, [isFetching]);
  
  
  const closePopup = ()=>{
    setShowOptionsPopup(prev=>{
        const updatedState = [...prev]; 
        updatedState[3] = false;
        return updatedState;
    })
  }

  // Deleting product from DB
  const deleteProduct = async()=> {
    setIsDeleting(true);

    try {
      const response = await axios({
       method : 'DELETE',  
       url: 'http://localhost:9090/admin/products/delete',
       data:{productId : product?.productId},
       headers:{"Content-Type" : 'application/json'},
       withCredentials: true
     });
      
      if(response.status === 200){
         alert("Product Deleted Successfuly");
      }
         
     } catch (error) {
       if(error.response && error.response.status === 401){
         handleFetchingError(error.response?.data?.message || "Something went wrong.")
      } else {
         alert(error.response?.data?.message);
      }
     } finally {
      setIsDeleting(false);
      setProduct(null);
     }    
  }

  const fetchProductDetails = async (e) =>{
    e.preventDefault();
    setIsFetching(true);
    try{
      const response = await axios.get(
        `http://localhost:9090/admin/products/details`, // URL
        {
            params: { productId }, // Use 'params' for query parameters
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        }
    );
     
     if(response.status === 200){
        setProduct(response.data.product);
     }
        
    } catch (error) {
      if(error.response && error.response.status === 404 || error.response.status === 400  ){
        alert(error.response?.data?.message);
     } else {
        handleFetchingError(error.response?.data?.message || "Something went wrong.")
     }
    } finally {
      setProductId('')
      setIsFetching(false);
    }
  }

  const updateProduct = async(e) => {
    e.preventDefault();
    setIsUpdating(true)
     
     const trimmedProduct = {
        ...product,
        name: product.name.trim(),
        description: product.description.trim(),
        imageUrl: product.imageUrl.trim(),
    };

    // Validate numeric values
    if (trimmedProduct.price <= 0 || trimmedProduct.stock < 0 || trimmedProduct.categoryId <= 0) {
        alert("Invalid numeric values. Please enter correct details.");
        setIsUpdating(false);
        return;
    }

    // Updating product
    try {
     const response = await axios.post(
        'http://localhost:9090/admin/products/update',
        {...trimmedProduct},
        {
            headers:{"Content-Type" : 'application/json'},
            withCredentials: true
        }
     );
     
     if(response.status === 200){
        alert("Product updated Successfuly");
     }
        
    } catch (error) {
        if(error.response && error.response.status === 401){
            handleFetchingError(error.response?.data?.message || "Something went wrong.")
         } else {
            alert(error.response?.data?.message);
         }
    } finally{
        setIsUpdating(false);
    }
  }

  const handleFetchSubmit = async(e) =>{
    e.preventDefault();
    setIsFetching(true)
     
    // Validate numeric values
    if (productId <= 0) {
        alert("ID must be numeric and greater then zero. Please enter correct details.");
        isFetching(false);
        return;
    }
    await fetchProductDetails();
  }
  

  return (
    <motion.div className='admin-popup'
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity:0}}
          transition={{type:'tween' ,duration: 0.5}}
          >
        <motion.div className="manage-product-form-container">
            <h3>MANAGE PRODUCT</h3>
            {isFetching ?
                <AdminLoadingAnimation message={"Fetching product details from database"}/>
              :
                isDeleting?
                  <AdminLoadingAnimation message={"Removing the product from database"}/>
                : isUpdating?
                  <AdminLoadingAnimation message={"Updating the product data"} />    
                :
                product ?
                  <motion.form 
                      onSubmit={updateProduct}
                      className='update-product-form'
                      initial={{scale: 0, opacity: 0}}
                      animate={{scale: 1, opacity: 1}}
                      transition={{type:"spring", duration:1.2}}
                      >
                      <div>
                          <label>Product ID</label>
                          <input 
                          disabled= {true}
                          value={product.productId}
                          type="number" 
                          required/>
                      </div>

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
                          value={product.imageUrl}
                          placeholder='Enter URL For Product Image'
                          type="text" 
                          onChange={(e)=> setProduct(prev=>({
                              ...prev,
                              imageUrl : e.target.value
                          }))}
                          required/>
                      </div>

                      <div>

                        <motion.button
                          type='submit'
                          whileHover={{scale: 1.05, backgroundColor: '#10d413'}}
                          whileTap={{scale: 0.95}}
                          >UPDATE PRODUCT</motion.button>

                        <motion.button
                          onClick={deleteProduct}
                          whileHover={{scale: 1.05, backgroundColor: '#c30909'}}
                          whileTap={{scale: 0.95}}
                          >DELETE PRODUCT</motion.button>

                      </div>                          
                  </motion.form>
                 :
                  <motion.form 
                    onSubmit={fetchProductDetails} 
                    className='manage-product-form' 
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
                        whileHover={{scale: 1.05, backgroundColor: '#807f7f'}}
                        whileTap={{scale: 0.95}}
                      >FETCH PRODUCT DETAILS</motion.button>
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
