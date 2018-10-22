import React from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import StudentHome from './Student/studentHome.js'
import TAHome from './TA/taHome.js'
import { history, routes } from '../../history.js'

import * as userActions from '../../actions/userActions';
import { User_Types } from '../../constants/userTypes.js'

import { Redirect } from "react-router-dom";

import { Util } from '../index.js'

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
        <Util.BackButton/>
        <TAHome
          queue={props.queue}
        />
      </div>
    )
  }
  else if(userType === 'Student') {
    return (
      <div className='homePage'>
        <Util.BackButton/>
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

function mapStateToProps(state) {
  return {
    user: state.User
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
