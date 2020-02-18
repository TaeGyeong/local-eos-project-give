// React core
import React, { Component } from 'react';
import Login from '../Login'
import Main from '../Main'
import ApiService from '../services'

class App extends Component {
  constructor(props) {
    super(props)
    this.state={
      appStatus:'Login',
      username:'',
      type:'',
    }
  }

  componentDidMount() {
    
  }
  render() {
    const handleLogined = (username, type) => {
      this.setState({
        appStatus:'Main',
        username:username,
        type:type,
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
            type={this.state.type}
          />
          :
          <div></div>
        }
      </div>
    );
  }

}

export default App;
