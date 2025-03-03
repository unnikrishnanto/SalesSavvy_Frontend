import {React, useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import leftArrow from "../assets/images/left_arrow.svg"
import LoadingAnimation from '../components/CustomerLoadingAnimation'
import CustomerProfileHeader from "../components/CustomerProfileHeader";
import ChangePasswordComponent from "../auth/ChangePasswordComponent";

export default function CustomerProfile() {

// For loading animation
const [isLoading, setIsLoading] = useState(true);


// to execute dropdown animation
const [isOpen, setIsOpen] =  useState(false)

// for refering dropdown menu for closing effect
const dropdownRef = useRef();

// Close dropdown when clicking outside
useEffect(() => {
function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
    }
}
document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const navigate = useNavigate();
const [showProfile, setShowProfile] = useState(true);

const [user,setUser] = useState({
    username: "Guest",
})

const [inputFields,setInputFields] = useState({
    username: "",
    password:"",
    email:"",
    role:""
}) 


const  [fetchingError,setFetchingError] = useState(false)

// To handle errors in API calls
const handleFetchingError = useCallback((message)=>{
    setFetchingError((prev)=>{
    if(!prev){
        confirm(message + "Login again....");
        navigate("/")
        return true
    }
    return prev;
    })
}, [navigate])



const fetchUserDetails= useCallback(
    async () => {
      try {
        const response = await axios({
          url:"http://localhost:9090/api/user/details", 
          method: "GET",
          headers :{
            "Content-Type" : "application/json"
          },
          withCredentials: true
        });
    
        if(response.status === 200){
          setUser(response.data?.user);
          setInputFields(response.data?.user);
        }
            
      } catch (error) {
        handleFetchingError("Couldn't load user details.");
      }
    },[handleFetchingError]);

  useEffect(()=>{
    const fetchData = async () => {
      await fetchUserDetails();
      setIsLoading(false)
    };

    fetchData();

  },[fetchUserDetails])

const[error, setError] = useState({
  visible: false,
  message: ""
})

// for updating the  status and disble the button if one 
// request is send for updating user
const [updating, setUpdating] = useState(false)

const [showChangePass, setShowChangePass] = useState(false)

// This is for the value of placeholders of each input fields
const [placeholders, setPlaceholders] = useState({
  username: "Username",
  role: "....",
  email: "Email",
});


// For handiling submission of updation form
const handleSubmit = async (e)=>{
  e.preventDefault(); // prevents default operations like page refresh
  
  const { username, email } = inputFields;

  if(!username || !email ){
    return
  }
  if(username === user.username && email === user.email){
    setError(prev=>({
        visible: true,
        message: "Same Data"
    }))
    return;
  }

    try {
     
     // disables and updates status of Update Data button
     setUpdating(true)
       
     const response = await axios.post(
        "http://localhost:9090/api/user/updateDetails",
        { username, email },
        {
            headers:{ "Content-Type":"application/json"},
            withCredentials: true
        }
      )
    //   console.log(response);
      
      if(response.status === 200){
        alert("Data updated Sucessfully");
        setUpdating(false);
        fetchUserDetails();
        setError(prev =>({
            visible: false,
            message: '' 
        }))
        const form = document.getElementsByClassName("signup-form")[0];
        form.style.border=''; 
        form.style.boxShadow='';
      } else {
        throw new Error("Updation Failed...");
      }

    } catch (err) {
      if(error.response?.status === 401){
        handleFetchingError("Session Expired ")
      }else{
        const error_message = err?.response?.data?.message || "Something went bad..Try again"
        setError(prev=>({
          visible: true,
          message: error_message 
        }));

        setUpdating(false)
        const form = document.getElementsByClassName("signup-form")[0];
        form.style.border='1px solid rgba(234, 19, 19, 0.842)'; 
        form.style.boxShadow='0 0 10px rgba(255, 0, 0, 0.8)';
      }
    }
  
}



  return (
     <div className='profile-main-div'>
     <CustomerProfileHeader user={user}></CustomerProfileHeader>
     {
        isLoading ? 
            <LoadingAnimation/>
        :
        <AnimatePresence>
         {showProfile &&
            <motion.div
            initial={{x : 1000}}
            animate={{x : 0}}
            transition={{type : 'tween', duration:0.8 , ease: 'easeInOut'}}
            exit={{x: 1000, opacity: 0}}
            className='profile-body'>
                <div className='orders-body-heading'>
                    <div 
                    className="home-nav" 
                    onClick={()=> {
                        setShowProfile(false)
                        setTimeout(() => {
                            navigate("/customerHome");
                            }, 600);  // Wait for exit animation to complete
                    }}
                    >
                        <motion.img 
                          whileHover={{scale: 1.2, boxShadow: '1px 1px 5px rgba(214, 214, 214, 0.7)'}}
                          whileTap={{ scale: 0.8 }}
                          transition={{type:'tween', duration:0.2, ease: 'easeInOut'}}
                          src={leftArrow} alt="<-" />
                    </div>
                    <h2>Profile</h2>
                </div>
                 <div className='profile-form-div'>
                        <form onSubmit={handleSubmit} className='signup-form'>
                         <p
                        className='error'
                        style={{display: error.visible? "block": "none"}}
                         >{error.message}
                         </p>
                
                            <div
                            // This is a dummy div to prevent autocompletion of actual fields
                            className='autocomplete'>
                            <input
                              name='username'
                              type="text" />
                            <input
                              name='email'
                              type="email" />
                             <input
                              type="password"/>
                              <div className='cover'></div>
                            </div>
                            
                            <label 
                            className='form-label username-label'
                            htmlFor="username"
                            >Username</label>
                            
                            <input 
                            className='form-input' 
                            type="text"
                            value={inputFields.username}
                            pattern='^[a-zA-Z0-9]{5,50}$'
                            title="Username must 5-50 characters long and only alpabets and numbers " 
                            name='username' 
                            autoComplete='off'
                            placeholder={placeholders.username} 
                            onChange={(e)=> setInputFields(prev=>({...prev, username:e.target.value}))}
                            required
                            />
                            
                            <label  className='form-label'
                            htmlFor="email"
                            >Email</label>
                            
                            <input 
                            className='form-input' 
                            type="email"  
                            value={inputFields.email}
                            placeholder={placeholders.email} 
                            autoComplete='off'
                            onChange={(e)=> setInputFields(prev=>({...prev, email:e.target.value}))}
                            required
                            />
                
                
                            <label  className='form-label'
                            htmlFor="password"
                            >Role</label>
                            
                            <input
                            disabled={true}
                            className='form-input' 
                            value={inputFields.role}
                            placeholder={placeholders.role} 
                            />
                            <br />
                
                            <motion.button 
                            className='submit-button' 
                            type='submit'
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: .95}}
                            disabled = {updating? true: false}
                            >
                              {updating? "Updating Data...": "Update Data" }
                            </motion.button>
                            
                        </form>
                    </div>

                    <AnimatePresence>
                    { 
                     !showChangePass &&
                        <motion.button 
                            className='show-change-password-button' 
                            onClick={()=>setShowChangePass(true)}
                            disabled={showChangePass}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: .95}}
                            initial={{y: -105}}
                            animate={{y : 0}}
                            exit={{y: -90, opacity: 0.9, scale: 0.95}}
                            transition={{type:'tween', duration: 0.5, ease: 'easeInOut' }}
                            >
                          Change Password
                        </motion.button>
                    }
                    </AnimatePresence>

                    
                    
                    <AnimatePresence>
                    {
                        showChangePass &&
                         <ChangePasswordComponent setShowChangePass={setShowChangePass}/>
                    }
                    </AnimatePresence>
                    
            </motion.div>
         }
        </AnimatePresence>
     }

    </div>
 )
 }

