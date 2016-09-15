import React from 'react';
import ReactDOM from 'react-dom';
// import LoginButton from './Login.jsx';
import LoginButton from './Login.jsx';
// import Signin from './Signin.jsx';
// import Register from './Register.jsx';

export default class UserSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register: false
    };
  }

  // handleRegister(e) {
  //   this.setState({register: true});
  // }

  // handleSignIn(e) {
  //   this.setState({register: false});
  // }

  // onSignIn (googleUser) {
  //   console.log('trying');
  //   var profile = googleUser.getBasicProfile();
  //   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  //   console.log('Name: ' + profile.getName());
  //   console.log('Image URL: ' + profile.getImageUrl());
  //   console.log('Email: ' + profile.getEmail());
  // }
  
  // componentWillMount () {
  //   gapi.signin2.render('g-signin2', {
  //     'scope': 'https://www.googleapis.com/auth/plus.login',
  //     'width': 200,
  //     'height': 50,
  //     'longtitle': true,
  //     'theme': 'dark',
  //     'onsuccess': this.onSignIn
  //   });  
  // }
  
  
  
  
  render() {
    {/*let signInHeader;
    let signInButton;
    let signIntext;

    // register and signin toggle
    if (this.state.register) {
      signInHeader = <h2>Register:</h2>;
      signInButton = <Register/>;
      signIntext = <a className='sign-in-register-btn' onClick={this.handleSignIn.bind(this)} href='#'><span className='button'>Sign In</span></a>;
    } else {
      signInHeader = <h2>Sign In:</h2>;
      signInButton = <Signin LogInUser={this.props.LogInUser}/>;
      signIntext = <a className='sign-in-register-btn' onClick={this.handleRegister.bind(this)} href='#'><span className='button'>Register</span></a>;
    }*/}

    return (
      <div className='sidebar'>
      </div>
    );
  }
}
