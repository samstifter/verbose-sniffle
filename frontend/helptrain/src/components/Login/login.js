import React from 'react'
//import PropTypes from 'prop-types'

import StudentLogin from './Student/studentLogin.js'
import TALanding from './TA/taLogin.js'

import './login.scss'

const Login = (props) => {
  return (
    <div className='loginPage'>
      Login
      <StudentLogin/>
      <TALanding/>
    </div>
  )
}

export default Login;
