import React, { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
export default function ChangePasswordComponent({setShowChangePass}) {

    const [changingPass, setChangingPass] = useState(false)

    const [inputFields, setInputFields] = useState({
        oldPassword: '',
        newPassword : '',
        newPasswordRepeat : ''
    })

    const placeholders  = {
        old: "Enter old password",
        newPassword: "Enter new password",
        newPasswordRepeat: "Repeat new password"
    }

     const[error, setError] = useState({
        visible: false,
        message: "hello"
    })

    const handleSubmition = async(e)=>{
        e.preventDefault();

        const {oldPassword, newPassword, newPasswordRepeat} = inputFields;

        if(newPassword !== newPasswordRepeat){
            setError(prev=>({
                visible: true,
                message: "New passwords must be same"
            }))
        } else if(oldPassword === newPasswordRepeat){
            setError(prev=>({
                visible: true,
                message: "Old and New Passwords must be different"
            }))
        } else {
            try{

                const response = await axios.post(
                    "https://salessavvy.onrender.com/api/user/changePassword",
                    {
                        oldPassword,
                        newPassword
                    },
                    {
                        headers:{ "Content-Type":"application/json"},
                        withCredentials: true
                    }
                );

                if(response.status === 200){
                    alert("Password changed Successfully.")
                    setShowChangePass(false)
                }

            } catch(err){
                
                const err_msg = err?.response?.data?.message || "Password Chanaging Failed"
                setError(prev=>({
                    visible: true,
                    message: err_msg
                }))

            }
        }

        setInputFields(prev=>({
            oldPassword: '',
            newPassword : '',
            newPasswordRepeat : ''
        }))

    }


  return (
    <motion.div 
      className="password-change-div"
      initial={{scale: 0.4, opacity: 0.4}}
      animate={{scale: 1, opacity: 1}}
      exit={{scale: 0.4, opacity: 0}}
      transition={{type: 'spring', duration: 1}}
    >
        <motion.button 
         className='close-change-pass-button'
         onTap={()=> setShowChangePass(false)}
         whileHover={{scale: 1.2, backgroundColor: 'rgb(215, 12, 12)'}}
         whileTap={{scale: 0.9}} 
        >X</motion.button>
        <form action="" onSubmit={handleSubmition}>
        <div
            // This is a dummy div to prevent autocompletion of actual fields
            className='autocomplete'
            style={{paddingRight: 50, paddingBottom: 20}}
            >
            <input 
             style={{width: 5, backgroundColor: '#dad1d1'}}              name='username'
              type="text" />
             <input 
              style={{width: 5}}
              type="text" />
             <input 
              style={{width: 5, backgroundColor: '#dad1d1'}}
              type="password"/>
              <div className='cover'></div>
            </div>

        <p
         style={{display: error.visible? "block": "none"}}
         className='password-change-error'
         >{error.message}
         </p>

        <label 
            className='form-label username-label'
            htmlFor="username"
            >Old Passsword</label>
            
        <input 
            type="text"  
            pattern='^[a-zA-Z0-9!@&%*._]{8,}$'
            title='At least 8 characters with uppercase, lowercase, numbers and symbols ! @ & % * . _'
            value={inputFields.oldPassword}
            placeholder={placeholders.old} 
            onChange={(e)=> setInputFields(prev=>({...prev, oldPassword:e.target.value}))}
            required
        />
            
        <label  className='form-label'
            htmlFor="email"
        >New Password</label>
            
        <input 
             type="text"  
             pattern='^[a-zA-Z0-9!@&%*._]{8,}$'
             title='At least 8 characters with uppercase, lowercase, numbers and symbols ! @ & % * . _'
             value={inputFields.newPassword}
             placeholder={placeholders.newPassword} 
             autoComplete='off'
             onChange={(e)=> setInputFields(prev=>({...prev, newPassword:e.target.value}))}
             required
        />

            
        <label  className='form-label'
             htmlFor="email"
        > Repeat New Password</label>
            
        <input 
             type="password"  
             value={inputFields.newPasswordRepeat}
             placeholder={placeholders.newPasswordRepeat} 
             autoComplete='off'
             onChange={(e)=> setInputFields(prev=>({...prev, newPasswordRepeat:e.target.value}))}
            required          
        />
         <motion.button 
            className='change-password-button'
            autoComplete='off' 
            whileHover={{scale: 1.05}}
            whileTap={{scale: .95}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            disabled = {changingPass? true: false}
            transition={{type:'tween', duration: 0.5 }}
            >
            {changingPass? "Changing Password...": "Change Password" }
        </motion.button>
    </form>
</motion.div>
  )
}
