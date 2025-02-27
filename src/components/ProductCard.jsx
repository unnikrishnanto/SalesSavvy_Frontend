import React, { useState } from 'react'
import { motion } from 'framer-motion';

import defaultImage from '../assets/images/default_image.png'

export default function ProductCard({product, addToCart}) {
    // Tacks if an addition is in progress
    const [isAdding,setIsAdding] = useState(false); 
    const add = async (productId)=>{
        setIsAdding(true)
        await addToCart(productId)        
        setIsAdding(false)

    }
  return (
    <motion.div
     className='product-card'
     initial={{x: 200, opacity: 0}}
     animate={{x : 0, opacity: 1}}
     exit={{ x: -200, opacity: 0 }} // Exit animation
     transition={{type: "spring", duration: 0.8}}
     whileHover={{scale : 1.02}}
     >
          <img 
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
            disabled= {isAdding? true: false}
            className="add-to-cart-button"
            style={{opacity : isAdding? 0.7: 1}}
            whileHover={{ scale: [1, 1.05, 1] }} // Beating effect
            transition={{ duration: 0.6, ease: "easeInOut", repeat: 1 }} // Repeat only twice
            onClick= {()=> add(product.productId)}
          > {isAdding? "Adding": "Add To Cart"
          }</motion.button>
        </motion.div>
  )
}

