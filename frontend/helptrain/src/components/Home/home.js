import React from 'react'
//import PropTypes from 'prop-types'

import StudentHome from './Student/studentHome.js'
import TAHome from './TA/taHome.js'

import { Redirect } from "react-router-dom";

import './home.scss'

const Home = (props) => {
  let user = props.user;
  if(user === 'TA') {
    return (
      <div className='homePage'>
        <TAHome/>
      </div>
    )
  }
  else if(user === 'Student') {
    return (
      <div className='homePage'>
        <StudentHome/>
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
