// React core
import React, { Component } from 'react';
import Login from '../Login'

class App extends Component {
  constructor(props) {
    super(props)
    this.state={
      appStatus:'Login',
    }
  }
  render() {
    const handleLogined = () => {
      this.setState({
        appStatus:'Main'
      })
    }
    return (
      <div className="App">
        <Login 
          onLoginSuccess={handleLogined}
        />
      </div>
    );
  }

}

export default App;
