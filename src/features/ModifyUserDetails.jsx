import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios';
import { hatch, hourglass } from 'ldrs'
  
  
export default function ModifyUserDetails({setShowOptionsPopup, handleFetchingError}) {
  // Registering loading animation
  hourglass.register();
  hatch.register();

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
        updatedState[5] = false;
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
       transition={{type:'tween' ,duration: 0.5}}>
        <motion.div className="modify-user-form-container">
            <h3>USER DETAILS</h3>
            {!user?
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
              className='modify-user-form'
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
                <UserView user={user} setUser={setUser} handleFetchingError={handleFetchingError}/>
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

function UserView({user, setUser, handleFetchingError}){

    const [userFields, setUserFields] = useState(user);

    const [isUpdating, setIsUpdating] = useState(false);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setIsUpdating(true)

        try{
            const response = await axios.post(
                "http://localhost:9090/admin/users/modify",
                { ...userFields },
                {
                    headers:{ "Content-Type":"application/json"},
                    withCredentials : true
                }
            )

            if(response.status == 200){
                alert("User Data Updated Successfuly.")
                setUser(null);
            } 
        } catch (error) {
            if(error.response.status === 401){
                handleFetchingError(error.response?.data?.message || "Something went wrong")        
            } else {
                alert(error.response?.data?.message || "Invalid Input.");
            }
        }
        finally{
            setIsUpdating(false)
        }
    }

    return( 
    isUpdating?
        <div className='loading-animation-div'>
        <l-hourglass
        size="45"
        stroke="3.5"
        speed="1.5" 
        color="rgb(39, 173, 101)" 
        ></l-hourglass>
        <h3>Updating User details..</h3>    
        </div>
    :
    <motion.form 
      onSubmit={handleSubmit} 
      className='edit-user-form'
      initial={{scale: 0, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      transition={{type:"spring", duration:1.2}}>
        <div>
            <label>User ID</label>
            <input 
            disabled='true'
            value={userFields.userId}
            type="text"/>
        </div>
        
        <div>
            <label 
            >Username</label>
            <input
            value={userFields.username}
            placeholder='Enter Username'
            pattern='^[a-zA-Z0-9]{5,50}$'
            title="Username must 5-50 characters long and only alpabets and numbers " 
            type="text" 
            onChange={(e)=> setUserFields(prev=>({
                ...prev,
                username : e.target.value
            }))}
            required/>
        </div>

        <div>
            <label>Email</label>
            <input
            value={userFields.email}
            type="email"
            placeholder='Enter email' 
            onChange={(e)=> setUserFields(prev=>({
                ...prev,
                email : e.target.value
            }))}
            required/>
        </div>

        <div>
            <label>Role</label>
            <input 
            value={userFields.role}
            placeholder='Enter User Role'
            type="text" 
            onChange={(e)=> setUserFields(prev=>({
                ...prev,
                role : e.target.value
            }))}
            required/>
        </div>

        <div>
            <label>Registered On</label>
            <input 
            disabled='true'
            value={userFields.createdAt}
            type="text" 
            required/>
        </div>       

        <motion.button
        whileHover={{scale: 1.05, color: 'rgba(16, 212, 19, 0.65)'}}
        whileTap={{scale: 0.95}}
        >UPDATE USER</motion.button>
    </motion.form>
  )
}