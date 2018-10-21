//Package Imports
import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";

//JS File Imports
import { history, routes } from './history.js'
import { Landing, Home, Login, About } from './components'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrain } from '@fortawesome/free-solid-svg-icons'

//SASS Imports
import './App.scss';

library.add(faTrain)

class App extends Component {
  state = {
    user: ''
  }

  setUser = (userState) => {
    this.setState({
      user: userState
    })
  }


  render() {
    const WrapLanding = () => <Landing setUser={this.setUser} user={this.state.user}/>
    const WrapHome = () => <Home setUser={this.setUser} user={this.state.user}/>
    const WrapLogin = () => <Login setUser={this.setUser} user={this.state.user}/>
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
