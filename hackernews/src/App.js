import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    const helloWorld = 'Welcome to the Road to learn React';
    const preamble = 'Well hello ...';
    return (
      <div className="App">
        <h2>{helloWorld}</h2>
        <p>{preamble}</p>
      </div>
    );
  }
}

export default App;
