import React from "react";

export class Register extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <div className= "da-base">
            <div className="da-header">Register</div>
            <div className="da-content">
                <div className="da-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder="username" />   
  Z                  </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" placeholder="email" />   
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder="password" />   
                    </div>
                </div>
            </div>
            <div className="da-footer">
                <button type="button" className="btn">Register</button>
            </div>
        </div>
    }
}