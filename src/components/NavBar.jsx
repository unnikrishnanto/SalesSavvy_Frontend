import React, { useState } from 'react'

// Defina all category values and labels for the navbar items
const categories = ['shirts', 'pants', 'mobiles', 'accessories', 'mobile accessories']
const labels = ['SHIRTS', 'PANTS', 'MOBILES', 'ACCESSORIES', 'MOBILE ACCESSORIES'];

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
        return <div
        key={category} 
        style={{backgroundColor: selectedCategory === category ? "#9b9999df" : '' }}
        className='nav-item'
        onClick={()=> handleSelection(index)}
        >{labels[index]}</div>
      })}
      </div >
  )
}


