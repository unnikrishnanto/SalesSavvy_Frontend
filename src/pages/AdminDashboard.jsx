import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '../assets/images/site_logo_light.jpg'
import ViewAllProducts from '../features/ViewAllProducts'
import ViewAllUsers from '../features/ViewAllUsers'
import AddProduct from '../features/AddProduct'
import ViewUserDetails from '../features/ViewUserDetails'
import ModifyUserDetails from '../features/ModifyUserDetails'
import ReportByDate from '../features/ReportByDate'
import ReportByMonth from '../features/ReportByMonth'
import ReportByYear from '../features/ReportByYear'
import OverallReport from '../features/OverallReport'
import ManageProduct from '../features/ManageProduct'

export default function AdminDashboard() {

  const navigate = useNavigate();
  //Logout button's opacity
  const [logoutOpacity, setLogoutOpacity] = useState(1);

  //Admin object for admin data from backend
  const [admin,setAdmin] = useState({
    username : "Admin"
  })

  
  // There are 10 options available and each with corresponding popups
  // Each index from 0 to 9 represents these options from top to bottom
  // eg : 0 - > View All Users ,...., 9 -> Overall Report
  const [showOptionsPopup, setShowOptionsPopup] = useState(
    [false, false, false, false, false, false, false, false, false, false, ]
  )

  const openPopup= (index)=>{
    setShowOptionsPopup(prev => {
      const updatedState = [...prev]; 
      updatedState[index] = true;
      return updatedState;
    })
  }
  
  const  [fetchingError,setFetchingError] = useState(false)
  // To handle errors in API calls
  const handleFetchingError = useCallback((message)=>{
      setFetchingError((prev)=>{
      if(!prev){
          confirm(message + " Login again....");
          navigate("/")
          return true
      }
      return prev;
      })
  }, [navigate])

  const fetchAdmin= useCallback(
  async () => {
    try {
      const response = await axios({
        url:"https://salessavvy.onrender.com/api/user/details", 
        method: "GET",
        headers :{
          "Content-Type" : "application/json"
        },
        withCredentials: true
      });
  
      if(response.status === 200){
        setAdmin(response.data?.user);
      }
          
    } catch (error) {
      handleFetchingError("Couldn't load Admin details.");
    }
  },[handleFetchingError]);

  useEffect(()=>{
    fetchAdmin();
  }, [])

  const logout = ()=>{
    setLogoutOpacity(0);
    setTimeout(async ()=>{
      try {
        // sending a post request to logout endpoint to delete token 
        const response = await axios.post(
        "https://salessavvy.onrender.com/api/logout",
        {},
        {
            headers:{
            "Content-Type": "application/json"
            },
            withCredentials : true
        }
    );

    if(response.status === 200){
        // console.log("Logout Successful");
        navigate("/");
    }
    
    } catch (error) {
      if(error.response?.status === 401){
        navigate("/")
      }else{
        setLogoutOpacity(1);
        alert("Logout failed..");
      }
    }
    }, 1000)
  }

 
  return (

    <div className='admin-main-div'>
      <header className="admin-page-header">
         <div className='admin-logo-div'>
          <img className='header-logo' src={logo} alt="site logo" />
          <h2>SalesSavvy</h2>
         </div>  

         <div className='admin-header-tail'>
            <h3>{admin.username.toUpperCase()}</h3>
            <motion.button
              className='admin-logout-button'
              animate={{opacity: logoutOpacity}}
              transition={{duration: 1.5}}
              onClick={()=>logout()}
             ><motion.p 
                whileHover={{scale : 1.2}}
                >Logout</motion.p>
            </motion.button>
          </div> 
     </header>

      <div className='spacing-div'></div>

      <div className='admin-page-body'> 

        <motion.div className='admin-option-div'
          initial={{x : -250 , opacity: 0}}
          whileInView={{x : 0, opacity: 1}}
          transition={{type:'spring', duration: 2,}}
        >
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(0)}
          > View All Users </motion.button>
          <h4>View all registered users in the system</h4>
          <p>Team : User Management</p>
        </motion.div>

        <motion.div className='admin-option-div'
          initial={{x : 250, opacity: 0}}
          whileInView={{x : 0, opacity: 1}}
          transition={{type:'spring', duration: 2,}}>
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(1)}
          > View All Products </motion.button>
          <h4>Browse the entire product catalog.</h4>
          <p>Team : Product Management</p>
        </motion.div>


        <motion.div className='admin-option-div'
          initial={{x : -250 , opacity: 0}}
          whileInView={{x : 0, opacity: 1}}
          transition={{type:'spring', duration: 2,}}>
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(2)}
          > Add Product </motion.button>
          <h4>Add a new product to the catalog with necessary details.</h4>
          <p>Team : Product Management</p>
        </motion.div>


        <motion.div className='admin-option-div'
          initial={{x : 250 , opacity: 0}}
          whileInView={{x : 0, opacity: 1}}
          transition={{type:'spring', duration: 2,}}>
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(3)}
          >  Manage Product </motion.button>
          <h4>Update or remove an existing product from the catalog.</h4>
          <p>Team : Product Management</p>
        </motion.div>


        <motion.div className='admin-option-div'
          initial={{x : -250 , opacity: 0}}
          whileInView={{x : 0, opacity: 1}}
          transition={{type:'spring', duration: 2,}}>
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(4)}
          > View User Details </motion.button>
          <h4>Check individual user details and activity.</h4>
          <p>Team : User Management</p>
        </motion.div>


        <motion.div className='admin-option-div'
          initial={{x : 250 , opacity: 0}}
          whileInView={{x : 0, opacity : 1}}
          transition={{type:'spring', duration: 2,}}>
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(5)}
          > Modify User Details </motion.button>
          <h4>Update user account information and roles.</h4>
          <p>Team : User Management</p>
        </motion.div>


        <motion.div className='admin-option-div'
          initial={{x : -250 , opacity: 0}}
          whileInView={{x : 0, opacity: 1}}
          transition={{type:'spring', duration: 2,}}>
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(6)}
          > Report by Date </motion.button>
          <h4>View sales and activity summary for a specific date.</h4>
          <p>Team : Analytics</p>
        </motion.div>


        <motion.div className='admin-option-div'
          initial={{x : 250 }}
          whileInView={{x : 0}}
          transition={{type:'spring', duration: 2,}}>
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(7)}
          >Report by Month </motion.button>
          <h4> Analyze sales and performance data for a given month and year.</h4>
          <p>Team : Analytics</p>
        </motion.div>


        <motion.div className='admin-option-div'
          initial={{x :-250 }}
          whileInView={{x : 0}}
          transition={{type:'spring', duration: 2,}}>
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(8)}
          > Report by Year </motion.button>
          <h4>Review yearly statistics and business insights for a specific year.</h4>
          <p>Team : Analytics</p>
        </motion.div>


        <motion.div className='admin-option-div'
          initial={{x : 250 }}
          whileInView={{x : 0}}
          transition={{type:'spring', duration: 2,}}>
          <motion.button 
            className='admin-option-button'
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={()=>openPopup(9)}
          > Overall Report </motion.button>
          <h4>Get a complete overview of all reports and analytics.</h4>
          <p>Team : Analytics</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showOptionsPopup[0] &&
          <ViewAllUsers setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        }
      </AnimatePresence>

      <AnimatePresence>
        {showOptionsPopup[1] &&
          <ViewAllProducts setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        }
      </AnimatePresence>
      
      <AnimatePresence>
        {showOptionsPopup[2] &&
          <AddProduct setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        }
      </AnimatePresence>
      
      <AnimatePresence>
        {showOptionsPopup[3] &&
            <ManageProduct setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        }
      </AnimatePresence>
      
      <AnimatePresence>     
        {showOptionsPopup[4] &&
            <ViewUserDetails setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        }
      </AnimatePresence>

      <AnimatePresence>
        {showOptionsPopup[5] &&
          <ModifyUserDetails setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        }
      </AnimatePresence>
        
      <AnimatePresence>
        {showOptionsPopup[6] &&
          <ReportByDate setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        }
      </AnimatePresence>
             
      <AnimatePresence>
        {showOptionsPopup[7] &&
          <ReportByMonth setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        } 
      </AnimatePresence>

      <AnimatePresence>
        {showOptionsPopup[8] &&
          <ReportByYear setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        } 
      </AnimatePresence>
      
      <AnimatePresence>
        {showOptionsPopup[9] &&
          <OverallReport setShowOptionsPopup={setShowOptionsPopup} handleFetchingError={handleFetchingError}/>
        }
      </AnimatePresence>

    </div>

    
  )
}
