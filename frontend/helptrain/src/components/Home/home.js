import React from 'react'
//import PropTypes from 'prop-types'

import StudentHome from './Student/studentHome.js'
import TAHome from './TA/taHome.js'

import './home.scss'

const Home = (props) => {
  return (
    <div className='homePage'>
      Home
      <StudentHome/>
      <TAHome/>
    </div>
  )
}

export default Home;
