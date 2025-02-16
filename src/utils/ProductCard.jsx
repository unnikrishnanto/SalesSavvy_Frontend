import React, { useState } from 'react'

export default function ProductCard({product, addToCart}) {
    // Tacks if an addition is in progress
    const [isAdding,setIsAdding] = useState(false); 

    const add = async (productId)=>{
        setIsAdding(true)
        await addToCart(productId)        
        setIsAdding(false)

    }
  return (
    <div
     className='product-card'
     >
          <img className="product-image" src={product.imageUrl} alt="" />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p className="product-price">Price ₹: {product.price}</p>
          <button
            disabled= {isAdding? true: false}
            className="add-to-cart-button"
            style={{opacity : isAdding? 100: 70}}
            onClick= {()=> add(product.productId)}
          > {isAdding? "Adding": "Add To Cart"}</button>
        </div>
  )
}

