import React from 'react'

export default function OrderSummary({cart, amount}) {
  return (
    <div className='order-summary-div'>
        <div className='bill-div'>
            <h2>Order Summary</h2>
            {cart.length === 0? 
                <p>Empty cart... Add Some items</p> :
                <div className='table-container'>
                <table className="bill"> 
                <thead>
                    <tr>
                        <th><p>Product Name</p></th>
                        <th><p>Count</p></th>
                        <th><p>Price(₹)</p></th>
                    </tr>    
                </thead>
                <tbody>
                    {cart.map((item, index) =>{
                        return (
                            <tr key={index}>
                                <td className='bill-product-name'>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td className='bill-price'>{item.price}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
                
            
            }
            <button
                hidden={ // hides pay button if cart is empty
                    cart.length===0}
                onClick={()=>makePayment(amount)}
                className="place-order-button">
                    PAY ₹ {amount}
            </button>
        </div>

    </div>
  )
}
