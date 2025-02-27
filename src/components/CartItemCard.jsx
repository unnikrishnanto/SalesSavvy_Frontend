import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import deleteIcon from "../assets/images/delete_icon.svg"

export default function CartItemCard({item, updateCart, deleteCartItem}) { 
 
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [showItem, setShowItem] = useState(true);

  const incrementQty = async (item) => {
    if(!updating){
        setUpdating(true)
        await updateCart(item.productId, item.quantity+1) 
        setUpdating(false)   
    }
  }

  const decrementQty = async (item) => {
    if(!updating){
        setUpdating(true)
        await updateCart(item.productId, item.quantity-1) 
        setUpdating(false)   
    }
  }

  const deleteItem = async (item) =>{
    if(!deleting){
        setShowItem(false)
        setDeleting(true)
        await deleteCartItem(item.productId)
        setDeleting(false)
    }

  }
  return (

    <AnimatePresence>
     {showItem &&
        <motion.div 
        //  initial={{x: 100}}
        //  animate={{x: 0}}
        exit={{x: -200, opacity: 0}}
        transition={{type:'tween'}}
         className='cart-item-card'>
            <img 
            src={item.imgUrl} 
            className='cart-item-img' 
            alt="image not found" />
            <div className='item-details'>
                <p>{item.name}</p>
                <p>Price : ₹ {item.price}</p>
            </div>
            <div className='quantity-div'>

                
                <motion.div
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                style={{opacity: updating? '50%': '100%'}}
                onClick={()=> decrementQty(item)}
                >-</motion.div>
                
                <p>{item.quantity}</p>

                <motion.div
                onClick={()=>incrementQty(item)}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                style={{opacity: updating? '50%': '100%'}}
                >+</motion.div>

            </div>
            <motion.button 
                disabled={deleting? true: false}
                className='delete-item-button'
                style={{opacity: deleting? '50%': '100%'}}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                onClick={()=> deleteItem(item)}
                >
                <img src={deleteIcon}  alt="DELETE" />
            </motion.button>        
        </motion.div>
     }
    </AnimatePresence>
    
  )
}
