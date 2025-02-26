import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios';
import { hatch } from 'ldrs';

export default function OverallReport({setShowOptionsPopup, handleFetchingError}) {
  
  hatch.register();

  const [isFetching, setIsFetching] = useState(true);  
  const [report, setReport]  = useState(null); 
  
  const closePopup = ()=>{
    setShowOptionsPopup(prev=>{
        const updatedState = [...prev]; 
        updatedState[9] = false;
        return updatedState;
    })
  }

  const fetchReport = useCallback( async() =>{
    // Fetching  Data from DB
    try {
     const response = await axios.get(
        `http://localhost:9090/admin/business/overall`, // URL
        {
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
        alert(error.response?.data?.message || "Something went wrong.");
     }
    }
  }, [handleFetchingError])

  useEffect(()=>{
    const fetchRep =async()=>{
      await fetchReport();
      setIsFetching(false);
    }
    fetchRep();
  },[fetchReport])

  return (
    <motion.div className='admin-popup'
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity:0}}
      transition={{type:'tween' ,duration: 0.5}}>
        <motion.div className="business-report-form-container">
            <h3>OVERALL REPORT</h3>
            { isFetching ?
              
              <div className='loading-animation-div'>
                <l-hatch
                size="35"
                stroke="3.5"
                speed="1.5" 
                color="rgb(39, 173, 101)" 
                ></l-hatch>
                <h3>Fetching Report..</h3>    
              </div> 
              :
              report?.totalRevenue > 0 ?
                <form  className='business-report-form'>
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
            <motion.button
                whileHover={{scale: 1.1, color: 'rgb(242, 229, 118)'}}
                whileTap={{scale: 0.9}}
                onClick={()=>closePopup()}
            >CLOSE</motion.button>
     </motion.div>
    </motion.div>
  )
}
