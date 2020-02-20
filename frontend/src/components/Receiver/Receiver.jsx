import React, {Component} from 'react'
import ApiService from '../services'

class Receiver extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username:'',
            current_amount:0,
            target_amount:0,
            new_target_amount:0
        }
        ApiService.getUserByName(localStorage.getItem("user_account"), "receive")
            .then(result => {
                console.log(result)
                this.setState({
                    username: result.username,
                    current_amount: result.current_amount,
                    target_amount: result.target_amount
                })
            })
            .catch(err => {
                console.log(err)
            })
        
        this.submitHandler = this.submitHandler.bind(this)
    }

    changeHandler = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    
    submitHandler = (event) => {
        event.preventDefault();
        ApiService.modifyTargetAmount(this.state.username, "receive", this.state.new_target_amount)
            .then(() => {
                alert("success!")
                this.setState({
                    target_amount: this.state.new_target_amount
                })
            })
            .catch(err => {
                alert(err)
                return
            })
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return(
            <div>
                <div className="title">
                Receiver
                </div>
                <div>
                    username: {this.state.username}
                </div>
                <div>
                    my target current: {this.state.target_amount} $
                </div>
                <div>
                    my current current: {this.state.current_amount} $
                </div>
                <br/>
                <label>Edit My target current.</label>
                <form onSubmit={this.submitHandler}>
                    <input type="text" name="new_target_amount" onChange={this.changeHandler}>
                    </input>
                    <br/>
                    <button>Edit</button>
                </form>
            </div>
        )
    }
}

export default Receiver