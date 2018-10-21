import React from 'react'
//import PropTypes from 'prop-types'
import { Redirect } from "react-router-dom";

import StudentLogin from './Student/studentLogin.js'
import TALanding from './TA/taLogin.js'

import './login.scss'

const Login = (props) => {
  let user = props.user;
  if(user === 'TA') {
    return (
      <div className='loginPage'>
        <TALanding/>
      </div>
    )
  }
  else if(user === 'Student') {
    return (
      <div className='loginPage'>
        <StudentLogin/>
      </div>
    )
  }
  return (
    <div className='loginPage'>
      <Redirect to="/"/>
    </div>
  )
}

export default Login;
