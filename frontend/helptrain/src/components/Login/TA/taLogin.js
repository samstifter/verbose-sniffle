import React from 'react'
//import PropTypes from 'prop-types'
import Top from '../../../media/svg/top.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './taLogin.scss'

//choose,create,info,login

class TALogin extends React.Component {
  state = {
    name: '',
    description: '',
    email: '',
    password: '',
    loginState: 'choose'
  }

  newSession = () => {
    this.setState({
      loginState: 'create'
    })
  }

  login = () => {
    this.setState({
      loginState: 'login'
    })
  }

  render () {

    const Choose = (
      <React.Fragment>
        <h1>Choose</h1>
        <button onClick={this.newSession}>New Session</button>
        <button onClick={this.login}>Login</button>
      </React.Fragment>
    );

    const Create = (
      <React.Fragment>
        <h1>Create Session</h1>
        <form>

        </form>
      </React.Fragment>
    );

    const Info = (
      <React.Fragment>
        <h1>Info</h1>
      </React.Fragment>
    );

    const Login = (
      <React.Fragment>
        <h1>Login</h1>
      </React.Fragment>
    );

    let component;
    switch (this.state.loginState) {
      case 'choose':
        component = Choose;
        break;
      case 'create':
        component = Create;
        break;
      case 'info':
        component = null;
        break;
      case 'login':
        component = null;
        break;
      case 'home':
        component = null;
        break;
      default:

    }

    return(
      <div className='taLoginPage'>
        <div className='faIcon'><FontAwesomeIcon icon="train" /></div>
        {component}
      </div>
    )
  }
}

export default TALogin;
