import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import '../assets/styles.css'
export default function () {
  const navigate = useNavigate();

  const[error, setError] = useState({
    visible: false,
    message: ""
  })

  // for updating the  status and disble the button if one 
  // request is send for registering user
  const [registering, setRegistering] = useState(false)

  // This is for the value of placeholders of each input fields
  const [placeholders, setPlaceholders] = useState({
    username: "Username",
    password: "Password",
    email: "Email",
  });

  // for choosing weather to display label for a field or not
  // According to design label and placeholder must be never shown together 
  const [labelsVisible, setLabelsVisible] = useState({
    username: false,
    password: false,
    email: false,
  });

  // value in each input field
  const [inputField, setInputField] = useState({
        username: "",
        password:"",
        email:"",
        role:""
  });

  // executed when an input field is focused
  const handleInputFocus = (field)=>{
    // set placeholder of the field as empty
    setPlaceholders((prev)=>({
     ...prev,
    [field]:''
    }))

    // shows the label if input in the field is not empty
    if(inputField[field]===""){
        setLabelsVisible((prev)=>({
            ...prev,
            [field]: true
        }))
    }
  }

  
  // Executed when the focus is removed
  const handleInputBlur = (field)=>{
    let placeholder =""
    // chooses default place holder value based on fields
    switch(field){
        case "username":
            placeholder="Username"
            break;
        case "password":
            placeholder="Password"
            break;
        case "email":
            placeholder="Email"
            break;
        default:
            placeholder = "Enter you Input"
    }
    // sets the placedolder value for the field
    setPlaceholders((prev)=>({
        ...prev,
        [field]: placeholder
    }));
    
    //if input is empty the label is shown
    // if not the placeholder is shown by default
    if(inputField[field]===""){
        setLabelsVisible((prev)=>({
            ...prev,
            [field]: false
        }))
    }
  }

  
  // For handiling submission of registration form
  const handleSubmit = async (e)=>{
    e.preventDefault(); // prevents default operations like page refresh
    
    const { username, password, email, role } = inputField;

    if(!username || !password || !email || !role){
      return
    }
      try {
       
       // disables and updates status of Create account button
       setRegistering(true)
         
       const response = await axios.post(
          "http://localhost:9090/api/user/register",
          { username, password, email, role },
          {headers:{
            "Content-Type":"application/json"
          }}
        )

        if(response.status == 200){
          navigate("/")
        } else {
          throw new Error("Unexpected Response...");
        }

      } catch (err) {
        const error_message =err.response?.data?.message|| "Something went bad..Try again"
        setError({
          visible: true,
          message: error_message 
        });

        setRegistering(false)

        const form = document.getElementsByClassName("signup-form")[0];
        form.style.border='1px solid rgba(234, 19, 19, 0.842)'; 
        form.style.boxShadow='0 0 10px rgba(255, 0, 0, 0.8)';
        return;
      }
    

    // clearing input fields
    setInputField((prev)=>({
      ...prev,
      username: "",
      password:"",
      email:"",
      role:""
    }));

    // hiding the labels for all the fields 
    setLabelsVisible((prev)=>({
      ...prev,
      username: false,
      password: false,
      email: false,
    }))
  }

  return (
    <div className='signup-div'>
        <img className='logo' src="/src/assets/images/salessavvy_logo.png" alt="site-logo" />
        
        <h1>Register</h1>

        <form onSubmit={handleSubmit} className='signup-form'>
         <p
         style={{display: error.visible? "block": "none"}}
         className='error'
         >{error.message}
         </p>

            <div
            // This is a dummy div to prevent autocompletion of actual fields
            className='autocomplete'>
            <input
              name='username'
              type="text" />
             <input
              type="text" />
             <input
              type="password"/>
              <div className='cover'></div>
            </div>
            
            <label 
            className='form-label username-label'
            htmlFor="username"
            style={{display: labelsVisible.username ? 'block': 'none'}}
            >Username</label>
            
            <input 
            className='form-input' 
            type="text"
            value={inputField.username}
            pattern='^[a-zA-Z0-9]{5,50}$'
            title="Username must 5-50 characters long and only alpabets and numbers " 
            name='username' 
            autoComplete='off'
            placeholder={placeholders.username} 
            onFocus={()=> handleInputFocus("username")}
            onBlur={()=>handleInputBlur("username")}
            onChange={(e)=> setInputField(prev=>({...prev, username:e.target.value}))}
            required
            />
            
            <label  className='form-label'
            htmlFor="email"
            style={{display: labelsVisible.email ? 'block': 'none'}}
            >Email</label>
            
            <input 
            className='form-input' 
            type="email"  
            value={inputField.email}
            placeholder={placeholders.email} 
            autoComplete='off'
            onFocus={()=> handleInputFocus("email")}
            onBlur={()=>handleInputBlur("email")}
            onChange={(e)=> setInputField(prev=>({...prev, email:e.target.value}))}
            required
            />


            <label  className='form-label'
            htmlFor="password"
            style={{display: labelsVisible.password ? 'block': 'none'}}
            >Password</label>
            
            <input 
            className='form-input' 
            type="password"  
            pattern='^[a-zA-Z0-9!@&%*._]{8,}$'
            title='At least 8 characters with uppercase, lowercase, numbers and symbols ! @ & % * . _'
            value={inputField.password}
            placeholder={placeholders.password} 
            onFocus={()=> handleInputFocus("password")}
            onBlur={()=>handleInputBlur("password")}
            onChange={(e)=> setInputField(prev=>({...prev, password:e.target.value}))}
            required
            />

            <label 
            htmlFor="role"
            className='role-label'
            >Role</label>
            
            <select 
            name="role" 
            value={inputField.role} 
            onChange={(e)=>{setInputField((prev)=>({...prev, role: e.target.value}))}}
            required
            >
              <option value="" disabled hidden >Choose a Role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="CUSTOMER" >CUSTOMER</option>
            </select>
            
            <br />

            <motion.button 
            className='submit-button' 
            type='submit'
            whileHover={{scale: 1.05}}
            whileTap={{scale: .95}}
            disabled = {registering? true: false}
            >
              {registering? "Creating account...": "Create account" }
            </motion.button>
            
        </form>

        <p className='navigation-link'>Already a User?  
          <span
            onClick={()=> navigate("/")} 
          > Login here</span>
         </p>
    </div>
  )
}
