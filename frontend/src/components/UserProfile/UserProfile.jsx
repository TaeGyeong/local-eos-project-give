import React, { Component } from 'react'
import ApiService from '../services'

class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: this.props.username,
            target_amount: this.props.targetAmount,
            current_amount: this.props.currentAmount,
            give_amount:0,
            give_current_amount: 0,
        }
        this.submitHandler = this.submitHandler.bind(this)
    }

    changeHandler = (event) => {
        this.setState({
            give_amount: event.target.value
        })
    }

    submitHandler = (event) => {
        event.preventDefault()
        if(window.confirm(`${this.state.username} 에게 ${this.state.give_amount} $ 후원하시겠습니까?`)) {console.log("resolve")}
        else { 
            console.log("reject")
            return
        }
        ApiService.getUserByName(localStorage.getItem("user_account"), "give")
            .then(result => {
                this.setState({
                    give_current_amount: result.current_amount
                })
                if (this.state.give_amount > this.state.give_current_amount) {
                    alert("기부액이 부족합니다.")
                    return
                } else {
                    ApiService.giveToReceive({
                        username: localStorage.getItem("user_account"),
                        targetname: this.state.username,
                        amount: this.state.give_amount
                    })
                    .then(() => {
                        this.setState({
                            current_amount: Number(this.state.current_amount) + Number(this.state.give_amount)
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
            })
    }
    render() {
        return (
            <form onSubmit={this.submitHandler}>
                <h1>{this.state.username}</h1>
                현재모금액 : <label>{this.state.current_amount} $</label> / 목표모금액 : <label>{this.state.target_amount} $</label>
                <input type="hidden" name="username" value={this.state.username} />
                <input type="hidden" name="current_amount" value={this.state.current_amount} />
                <input type="hidden" name="target_amount" value={this.state.target_amount} />
                <br/>
                <input type="text" name="give_amount" onChange={this.changeHandler} required={true}></input>
                <button>모금하기</button>
            </form>
        )
    }
}

export default UserProfile