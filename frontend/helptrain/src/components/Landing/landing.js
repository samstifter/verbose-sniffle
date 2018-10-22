import React from 'react'
import { Link } from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as userActions from '../../actions/userActions';
import { User_Types } from '../../constants/userTypes.js'

import { history, routes } from '../../history.js'

import largeSVG from '../../media/svg/large_light.svg'
import smallSVG from '../../media/svg/small_dark.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './landing.scss'

class Landing extends React.Component {
  navagete = (user) => {
    this.props.userActions.setUserType(user);
    history.push(routes._LOGIN);
  }

  render () {
    return(
      <div className='landingPage'>

        <div className='content'>
          <div className='faIcon'><FontAwesomeIcon icon="train" /></div>
          <div className='title'>HelpTrain</div>
          <p>I am a...</p>
          <div className='buttons'>
            <button onClick={() => this.navagete(User_Types.Student)}><span>Student</span></button>
            <button onClick={() => this.navagete(User_Types.TA)}><span>TA</span></button>
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
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Landing);
