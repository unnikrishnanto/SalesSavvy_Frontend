import React, { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios';
import AdminLoadingAnimation from '../components/AdminLoadingAnimation';
 
export default function ReportByDate({setShowOptionsPopup, handleFetchingError}) {

  const [isFetching, setIsFetching] = useState(false);  
  const [date, setDate] = useState('')
  const [report, setReport]  = useState(null); 
  
  const closePopup = ()=>{
    setShowOptionsPopup(prev=>{
        const updatedState = [...prev]; 
        updatedState[6] = false;
        return updatedState;
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setIsFetching(true)
     console.log(date);
    // Fetching User Data from DB
    try {
     const response = await axios.get(
        `http://localhost:9090/admin/business/daily`, // URL
        {
            params: { date }, // Use 'params' for query parameters
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        }
    );
     console.log(response);
     
     if(response.status === 200){
        setReport(response.data);
     }
        
    } catch (error) {
      if(error.response && error.response.status === 401){
        handleFetchingError(error.response?.data?.message || "Something went wrong.")
     } else {
        console.log(error);
        alert(error.response?.data?.message);
     }
    } finally{
      // Clearing Field
      setDate('')
      setIsFetching(false)
    }
  }

  return (
    <motion.div className='admin-popup'
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity:0}}
      transition={{type:'tween' ,duration: 0.5}}>
        <motion.div className="business-report-form-container">
            <h3>BUSINESS REPORT BY DATE</h3>
            {isFetching?
              <AdminLoadingAnimation message={"Fetching Report"} />
            :
         
             !report?
              <motion.form 
                onSubmit={handleSubmit} 
                className='business-report-form'
                initial={{scale: 0, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{type:"spring", duration:1.2}}>
                <label>Enter the date for report generation?</label>
                <input 
                value={date}
                placeholder='Enter a date'
                type="date" 
                onChange={(e)=> setDate( e.target.value)}
                required/>

                <motion.button
                    whileHover={{scale: 1.05, color: 'rgba(110, 233, 10, 0.65)'}}
                    whileTap={{scale: 0.95}}
                >GET BUSINESS REPORT</motion.button>                  
              </motion.form>
            
          :
              <motion.div
                initial={{scale: 0, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{type:"spring", duration:1.2}}>
                  <ReportView report={report}/>
              </motion.div>
         
            
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

function ReportView({report}){

    return(
        <>
        {report.totalRevenue > 0 ?
          <form  className='add-product-form'>
            <div>
                <label>Total Revenue</label>
                <input 
                disabled='true'
                value={report.totalRevenue.toFixed(2)}
                type="number"/>
            </div>
          

        <table className='admin-table'>
            <tr>
                <th>CATEGORY</th>
                <th>ITEMS SOLD</th>
            </tr>
            

            {Object.entries(report.categorySale).map(([category, sale]) =>{
                return (<tr key={category} >
                       <td>{category}</td>
                       <td>{sale}</td>
                    </tr>)
               })

            }
        </table>
        </form>

          :
          <div className='no-transactions-div'>
            No Transactions....
          </div>
        }
                      
        </> 
    )
  
}