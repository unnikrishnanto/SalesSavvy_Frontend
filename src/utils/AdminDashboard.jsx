import axios from 'axios'
import React from 'react'

export default function AdminDashboard() {
  const sendCookie =async ()=>{
    try {
      const response = await axios.post(
        "http://localhost:9090/api/products",
        {}, // Empty body
        {
          withCredentials: true, // Ensures cookies are sent
          headers: {
            "Content-Type": "application/json",
          },
        }
    );
    console.log(response);

    console.log(response.data);
    
    } catch (error) {
      console.log("Error:", error);  
    }
    
      
  }
  return (
    <>
      <div>AdminDashboard</div>
      <button
      onClick={sendCookie}
      >Send cookie</button>
    </>
    
  )
}
