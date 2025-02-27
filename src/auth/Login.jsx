import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import '../assets/styles.css'
import logo from "../assets/images/salessavvy_logo.png"

export default function () {
  const navigate = useNavigate();

  const[error, setError] = useState({
    visible: false,
    message: ""
  })

  // for checking the login status and dispble the button if one 
  // request for login is send
  const [logingIn, setLogingIn] = useState(false)

  // This is for the value of placeholders of each input fields
  const [placeholders, setPlaceholders] = useState({
    username: "Username",
    password: "Password",
  });

  // for choosing weather to display label for a field or not
  // According to design label and placeholder must be never shown together 
  const [labelsVisible, setLabelsVisible] = useState({
    username: false,
    password: false,
  });

  // value in each input field
  const [inputField, setInputField] = useState({
        username: "",
        password:"",
  });

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

//This useEffect is responsible for detecting when the browser autofills the username or password fields.

// It listens for the animationstart event, which is triggered when the browser applies its autofill styles.
  useEffect(() => {
    const handleAutofill = (e) => {
      if (e.animationName === 'onAutoFillStart') {
        const field = e.target.name;
        setLabelsVisible((prev) => ({
          ...prev,
          [field]: true,
        }));
        console.log(`Autofill detected in ${field}`);
      }
    };

    const usernameInput = usernameRef.current;
    const passwordInput = passwordRef.current;

    if (usernameInput) {
      usernameInput.addEventListener('animationstart', handleAutofill);
    }
    if (passwordInput) {
      passwordInput.addEventListener('animationstart', handleAutofill);
    }

    return () => {
      if (usernameInput) {
        usernameInput.removeEventListener('animationstart', handleAutofill);
      }
      if (passwordInput) {
        passwordInput.removeEventListener('animationstart', handleAutofill);
      }
    };
  }, []);

  // This useEffect is responsible for detecting when the browser autofills 
  // any one filed this will enable label for the other 
   useEffect(()=>{
      if(inputField.username !== ''){
        setLabelsVisible((prev)=>({
          ...prev,
          username: true
        }))
      }
      if(inputField.password !== ''){
        setLabelsVisible((prev)=>({
          ...prev,
          password: true
        }));
      }
  }, [inputField]);

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
    
    const { username, password} = inputField;

    if(!username || !password ){
      return
    }
      try {
       
      // disable the button and update status of login button
       setLogingIn(true);

       const response = await axios.post(
          "http://localhost:9090/api/login",
          { username, password}, // body conataining Username and Password
          { 
            withCredentials: true, // Ensures cookies 
            headers:{
            "Content-Type":"application/json"
          }}
        )

        if(response.status == 200){
            console.log("Login Success");
            console.log(response);
            
            if(response?.data?.role === 'ADMIN'){
                navigate("/adminHome");
            } else if(response?.data?.role === 'CUSTOMER'){
                navigate("/customerHome")
            } else {
                throw new Error("Unexpected Response...");
            }

        } else {
          throw new Error("Unexpected Response...");
        }

      } catch (err) {
        console.log(err?.response?.data);
        
        const error_message =err.response?.data?.message|| "Something went bad..Try again"
        setError({
          visible: true,
          message: error_message 
        });
        // enables and updates status of login button
        setLogingIn(false)

        const form = document.getElementsByClassName("signup-form")[0];
        form.style.border='1px solid rgba(234, 19, 19, 0.842)'; 
        form.style.boxShadow='0 0 10px rgba(255, 0, 0, 0.8)';
      }
    

    // clearing input fields
    setInputField((prev)=>({
      ...prev,
      username: "",
      password:"",
    }));

    // hiding the labels for all the fields 
    setLabelsVisible((prev)=>({
      ...prev,
      username: false,
      password: false,
    }))
  }

  return (

    <div className='login-div'>
      <div className='login-form-background'>
          <img className='logo' src={logo} alt="site-logo" />
          
          <h1>Login</h1>

          <form onSubmit={handleSubmit} className='signup-form'>
          <p
          style={{display: error.visible? "block": "none"}}
          className='login-error'
          >{error.message}
          </p>

              <label 
              className='form-label username-label'
              htmlFor="username"
              style={{display: labelsVisible.username ? 'block': 'none'}}
              >Username</label>
              
              <input 
              ref={usernameRef}
              className='form-input' 
              type="text"
              value={inputField.username}
              pattern='^[a-zA-Z0-9]{5,50}$'
              title="Username must 5-50 characters long and only alpabets and numbers " 
              name='username' 
              placeholder={placeholders.username} 
              onFocus={()=> handleInputFocus("username")}
              onBlur={()=>handleInputBlur("username")}
              onChange={(e)=> setInputField(prev=>({...prev, username:e.target.value}))}
              required
              />

              <br />
              
              <label  className='form-label'
              htmlFor="password"
              style={{display: labelsVisible.password ? 'block': 'none'}}
              >Password</label>
              
              <input 
              ref={passwordRef}
              className='form-input'
              name='password' 
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

            
              <br />

            <motion.button 
              className='submit-button' 
              type='submit'
              whileHover={{scale: 1.05}}
              whileTap={{scale: .95}}
              disabled = {logingIn? true: false}
            >
              {logingIn? "Loging In...": "Login" }
              </motion.button>
              
          </form>

          <p className='navigation-link'>New to SalesSavvy?  
            <span
              onClick={()=> navigate("/register")} 
            > Register here</span>
          </p>
      </div>
    </div>
    
  )
}
