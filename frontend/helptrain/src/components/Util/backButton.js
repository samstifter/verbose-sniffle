import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { history } from '../../history.js'

import './util.scss'

const BackButton = (props) => {
  return (
    <button className='backButton' onClick={() => history.goBack()}><FontAwesomeIcon icon="arrow-left" /></button>
  )
}

export default BackButton;
