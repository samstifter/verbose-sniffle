import React from 'react'
import to from 'await-to-js';
//import PropTypes from 'prop-types'
import Top from '../../../media/svg/top.svg'
import { history, routes } from '../../../history.js'
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
    login: {
      on: { NEXT: 'home', PREV: 'choose' }
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
    loginSessionState: '',
    sessionID: null,
    sessionPassword: null,
    loginSessionID: ''
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
    console.log(this.transition(this.state.loginState,'NEXT'));
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
      this.props.setQueue({
        Description: this.state.description,
        ID: this.state.sessionID,
        Name: this.state.name,
        Password: this.state.sessionPassword
      })
      history.push(routes._HOME);
      return;
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

    let err, response;
    [err, response] = await to(fetch(`http://138.68.55.179:8080/queues/new/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    }));

    //Create a smll fake delay for .75
    await this.stall(750);


    if(err) {
      console.error(err);

      this.setState({
        postError: 'Error Creating Queue, Try again',
        createSessionState: '--error'
      })

    }
    else if(!response.ok) {
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
        sessionID: data.id,
        sessionPassword: data.password
      })
    }
  }

  login = () => {
    this.setState({
      loginState: 'login'
    })
  }

  loginSession = async() => {
    if(this.state.loginSessionState === '--success') {//After success move on
      this.nextState();
    }

    //clear Errors
    this.setState({
      postError: '',
      loginSessionState: ''
    })

    if(!this.state.password || this.state.password.length === 0) {
      this.setState({
        error: 'Please Input Password',
        loginSessionState: '--error'
      })
      return;
    }

    if(this.state.loginSessionID.length === 0) {
      this.setState({
        error: 'Please Input Session ID',
        loginSessionState: '--error'
      })
      return;
    }

    //Set loading State
    this.setState({
      loginSessionState: '--loading'
    })

    //================================Cant do anything with password to check==========================
    let err, response;


    [err, response] = await to(fetch(`http://138.68.55.179:8080/queues/get/${this.state.loginSessionID}`))

    if(err) {
      console.error(err);

      this.setState({
        postError: 'Error Getting Queue, Try again',
        createSessionState: '--error'
      })
    }
    else if(!response.ok) {
      console.error(response);

      this.setState({
        postError: 'Error Getting Queue, Try again',
        loginSessionState: '--error'
      })
    }
    else {
      //Good response
      let data = await response.json();
      console.log(data[0]);
      this.setState({
        loginSessionState: '--success',
        sessionID: data.id
      })
      let newData = data[0];
      newData.ID = this.state.loginSessionID;
      this.props.setQueue(newData)
      history.push(routes._HOME)
      //this.nextState();
    }
    //this.nextState();
  }

  stall = async(stallTime = 3000) => {
    await new Promise(resolve => setTimeout(resolve, stallTime));
  }

  copyIDText = () => {
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        /* write to the clipboard now */
        navigator.clipboard.writeText(this.state.sessionID).then(() => {
          /* clipboard successfully set */
        }, function() {
          /* clipboard write failed */
        });
      }
    });
  }

  render () {
    console.log("Login Sstatus");
    console.log(this.state.loginState);
    let createButtonText;
    switch (this.state.createSessionState) {
      case '--success':
        createButtonText = 'Next'
        break;
      case '--error':
        createButtonText = 'Try Again'
        break;
      case '--loading':
        createButtonText = '?'
        break;
      default:
        createButtonText = 'Create'
    }

    let loginButtonText;
    switch (this.state.createSessionState) {
      case '--success':
        loginButtonText = 'Next'
        break;
      case '--error':
        loginButtonText = 'Try Again'
        break;
      case '--loading':
        loginButtonText = '?'
        break;
      default:
        loginButtonText = 'Login'
    }

    const Choose = (
      <React.Fragment>
        <h1>Choose</h1>
        <div className='taLoginBtns'>
          <button onClick={this.newSession}>New Session</button>
          <button onClick={this.login}>Login</button>
        </div>
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
        <button
          className={`createSessionButton ${this.state.createSessionState}`}
          onClick={this.createSession}>
          {createButtonText}
        </button>
        </form>

        {
          this.state.sessionID
          &&
          <div>
            <h2 className='sessionID'>Session ID: {this.state.sessionID}
              <span
                className='copyIDText'
                onClick={this.copyIDText}>
                <FontAwesomeIcon icon="copy"/>
              </span>
            </h2>
            {/*
              <h1>Enter Info</h1>
              <p>We'll email you a password to access the Session later</p>
              <label>Email</label>
              <input type='email' />
              <button>Send</button>
            */}

          </div>
        }
      </React.Fragment>
    );

    const Login = (
      <React.Fragment>
        <h1>Login</h1>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>Session ID</label>
            <input
              type='text'
              name="loginSessionID"
              value={this.state.loginSessionID}
              onChange={this.handleInputChange}
            />
            <label>Password</label>
            <input
              type='password'
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          <button
            className={`loginSessionButton ${this.state.loginSessionState}`}
            onClick={this.loginSession}>
            {loginButtonText}
          </button>
          </form>
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
