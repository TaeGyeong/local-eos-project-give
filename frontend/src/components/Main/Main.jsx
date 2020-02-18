import React, { Component } from "react"
import ApiService from '../services'

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username:'',
            type:'',
            current_amount:'',
            target_amount:'',
        }
        this.userInfoHandler = this.userInfoHandler.bind(this)
    }

    componentDidMount() {
        this.userInfoHandler(this.props.username, this.props.type)
    }

    userInfoHandler = (username, tablename) => {
        ApiService.getUserByName(username, tablename)
            .then(result => {
                console.log(result)
                this.setState({
                    username: result.username,
                    type: result.type,
                    current_amount:result.current_amount
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return(
            <div>
                {this.state.username}
                <br/>
                {this.state.type}
                <br/>
                {this.state.current_amount}
                <br/>
            </div>
        )
    }
}

export default Main
