import React, { Component } from 'react'
import ApiService from '../services'

class GiveCurrency extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currency: '',
        }
    }

    componentDidMount() {
        ApiService.getCurrency(localStorage.getItem("user_account"))
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
class GiveUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            current_amount: 0,
            balance: this.props.balance,
            issue_balance: 0
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
        const handleChange = (event) => {
            event.preventDefault();
            this.setState({
                [event.target.name]: event.target.value
            })
        }
        const handleSubmit = (event) => {
            event.preventDefault();
            ApiService.issueToken(localStorage.getItem("user_account"), this.state.issue_balance)
                .then(()=>{
                    alert("issue complete")
                })
                .catch(err=>{
                    alert(err)
                })
        }
        return (
            <div>
                유저이름 : {this.state.username}
                <br />
                현재 기부가능 액수 : {this.state.current_amount} $
                <br />
                <GiveCurrency />
                <form onSubmit={handleSubmit}>
                    <label>SYS TOKEN ISSUE.</label>
                    <input type="text" name="issue_balance" onChange={handleChange}></input>
                    <button>ISSUE</button>
                </form>
            </div>
        )
    }
}

export default GiveUser