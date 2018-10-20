import React from 'react'
//import PropTypes from 'prop-types'
import { Link } from "react-router-dom";
import { history, routes } from '../../history.js'

import largeSVG from '../../media/svg/large_light.svg'
import smallSVG from '../../media/svg/small_dark.svg'

import './landing.scss'



const Landing = (props) => {
  return (
    <div className='landingPage'>

      <div className='content'>
        <div className='title'>HelpTrain</div>
        <p>I am a...</p>
        <div className='buttons'>
          <button><span>Student</span></button>
          <button><span>TA</span></button>
        </div>
        <Link to={routes._ABOUT}>What is this?</Link>
      </div>
      <div className='svgs'>
        <img src={largeSVG} className='svg largeRight'/>
        <img src={smallSVG} className='svg smallRight'/>
        <img src={largeSVG} className='svg largeLeft'/>
        <img src={smallSVG} className='svg smallLeft'/>
      </div>
    </div>
  )
}

export default Landing;
