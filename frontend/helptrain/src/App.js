//Package Imports
import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";

//JS File Imports
import { history, routes } from './history.js'
import { Landing, Home, Login } from './components'

//SASS Imports
import './App.scss';

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div className="App">
          <Switch>
            <Route exact path={routes._LANDING} component={Landing}/>
            <Route exact path={routes._HOME} component={Home}/>
            <Route exact path={routes._LOGIN} component={Login}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
