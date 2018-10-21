import React from 'react'
//import PropTypes from 'prop-types'
import Top from '../../../media/svg/top.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './studentLogin.scss'

class StudentLogin extends React.Component {
  state = {
    sessionID: '',
    nickname: '',
    error: ''
  }

  checkFormError = () => {
    if(this.state.sessionID.length !== 6) {
      this.setState({
        error: 'Session ID must be 6 characters'
      })
      return true;
    }

    if(this.state.nickname.length === 0) {
      this.setState({
        error: 'Must enter a nickname'
      })
      return true;
    }

    this.setState({
      sessionID: '',
      nickname: ''
    })
    return false;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.checkFormError()) {
      //Send fetch
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
            Nickname:
          </label>
          <input
            name="nickname"
            type="text"
            value={this.state.nickname}
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
