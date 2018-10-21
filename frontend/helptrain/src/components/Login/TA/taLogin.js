import React from 'react'
//import PropTypes from 'prop-types'
import Top from '../../../media/svg/top.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './taLogin.scss'

const LoginStateMachine = {
  initial: 'choose',
  states: {
    choose: {
      on: { NEXT: 'create' }
    },
    create: {
      on: { NEXT: 'info', PREV: 'initial' }
    },
    info: {
      on: { NEXT: 'login', PREV: 'create' }
    },
    login: {
      on: { NEXT: 'home', PREV: 'info' }
    }
  }
};

class TALogin extends React.Component {
  state = {
    name: '',
    description: '',
    email: '',
    password: '',
    loginState: 'choose',
    error: null,
    createSessionState: '',
    sessionID: null
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  transition = (state, action) => {
    try {
      return LoginStateMachine.states[state].on[action];
    } catch (e) {
      return undefined;
    }
  }

  nextState = () => {
    this.setState({
      loginState: this.transition(this.state.loginState,'NEXT')
    })
  }

  prevState = () => {
    this.setState({
      loginState: this.transition(this.state.loginState,'PREV')
    })
  }

  newSession = () => {
    this.nextState();
  }

  createSession = async() => {
    if(this.state.createSessionState === '--success') {//After success move on
      this.nextState();
    }

    //clear Errors
    this.setState({
      postError: '',
      createSessionState: ''
    })

    if(!this.state.name || this.state.name.length === 0) {
      this.setState({
        error: 'Please Input a Session Name',
        createSessionState: '--error'
      })
      return;
    }

    //Set loading State
    this.setState({
      createSessionState: '--loading'
    })

    let body = JSON.stringify({
      Name: this.state.name,
      Description: this.state.description
    })
    let response = await fetch(`http://138.68.55.179:8080/queues/new/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    });
    if(!response.ok) {
      console.error(response);
      this.setState({
        postError: 'Error Creating Queue, Try again',
        createSessionState: '--error'
      })
    }
    else {
      //Good response
      let data = await response.json();
      console.log(data);
      this.setState({
        createSessionState: '--success',
        sessionID: data.id
      })
      //this.nextState();
    }
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
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Name</label>
          <input
            type='text'
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
          />

        <label>Description</label>
          <input
            type='text'
            name="description"
            value={this.state.description}
            onChange={this.handleInputChange}
          />
        <button className={`createSessionButton ${this.state.createSessionState}`} onClick={this.createSession}>Create</button>
        </form>

        {
          this.state.sessionID
          &&
          <h2>Session ID: {this.state.sessionID}</h2>
        }
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
        component = Info;
        break;
      case 'login':
        component = Login;
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
