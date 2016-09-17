import React from 'react';

export default class LoginButton extends React.Component {
  constructor () {
    super()
  }

  // onSignIn (googleUser) {
  //   console.log('trying');
  //   var profile = googleUser.getBasicProfile();
  //   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  //   console.log('Name: ' + profile.getName());
  //   console.log('Image URL: ' + profile.getImageUrl());
  //   console.log('Email: ' + profile.getEmail());
  // }

  renderGoogleLoginButton () {
    console.log('rendering google signin button')
    gapi.signin2.render('my-signin2', {
      'scope': 'email',
      'width': 300,
      'height': 50,
      'longtitle': true,
      'theme': 'light',
      'onsuccess': this.props.onSignIn
    });
  }

  componentDidMount () {
    window.addEventListener('google-loaded', this.renderGoogleLoginButton.bind(this));
  }

  render () {
    let displayText = "Sign in with Google";
    return (
       <div id="my-signin2"></div>
    );
  }

};