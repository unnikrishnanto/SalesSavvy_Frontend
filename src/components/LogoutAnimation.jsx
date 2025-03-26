import React from 'react'
import CustomerLoadingAnimation from './CustomerLoadingAnimation'

export default function LogoutAnimation() {
  return (
    <div className="logingout-popup">
        <CustomerLoadingAnimation message={'Logging Out'}/>
    </div> 
  )
}
