import React, { useState } from 'react'
import { motion } from 'framer-motion';

// Defina all category values and labels for the navbar items
const categories = ['shirts', 'pants', 'mobiles', 'multimedia', 'accessories']
const labels = ['SHIRTS', 'PANTS', 'MOBILES', 'MULTIMEDIA', 'ACCESSORIES'];

export default function NavBar({changeCategory}) {
  // TO track the currently selected category. Intially shirts are selected 
  const [selectedCategory, setSelectedCategory] = useState('shirts')

  function handleSelection(index){
    setSelectedCategory(categories[index])
    changeCategory(categories[index]);
  }

  return (
    <div className='nav-div'>
      {categories.map((category, index)=>{
        return <motion.div
        key={category} 
        style={{borderBottom : selectedCategory === category ? "2px solid  #00FFFF" : 'none' }}
        className='nav-item'
        whileHover={{ scale: 1.1, borderBottom : "2px solid #00FFFF"}}
        transition={{duration: 0.2}}
        onClick={()=> handleSelection(index)}
        >{labels[index]}</motion.div>
      })}
      </div >
  )
}


