import React from 'react'
import './input.scss'

const Input = ({type,value,handleChange}) => {
  return (
    <input type={type} value={value} onChange={handleChange} className='custom_input' />
  )
}

export default Input