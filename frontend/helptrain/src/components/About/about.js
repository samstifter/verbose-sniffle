import React from 'react'
//import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { history, routes } from '../../history.js'

import './about.scss'

const About = (props) => {
  return (
    <div className='aboutPage'>
      <div className='faIcon__about' onClick={() => history.push(routes._LANDING)}><FontAwesomeIcon icon="train" /></div>
      <div className='aboutContent'>
        <h1>What is HelpTrain?</h1>

        <h1>Why use HelpTrain?</h1>

        <h1>Who made HelpTrain?</h1>
      </div>
    </div>
  )
}

export default About
