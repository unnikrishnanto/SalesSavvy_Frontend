import React, { useState } from 'react'
import { motion } from 'framer-motion';
import defaultImage from '../assets/images/default_image.svg'


export default function ProductCard({product, addToCart}) {
    // Tacks if an addition is in progress
    const [isAdding,setIsAdding] = useState(false); 
    const add = async (productId)=>{
        setIsAdding(true)
        const status =await addToCart(productId);
        setIsAdding(false)
    }
  return (
    <motion.div
     className='product-card'
     exit={{ x: -200, opacity: 0 }} // Exit animation
     transition={{type: "spring", duration: 0.6}}
     whileHover={{scale : 1.05}}
     >
          <motion.img
            whileHover={{scale: 1.1}} 
            className="product-image" 
            src={product.imageUrl || defaultImage} 
            alt="Image Not Found"   
            onError={e=>{
              e.target.onerror = null;  // Prevent infinite loop 
              e.target.src =defaultImage
              }}  />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p className="product-price">Price ₹: {product.price}</p>
          <motion.button
            key={product.prodId}
            disabled= { product?.stock<=0 ||  isAdding ? true: false}
            className="add-to-cart-button"
            style={{opacity : isAdding? 0.7: 1}}
            whileHover={{ scale: [1, 1.05, 1] }} // Beating effect
            transition={{ duration: 0.6, ease: "easeInOut", repeat: 1 }} // Repeat only twice
            onClick= {()=> add(product.productId)}
          > {(product?.stock<=0)? "Out Of Stock":(isAdding? "Adding": "Add To Cart")
          }</motion.button>
        </motion.div>
  )
}

