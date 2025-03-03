import React, { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios';
import { useEffect } from 'react';
import { waveform } from 'ldrs'

export default function ViewAllUsers({setShowOptionsPopup, handleFetchingError}) {
  
  // Registering loading animation
  waveform.register()

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([])
  
  const closePopup = ()=>{
    setShowOptionsPopup(prev=>{
        const updatedState = [...prev]; 
        updatedState[0] = false;
        return updatedState;
    })
  }

  const fetchAllUsers = useCallback(
    async()=>{
        try{
            const response = await axios.get(
                'http://localhost:9090/admin/users/all',
                {
                    headers:{"Content-Type":'application/json'},
                    withCredentials: true
                }
            );
            
            if(response.status === 200){
                setUsers(response?.data?.users)
            }

        } catch(err){
            handleFetchingError(err?.data?.message || "Something weent wrong. ")
        }

    }, [handleFetchingError]);
 
  useEffect(()=>{
    const fetchUsers = async() =>{
        await fetchAllUsers()
        setIsLoading(false);
    }
    fetchUsers()
  }, [fetchAllUsers])  

  return (
    <motion.div className='admin-popup'
          initial={{y : -600, opacity: 0}}
          animate={{y : 0, opacity: 1}}
          exit={{y : -800, opacity: 0}}
          transition={{type:'spring', duration:1.2, ease:'easeIn'}}>
        <motion.div
          className="view-all-users-div">
            <h3>All Users</h3>
            {isLoading ?
            <div className='admin-loading-animation-div'>
                <l-waveform
                size="35"
                stroke="3.5"
                speed="1" 
                color="rgb(39, 173, 101)" 
               ></l-waveform>
               <h3>Loading all the users</h3>    
            </div>
                         :
            <div className='admin-table-container'>
            <table className='admin-table'>
                    <tr>
                        <th>USER ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ROLE</th>
                        <th>ACCOUNT ACTIVATION</th>
                    </tr>
                    {users.length === 0 ?
                        <tr>
                            <td colSpan={5}
                                style={{textAlign: 'center'}}
                            >No Users to Display...</td>
                        </tr>
                        
                    :
                    
                    users.map((p, index) =>{
                        return (<tr key={index} >
                                <td className='table-id-data'>{p.userId}</td>
                                <td>{p.username}</td>
                                <td>{p.email}</td>
                                <td>{p.role}</td>
                                <td>{p.createdAt}</td>
                            </tr>)
                    })
                    
                }
                </table>
            </div>
            }

            <motion.button
            whileHover={{scale: 1.1, color: 'rgba(39, 39, 38, 0.65)'}}
            whileTap={{scale: 0.9}}
            onClick={()=>closePopup()}
            >X</motion.button>

        </motion.div>
    </motion.div>
  )
}
