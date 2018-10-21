import React from 'react'
//import PropTypes from 'prop-types'
import { Redirect } from "react-router-dom";

import StudentLogin from './Student/studentLogin.js'
import TALogin from './TA/taLogin.js'
import { Util } from '../index.js'

import './login.scss'

const Login = (props) => {
  let userType = props.userType;
  if(userType === 'TA') {
    return (
      <div className='loginPage'>
        <Util.BackButton/>
        <TALogin/>
      </div>
    )
  }
  else if(userType === 'Student') {
    return (
      <div className='loginPage'>
        <Util.BackButton/>
        <StudentLogin
          setQueue={props.setQueue}
          setUserName={props.setUserName}
        />
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
