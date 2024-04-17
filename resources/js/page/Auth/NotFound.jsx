import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import logo from '../../../../public/Image/eleos_logo_36_36.png'
import errorLogo from '../../../../public/Image/error.svg'

function NotFound() {
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <img src={logo} alt="logo" />
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Page Not Found 🕵🏻‍♀️</h2>
          <p className='mb-2'>Oops! 😖 The requested URL was not found on this server.</p>
          <Button tag={Link} to='/tracker' color='success' className='btn-sm-block mb-2'>
            Back to home
          </Button>
          <img className='img-fluid' src={errorLogo} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}

export default NotFound