import React, { Component } from 'react'
import ApiService from '../services'
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggined: false,
            form: {
                username: '',
                key: '',
                error: '',
                type: ''
            },
            loginHandler: this.props.onLoginSuccess,
            registHandler: this.props.onRegisterPage
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            form: {
                ...this.state.form,
                [event.target.name]: event.target.value
            },
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        return ApiService.login({
            username: this.state.form.username,
            key: this.state.form.key,
            type: this.state.form.type
        })
        .then(() => {
            alert("login success")
            this.state.loginHandler(this.state.form.type)
        })
        .catch(err => {
            this.setState({ error: err.toString() });
            alert(err)
        })
    }
    render() {
        return (
            <div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className="field">
                        <label>Account name</label>
                        <input
                            type="text"
                            name="username"
                            // value={}
                            placeholder="All small letters, a-z, 1-5 or dot, max 12 characters"
                            onChange={this.handleChange}
                            pattern="[\.a-z1-5]{2,12}"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="field">
                        <label>Private key</label>
                        <input
                            type="password"
                            name="key"
                            // value={}
                            onChange={this.handleChange}
                            pattern="^.{51,}$"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="radiobutton">
                        <label>give</label>
                        <input
                            type="radio"
                            name="type"
                            onChange={this.handleChange}
                            value="give"
                        />
                        <label>receive</label>
                        <input
                            type="radio"
                            name="type"
                            onChange={this.handleChange}
                            value="receive"
                        />
                    </div>
                    <div className="field form-error">
                        <span className="error">{this.state.form.error}</span>
                    </div>
                    <div className="bottom">
                        <button type="submit" className="green">
                            Login
                        </button>
                        <button onClick={this.state.registHandler}>회원가입</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Login