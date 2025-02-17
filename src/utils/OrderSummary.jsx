import React from 'react'
import {motion} from 'framer-motion'

export default function OrderSummary({cart, amount}) {
    const shipping = (amount*0.1).toFixed(2);
    const totalAmount = (parseFloat(amount) + parseFloat(shipping)).toFixed(2);
    const makePayment = () =>{

    }
  return (
    <div className='order-summary-div'>
        <h2>Order Summary</h2>
        <div className='orders-div'>
          <div className='order-item'> <p><b>SubTotal</b></p> <p>{amount}</p></div>
          <div className='order-item'> <p><b>Shipping</b></p> <p>{shipping}</p></div>
          <div className='order-item'> <p><b>Total</b></p> <p>{totalAmount}</p></div>
        </div>
        <motion.button
          onClick={()=>makePayment()}
          className="place-order-button"
          initial={{ scale: 0.5 , backgroundColor: 'rgb(95, 95, 95)'}}
          animate={{ scale: 1, transition: { type: "tween", ease:'easeInOut' } }}  
          whileTap={{ scale: 0.9 }}  
          whileHover={{backgroundColor: 'rgb(61, 61, 61)', scale: 1.01}}
          style={{ pointerEvents: "auto" }}  
        >PLACE ORDER
        </motion.button>
    </div>
  )
}
