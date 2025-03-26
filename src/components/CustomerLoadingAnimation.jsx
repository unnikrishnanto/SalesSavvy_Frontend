import { metronome } from 'ldrs'
import React from 'react'


export default function CustomerLoadingAnimation({message}) {
  metronome.register();
  return (
    <div className='customer-loading-animation'>
      <div>
      <l-metronome
        size="60"
        stroke="3.5"
        speed="1.5" 
        color="rgb(39, 173, 101)" 
        ></l-metronome>
        <h3>{message}...</h3>   
      </div>
    </div>
  )
}
