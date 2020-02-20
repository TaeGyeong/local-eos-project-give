// React core
import React, { Component } from 'react';
import Login from '../Login'
import Main from '../Main'
import ApiService from '../services'
import Regist from '../Regist';

class App extends Component {

  /////////////// CONSTRUCTOR /////////////// 

  constructor(props) {
    super(props)
    this.state = {
      appStatus: 'Login',
      type: '',
    }
    this.initialRegist = this.initialRegist.bind(this)
  }

  /////////////// LOCAL FUNCTION /////////////// 

  initialRegist = () => {
    ApiService.initialRegister({ username: "give1", type: "give", key: "5KFyaxQW8L6uXFB6wSgC44EsAbzC7ideyhhQ68tiYfdKQp69xKo" })
    ApiService.initialRegister({ username: "receive1", type: "receive", key: "5JUqERYKRDVAAEHHenTt7GezfTKYW1PdX7c3k5Z6YkJ1y769C8o" })
    ApiService.initialRegister({ username: "receive2", type: "receive", key: "5JdbHuaghWknD4D6cUbk5g9b4McA4tJpRaSKgCW8m6J5vLoJzR2" })
  }

  /////////////// INITIAL CHECK /////////////// 
  componentDidMount() {
    this.initialRegist()
  }

  /////////////// RENDER /////////////// 
  render() {
    const handleLogined = (type) => {
      this.setState({
        appStatus: 'Main',
        type: type
      })
    }

    const handleRegister = (event) => {
      event.preventDefault()
      this.setState({
        appStatus:'Regist'
      })
    }

    const handleMain = () => {
      this.setState({
        appStatus:'Login'
      })
    }
    return (
      <div className="App">
        {
          this.state.appStatus === 'Login'
            ?
            <Login
              onLoginSuccess={handleLogined}
              onRegisterPage={handleRegister}
            />
            :
            this.state.appStatus === 'Main'
              ?
              <Main
                type={this.state.type}
              />
              :
              <Regist backMain={handleMain}/>
        }
      </div>
    );
  }

}

export default App;
