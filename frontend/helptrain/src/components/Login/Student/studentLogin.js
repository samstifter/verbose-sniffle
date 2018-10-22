import React from 'react'
//import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { QueueAPI } from '../../../api'

import Top from '../../../media/svg/top.svg'
import { history, routes } from '../../../history.js'

import './studentLogin.scss'

class StudentLogin extends React.Component {
  state = {
    sessionID: '',
    userName: '',
    error: ''
  }

  checkFormError = () => {
    if(this.state.sessionID.length !== 6) {
      this.setState({
        error: 'Session ID must be 6 characters'
      })
      return true;
    }

    if(this.state.userName.length === 0) {
      this.setState({
        error: 'Must enter a Username'
      })
      return true;
    }
    return false;
  }

  handleSubmit = async(e) => {
    e.preventDefault();//Prevent a form submit and page reload
    if(!this.checkFormError()) {//No Error in filled form
      //Check to make sure that that session exits
      /*
      let response = await fetch(`https://138.68.55.179:8080/queues/get/${this.state.sessionID}`)
      let data = await response.json();
      */
      let data = await QueueAPI.GetQueue(this.state.sessionID);
      if(data !== null) {
        this.props.setQueue(data)
        this.props.setUserName(this.state.userName)
        history.push(routes._HOME)
      }
      else {//Session not found
        this.setState({
          error: "Session not found"
        })
      }
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render () {
    return (
      <div className='studentLoginPage'>
        {/*<img src={Top} className='topSVG'/>*/}
        <div className='faIcon__studentLogin'><FontAwesomeIcon icon="train" /></div>
        <h1>Welcome!</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Session ID:
          </label>
          <input
            name="sessionID"
            type="text"
            value={this.state.sessionID}
            onChange={this.handleInputChange}
          />
          <br />
          <label>
            UserName:
          </label>
          <input
            name="userName"
            type="text"
            value={this.state.userName}
            onChange={this.handleInputChange}
          />

          <input type="submit" value="Submit" />
        </form>
        {
          this.state.error
          &&
          <div>{this.state.error}</div>
        }
      </div>
    )
  }
}

export default StudentLogin;
