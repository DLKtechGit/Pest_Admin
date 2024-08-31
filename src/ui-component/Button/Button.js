import React from 'react'
import download from '../../assets/images/icons8-download-64.png'
const Button = ({children,style,onClick}) => {
  return (
    <> 
     <button id='add-cus' type="submit" style={style}  onClick={onClick} className="btn btn-primary"> <img style={{width:'20px'}} src={download} alt='down'/> {children} </button>
    </>
  )
}

export default Button
