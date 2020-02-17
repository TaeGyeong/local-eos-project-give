// React core
import React, { Component } from 'react';
import Login from '../Login'
import Main from '../Main'

class App extends Component {
  constructor(props) {
    super(props)
    this.state={
      appStatus:'Login',
      username:'',
    }
  }
  render() {
    const handleLogined = (username) => {
      this.setState({
        appStatus:'Main',
        username:username
      })
    }
    return (
      <div className="App">
        {
          this.state.appStatus === 'Login' 
          ?
          <Login 
            onLoginSuccess={handleLogined}
          />
          :
          this.state.appStatus === 'Main'
          ?
          <Main 
            username={this.state.username}
          />
          :
          <div></div>
        }
      </div>
    );
  }

}

export default App;
