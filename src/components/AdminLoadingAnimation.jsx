import { hatch } from 'ldrs'
import React from 'react'

export default function AdminLoadingAnimation({message}) {
  
  // Registring animation  
  hatch.register();  
  return (
    <div className='loading-animation-div'>
        <l-hatch
        size="35"
        stroke="3.5"
        speed="1.5" 
        color="rgb(39, 173, 101)" 
        ></l-hatch>
        <h3>{message}...</h3>    
    </div>
  )
}
