import React from 'react'
//import PropTypes from 'prop-types'

import { StudentLanding } from './Student/studentLanding.js'
import { TALanding } from './TA/taLanding.js'

import './landing.scss'

const Landing = (props) => {
  return (
    <div className='homePage'>
      Home
      <StudentLanding/>
      <TALanding/>
    </div>
  )
}

export default Landing;
