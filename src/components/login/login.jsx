import React from "react";

export class Login extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <div className= "da-base">
            <div className="da-header">Login</div>
            <div className="da-content">
                <div className="da-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder="username" />   
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder="password" />   
                    </div>
                </div>
            </div>
            <div className="da-footer">
                <button type="button" className="btn">Log In</button>
                <h3>Forgot your password ?</h3>
                
            </div>
        </div>
    }
}