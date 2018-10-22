import React from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { Redirect } from "react-router-dom";

import * as userActions from '../../actions/userActions';
import { User_Types } from '../../constants/userTypes.js'

import StudentLogin from './Student/studentLogin.js'
import TALogin from './TA/taLogin.js'
import { Util } from '../index.js'

import './login.scss'

const Login = (props) => {
  let userType = props.user.type;
  if(userType === User_Types.TA) {
    return (
      <div className='loginPage'>
        <TALogin
          setQueue={props.setQueue}
        />
      </div>
    )
  }
  else if(userType === User_Types.Student) {
    return (
      <div className='loginPage'>
        <Util.BackButton/>
        <StudentLogin
          setQueue={props.setQueue}
          setUserName={props.userActions.setUserName}
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
)(Login);
