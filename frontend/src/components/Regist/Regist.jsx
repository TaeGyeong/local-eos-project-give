import React, { Component } from 'react'
import ApiService from '../services'
class Regist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            publickey: '',
            privatekey: '',
            error:'',
            type:'',

            handleMain: this.props.backMain
        }
    }

    render() {
        const submitHandler = (event) => {
            event.preventDefault()
            ApiService.regist({username:this.state.name, publickey:this.state.publickey})
                .then(() => {
                    ApiService.initialRegister({username:this.state.name, type:this.state.type, key:this.state.privatekey})
                    alert("회원이 된걸 환영")
                    this.state.handleMain()
                })
                .catch(err => {
                    alert(err)
                    this.setState({
                        error:err.toString()
                    })
                })
        }
        const changeHandler = (event) => {
            event.preventDefault()
            this.setState({
                [event.target.name]:event.target.value
            })
        }

        return (
            <div>
                <div>
                    Welcome
                </div>
                <form onSubmit={submitHandler}>
                    <div>
                        name : <input type="text" required={true} name="name" onChange={changeHandler}></input>
                    </div>
                    <div>
                        public key : <input type="text" required={true} name="publickey" onChange={changeHandler}></input>
                    </div>
                    <div>
                        private key : <input type="text" required={true} name="privatekey" onChange={changeHandler}></input>
                    </div>
                    <div className="radiobutton">
                        <label>give</label>
                        <input
                            type="radio"
                            name="type"
                            onChange={changeHandler}
                            value="give"
                        />
                        <label>receive</label>
                        <input
                            type="radio"
                            name="type"
                            onChange={changeHandler}
                            value="receive"
                        />
                    </div>
                    <button type="submit">가입</button>
                    <div className="field form-error">
                        <span className="error">{this.state.error}</span>
                    </div>
                </form>
            </div>
        )
    }
}

export default Regist