import React, { Component } from 'react'
import ApiService from '../services'


class ReceiveCurrency extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currency: '',
        }
    }

    componentDidMount() {
        ApiService.getCurrency(this.props.username)
            .then(result => {
                if (result.length === 0) {
                    this.setState({
                        currency:'0.0000 SYS'
                    })
                } else {
                    this.setState({
                        currency:result
                    })
                }
            })
            .catch(err => {
                alert(err)
            })
    }

    render() {
        this.componentDidMount()
        return(
            <div>
                현재 토큰 보유 : {this.state.currency}
            </div>
        )
    }
}
class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: this.props.username,
            target_amount: this.props.targetAmount,
            current_amount: this.props.currentAmount,
            give_amount:0,
            give_current_amount: 0,
            give_token_amount: 0
        }
        this.submitHandler = this.submitHandler.bind(this)
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    tokenSubmitHandler = (event) => {
        event.preventDefault()
        if(window.confirm(`${this.state.username} 에게 ${this.state.give_token_amount} SYS 후원하시겠습니까?`)) {
            ApiService.giveToken(localStorage.getItem("user_account"), this.state.username, this.state.give_token_amount) 
                .then(() => {
                    this.render()
                })
                .catch(err => {
                    console.log(err)
                    alert(err)
                })
        } else { 
            return
        }

        // 이거 뒤에 토큰 Transfer 하는거 ApiService 에 구현하기.
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
            <div>
                <form onSubmit={this.submitHandler}>
                    <h1>{this.state.username}</h1>
                    현재모금액 : <label>{this.state.current_amount} $</label> / 목표모금액 : <label>{this.state.target_amount} $</label>
                    <input type="hidden" name="username" value={this.state.username} />
                    <input type="hidden" name="current_amount" value={this.state.current_amount} />
                    <input type="hidden" name="target_amount" value={this.state.target_amount} />
                    <br/>
                    <input type="text" name="give_amount" onChange={this.changeHandler} required={true} placeholder="가상의 금액 모금하기"></input>
                    <button>모금하기</button>
                    <ReceiveCurrency username={this.state.username}/>
                </form>
                <form onSubmit={this.tokenSubmitHandler}>
                    <input type="text" name="give_token_amount" onChange={this.changeHandler} required={true} placeholder="토큰 모금하기 (소수점 4자리까지 입력해주세요)"></input>
                    <button>모금하기</button>
                </form>
            </div>
        )
    }
}

export default UserProfile