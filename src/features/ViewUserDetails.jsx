import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios';
import { hatch } from 'ldrs'
  
export default function ViewUserDetails({setShowOptionsPopup, handleFetchingError}) {
  // Registering loading animation
  hatch.register()

  const [isFetching, setIsFetching] = useState(false); 
  
  // For automatically focusing on input field on load
  const inputRef = useRef(null);

  useEffect(() => {
        inputRef.current?.focus();  // Automatically focus on load
  });
  
  
  
  const [userId, setUserId] = useState('')
  const [user, setUser]  = useState(null); 
  
  const closePopup = ()=>{
    setShowOptionsPopup(prev=>{
        const updatedState = [...prev]; 
        updatedState[4] = false;
        return updatedState;
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setIsFetching(true)
     

    // Validate numeric values
    if (userId <= 0) {
        alert("ID must be numeric and greater then zero. Please enter correct details.");
        setIsFetching(false);
        return;
    }

    // Fetching User Data from DB
    try {
     const response = await axios.get(
        `http://localhost:9090/admin/users/details`, // URL
        {
            params: { userId }, // Use 'params' for query parameters
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        }
    );
     console.log(response);
     
     if(response.status === 200){
        setUser(response.data.user);
     }
        
    } catch (error) {
      if(error.response && error.response.status === 404){
        alert(error.response?.data?.message);
     } else {
        console.log(error);
        handleFetchingError(error.response?.data?.message || "Something went wrong.")
     }
    } finally{
      // Clearing Field
      setUserId('')
      setIsFetching(false)
    }
  }

  return (
    <motion.div className='admin-popup'
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity:0}}
      transition={{type:'tween' ,duration: 0.5}}
      >
      <motion.div className="fetch-user-form-container">
          <h3>USER DETAILS</h3>
          {!user ?
            isFetching ?
              <div className='loading-animation-div'>
                <l-hatch
                size="35"
                stroke="3.5"
                speed="1.5" 
                color="rgb(39, 173, 101)" 
                ></l-hatch>
                <h3>Fetching User details..</h3>    
              </div>
            :
            <motion.form 
              onSubmit={handleSubmit} 
              className='fetch-user-form'
              initial={{scale: 0, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{type:"spring", duration:1.2}}>
    
                <label>Enter Id of the User to be fetch data ?</label>
                <input
                ref={inputRef} 
                value={userId}
                placeholder='Enter User ID'
                type="number" 
                onChange={(e)=> setUserId( e.target.value === "" ? "" : Number(e.target.value))}
                required/>

                  <motion.button
                    whileHover={{scale: 1.05, color: 'rgba(233, 70, 10, 0.65)'}}
                    whileTap={{scale: 0.95}}
                  >GET USER DETAILS</motion.button>    
          </motion.form>
        :
          <div>
              <UserView user={user}/>
          </div>
      }
      <motion.button
          whileHover={{scale: 1.1, color: 'rgb(242, 229, 118)'}}
          whileTap={{scale: 0.9}}
          onClick={()=>closePopup()}
          >CLOSE</motion.button>
      </motion.div>
    </motion.div>
  )
}

function UserView({user}){

  return( 
    <motion.form 
      className='add-product-form'
      initial={{scale: 0, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      transition={{type:"spring", duration:1.2}}>      
        <div>
            <label>User ID</label>
            <input 
            disabled='true'
            value={user.userId}
            type="text"/>
        </div>
        
        <div>
            <label 
            >Username</label>
            <input
            disabled='true'
            value={user.username}
            />
        </div>

        <div>
            <label>Email</label>
            <input 
            disabled='true'
            value={user.email}
            type="text"/>
        </div>

        <div>
            <label>Role</label>
            <input 
            disabled='true'
            value={user.role}
            type="text" 
            />
        </div>

        <div>
            <label>Registered On</label>
            <input 
            type='text'
            value={user.createdAt}/>
        </div>        
    </motion.form>
  )
}