import React, { Component } from 'react'
import ApiService from '../services'
class GiveUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username:'',
            current_amount: 0
        }
    }

    componentDidMount() {
        ApiService.getUserByName(localStorage.getItem("user_account"), "give")
            .then(result => {
                this.setState({
                    username: result.username,
                    current_amount: result.current_amount,
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        this.componentDidMount()
        return(
            <div>
                유저이름 : {this.state.username}
                <br/>
                현재 기부가능 액수 : {this.state.current_amount} $
            </div>
        )
    }
}

export default GiveUser