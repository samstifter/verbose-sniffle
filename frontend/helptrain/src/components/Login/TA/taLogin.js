import React from 'react'
import to from 'await-to-js';
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
      on: { NEXT: 'home', PREV: 'create' }
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
    sessionID: null
  }

  componentDidMount() {
    /*
    const copyBtn = document.querySelector(".copyIDText");

    copyBtn.onclick = function() {
      document.execCommand("copy");
    }

    copyBtn.addEventListener("copy", function(event) {
      event.preventDefault();
      if (event.clipboardData) {
        event.clipboardData.setData("text/plain", this.state.sessionID);
        console.log(event.clipboardData.getData("text"))
      }
    });
    */
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


    if(!response.ok) {
      console.error(response);

      this.setState({
        postError: 'Error Creating Queue, Try again',
        createSessionState: '--error'
      })
    }
    else if(err) {
      console.error(err);

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

  loginSession = () => {
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

    //Set loading State
    this.setState({
      loginSessionState: '--loading'
    })

    //================================Cant do anything with password to check==========================
    let err, response;
    /*
    let body = JSON.stringify({

    })

    [err, response] = await to(fetch(`http://138.68.55.179:8080/queues/new/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    }));

    if(!response.ok) {
      console.error(response);

      this.setState({
        postError: 'Error Logging In, Try again',
        loginSessionState: '--error'
      })
    }
    else if(err) {
      console.error(err);

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
    */
    this.setState({
      createSessionState: '--success',
    })
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
        <button onClick={this.newSession}>New Session</button>
        <button disabled onClick={this.login}>Login</button>
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
          <h2 className='sessionID'>Session ID: {this.state.sessionID}
            <span
              className='copyIDText'
              onClick={this.copyIDText}>
              <FontAwesomeIcon icon="copy"/>
            </span>
          </h2>
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
          <form onSubmit={(e) => e.preventDefault()}>
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
