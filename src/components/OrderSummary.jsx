import React from 'react'
import {motion} from 'framer-motion'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

export default function OrderSummary({cart, setcart, amount, user, fetchCartDetails, setVerifyingPayment}) {
    const navigate = useNavigate();
    const shipping = (amount*0.1).toFixed(2);
    const totalAmount = (parseFloat(amount) + parseFloat(shipping)).toFixed(2);
    const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

    // Razorpay integration for payment
    const handlePlaceOrder = async () =>{
      try {
        // This is for making sure that the products in the cart are available before making payment
        const currentCount = cart.length;
        const updatedcart = await fetchCartDetails(); // Ensure fresh data

        if (!updatedcart || updatedcart.length !== currentCount) { 
            alert("Some Items in your cart are no longer available.");
            setcart(updatedcart);
            return;
        }

        // Payload for creating the Order
        const requsetBody = {
          totalAmount: totalAmount,
          cartItems : cart.map((item)=>({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
          }))
        };

        // Create Razorpay order via backend
        const response = await axios.post(
          "http://localhost:9090/api/payment/create",
          requsetBody,{
          headers:{
            "Content-Type" : "application/json"
          },
          withCredentials: true
        }
        );
        
        //  If order creation failed
        if(response.status !== 200){
          throw new Error(response.data);
        }

        const razorpayOrderId = response.data?.orderId;
        // console.log("Order id: " + razorpayOrderId);
        
        // Open Razorpay checkout interface
        const options = {
          key: RAZORPAY_KEY_ID, // Razorpay Key ID
          amount: totalAmount * 100, // Razorpay expects amount in paise
          currency: "INR",
          name: "SalesSavvy",
          description: "Test Transaction",
          order_id: razorpayOrderId, // orderId from backend
          // This handler will handle the response from the razorpay client
          handler: async function (response) {
            try {
              // starts the pament verification animation
              setVerifyingPayment(true);
              
              // Payment success, verify on backend
              const verifyResponse = await axios.post(
                "http://localhost:9090/api/payment/verify",
                {
                  razorpayOrderId: response.razorpay_order_id, // Ensure key matches backend
                  razorpayPaymentId: response.razorpay_payment_id, // Ensure key matches backend
                  razorpaySignature: response.razorpay_signature, // Ensure key matches backend
                },
               {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              });

            if (verifyResponse.status === 200) {
              alert("Payment verified successfully!");
              navigate("/customerHome"); // Redirect to Customer Home Page
            } else {
              alert("Payment verification failed: " + verifyResponse.data);
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
          contact: "9800497855",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // OPENING RAZORYPAY CLIENT
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      if(error.response && error.response?.status === 401){
        handleFetchingError('Session Expired');
      }
      alert("Payment failed. Please try again.");
      console.error("Error during checkout:", error);
    } finally{
      
        // stops the pament verification animation
        setVerifyingPayment(false);
    }
  };
  
  return (
    <div className='order-summary-div'>
        <h2>Order Summary</h2>
        <div className='orders-summary-list-div'>
          <div className='order-summary-item'> <p><b>SubTotal</b></p> <p>{amount}</p></div>
          <div className='order-summary-item'> <p><b>Shipping</b></p> <p>{shipping}</p></div>
          <div className='order-summary-item'> <p><b>Total</b></p> <p>{totalAmount}</p></div>
        </div>
        <motion.button
          onClick={()=>handlePlaceOrder()}
          className="place-order-button"
          initial={{ opacity: 0, scale: 0.5 }} 
          animate={{ opacity: 1, scale: 1, backgroundColor: 'rgb(95, 95, 95)' }}  
          whileTap={{ scale: 0.9 }}  
          whileHover={{ backgroundColor: 'rgb(44, 43, 43)', scale: 1.01 }}
        >PLACE ORDER
        </motion.button>
    </div>
  )
}
