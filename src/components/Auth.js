import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import CookieService from '../services/CookieService';
import AuthService from '../services/AuthService';

// auth service confid
const auth = new AuthService();

// cookies service config
const cookies = new CookieService();

class Auth extends Component {
    constructor(props) {
        super(props);

        // login form binds
        this.handleLoginUsername = this.handleLoginUsername.bind(this);
        this.handleLoginPassword = this.handleLoginPassword.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);

        // register form binds
        this.handleRegisterUsername = this.handleRegisterUsername.bind(this);
        this.handleRegisterPassword = this.handleRegisterPassword.bind(this);
        this.handleRegisterPassword2 = this.handleRegisterPassword2.bind(this);
        this.handleRegisterEmail = this.handleRegisterEmail.bind(this);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);

        this.state = {
            loginUsername: '',
            loginPassword: '',
            registerUsername: '',
            registerPassword: '',
            registerPassword2: '',
            registerEmail: '',
            accessToken: ''            
        };
    };

    componentDidMount() {
        auth.isLoggedIn().then( (result) => {
            if(result.data.isTokenValid) {
                this.props.history.push('/recipes');
            }
        });
    };

    /** axios constants */
    BASE_URL = 'https://env-9926568.jelastic.metropolia.fi/';

    HEADERS = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };

    render() {
        return (
            <div className="authentication-page-wrapper">
            
                {/* LOGIN */}
                <div className="login-wrapper">
                    <h1>Login</h1>
                    <br />
                    
                    <form className="form login-form" onSubmit={this.handleLoginSubmit}>
                        <label>
                            Username:
                            <input type="text" name="username" onChange={this.handleLoginUsername} value={this.state.loginUsername} />
                        </label>

                        <label>
                            Password:
                            <input type="password" name="password" onChange={this.handleLoginPassword} value={this.state.loginPassword} />
                        </label>

                        <button type="submit">Login</button>
                    </form>
                </div>

                {/* REGISTER */}
                <div className="register-wrapper">
                    <h1>Register</h1>
                    <br />
                    
                    <form className="form login-register" onSubmit={this.handleRegisterSubmit}>
                        <label>
                            Username:
                            <input type="text" name="username" onChange={this.handleRegisterUsername} value={this.state.registerUsername} />
                        </label>

                        <label>
                            Password:
                            <input type="password" name="password" onChange={this.handleRegisterPassword} value={this.state.registerPassword} />
                        </label>

                        <label>
                            Enter password again:
                            <input type="password" name="password2" onChange={this.handleRegisterPassword2} value={this.state.registerPassword2} />
                        </label>

                        <label>
                            Email:
                            <input type="text" name="email" onChange={this.handleRegisterEmail} value={this.state.registerEmail} />
                        </label>

                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        );
    };

    /** handle username change in login form */
    handleLoginUsername(e) {
        this.setState({loginUsername: e.target.value});
    };

    /** handle password change in login form */
    handleLoginPassword(e) {
        this.setState({loginPassword: e.target.value});
    };

    /** Handle login submit event */
    handleLoginSubmit(event) {
        event.preventDefault();
        
        const user = qs.stringify({
            username: this.state.loginUsername,
            password: this.state.loginPassword
        });

        axios.post(this.BASE_URL + 'users/login', user, this.HEADERS).then( (result) => {
            if (result.data.token != null) {
                // if token is sent set token and userId as cookies for later use
                cookies.setCookie('token', result.data.token, result.data.tokenMaxAge);
                cookies.setCookie('userId', result.data.userId, result.data.tokenMaxAge);

                this.props.history.push('/recipes');
            } else {
                alert('Unsuccessfull authentication, please try again');
            }
        }).catch( (err) => {
            console.log('Error: ' + err);
        });
    };

    /** handle username change in register form */
    handleRegisterUsername(e) {
        this.setState({registerUsername: e.target.value});
    };

    /** handle password change in register form */
    handleRegisterPassword(e) {
        this.setState({registerPassword: e.target.value});
    };

    /** handle password2 change in register form */
    handleRegisterPassword2(e) {
        this.setState({registerPassword2: e.target.value});
    };

    /** handle email change in register form */
    handleRegisterEmail(e) {
        this.setState({registerEmail: e.target.value});
    };

    /** Handle register submit event */
    handleRegisterSubmit(event) {
        event.preventDefault();

        // if password is typed correctly twice continue, else inform user
        if(this.state.registerPassword === this.state.registerPassword2) {
            // send new user as a string since backend uses x-www-form-urlencoded
            const newUser = qs.stringify({
                username: this.state.registerUsername,
                password: this.state.registerPassword,
                password2: this.state.registerPassword2,
                email: this.state.registerEmail
            });

            axios.post(this.BASE_URL + 'users/register', newUser, this.HEADERS).then( (result) => {
                if (result.data.token != null) {
                    // if token is sent set token and userId as cookies for later use
                    cookies.setCookie('token', result.data.token, result.data.tokenMaxAge);
                    cookies.setCookie('userId', result.data.userId, result.data.tokenMaxAge);

                    this.props.history.push('/recipes');
                } else {
                    // TODO: make unsuccessfull registration logic
                    alert('There was error registering, please contact the web administrator :)');
                }
            }).catch( (err) => {
                console.log('Error: ' + err);
            });
        } else {
            // TODO: passwords dont match logic
            alert('The passwords dont match');
        }
    };
};

export default Auth;
