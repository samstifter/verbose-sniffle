//Package Imports
import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";

//JS File Imports
import { history, routes } from './history.js'
import { Landing, Home, Login, About } from './components'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrain, faUser,faArrowLeft, faCopy } from '@fortawesome/free-solid-svg-icons'


import Demo from './components/Demo.js'
//SASS Imports
import './App.scss';

library.add(faTrain,faUser,faArrowLeft,faCopy)

class App extends Component {
  state = {
    userType: '',
    queue: {},
    userName: ''
  }

  setUserType = (userType) => {
    this.setState({
      userType: userType
    })
  }

  setQueue = (queue) => {
    this.setState({
      queue: queue
    })
  }

  setUserName = (userName) => {
    this.setState({
      userName: userName
    })
  }

  render() {
    const WrapLanding = () =>
    <Landing
      setUserType={this.setUserType}
    />

    const WrapHome = () =>
    <Home
      userType={this.state.userType}
      queue={this.state.queue}
      userName={this.state.userName}
    />

    const WrapLogin = () =>
    <Login
      userType={this.state.userType}
      setQueue={this.setQueue}
      setUserName={this.setUserName}
    />

    return (
      <Router history={history}>
        <div className="App">
          <Switch>
            <Route exact path={routes._LANDING} component={WrapLanding}/>
            <Route exact path={routes._HOME} component={WrapHome}/>
            <Route exact path={routes._LOGIN} component={WrapLogin}/>
            <Route exact path={routes._ABOUT} component={About}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
