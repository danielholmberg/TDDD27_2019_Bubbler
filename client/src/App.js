import React, { Component } from 'react';
import './App.css';

import AppBar from './Components/AppBar/AppBar';
import Login from './Pages/Login/Login';

class App extends Component {
  render() {
    return (
      <div>
        <AppBar/>
        <Login/>
      </div>
    );
  }
}

export default App;
