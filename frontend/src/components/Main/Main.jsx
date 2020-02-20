import React, { Component } from "react"
import ApiService from '../services'
import Receiver from "../Receiver"
import UserProfile from "../UserProfile"
import GiveUser from "../GiveUser"

class Userlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content:[]
        }
    }

    componentDidMount() {
        ApiService.getAllReceiveUser()
            .then(result => {
                this.setState({
                    content: result
                })
            })
            .catch(err => {
                console.log(err)
            })
        console.log("handleState complete")
    }
    
    render() {
        return(
            <div>
                <GiveUser/> 
                {
                    this.state.content.map((val, idx) => {
                        return (
                            <UserProfile 
                                key={idx} 
                                username={val.username} 
                                targetAmount={val.target_amount} 
                                currentAmount={val.current_amount} 
                            />
                        )
                    })
                }
            </div>
        )
    }
}

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type:this.props.type,
        }
    }

    render() {
        let renderValue
        if (this.state.type === 'receive') {
            renderValue=<Receiver/>
        } else if (this.state.type === 'give') {
            renderValue=<Userlist />
        } else {
            renderValue=(<div>Error!</div>)
        }
        return(
            <div>
                {renderValue}
            </div>      
        )
    }
}


export default Main
