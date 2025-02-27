import React from 'react'
import {motion} from 'framer-motion'
import loadingImg from "../assets/images/loading.svg"

export default function LoadingAnimationComponent() {
  return (
    <div className='loading-div'>
    <motion.img 
     animate={{rotate: [0, 360]}}
     transition={{type:'spring', duration: 1.3 , repeat: Infinity, ease: "linear"}}
     src={loadingImg} alt="." />
     Loading....
  </div>
  )
}
