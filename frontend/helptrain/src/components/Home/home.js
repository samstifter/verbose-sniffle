import React from 'react'
//import PropTypes from 'prop-types'

import StudentHome from './Student/studentHome.js'
import TAHome from './TA/taHome.js'
import { history, routes } from '../../history.js'

import { Redirect } from "react-router-dom";

import './home.scss'

const Home = (props) => {
  if(!props.queue) {
    return (
      <div className='homePage'>
        <button onClick={() => history.push(routes._LOGIN)}>Return to Login</button>
      </div>
    )
  }

  let userType = props.userType;
  if(userType === 'TA') {
    return (
      <div className='homePage'>
        <TAHome/>
      </div>
    )
  }
  else if(userType === 'Student') {
    return (
      <div className='homePage'>
        <StudentHome
          queue={props.queue}
          userName={props.userName}
        />
      </div>
    )
  }
  return (
    <div className='homePage'>
      <Redirect to="/"/>
    </div>
  )
}

export default Home;
