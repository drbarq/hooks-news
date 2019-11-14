import React from "react";
import useFormValidation from './useFormValidation'
import validateLogin from './validateLogin'
import firebase from '../../firebase'
import { Link } from 'react-router-dom'

// import firebaseui from 'firebaseui'
var firebase2 = require('firebase');
const firebaseui = require('firebaseui');

const INITIAL_STATE = {
  name: "",
  email: "",
  password: ""
}

function Login(props) {
  const { handleChange, handleSubmit, handleBlur, values, errors, isSubmitting  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser)
  const [login, setLogin] =  React.useState(true)
  const [firebaseError, setFirebaseError] = React.useState(null)
  const ui = new firebaseui.auth.AuthUI(firebase2.auth());
  // const ui = new firebaseui.auth.AuthUI(this.auth);


  async function authenticateUser() {
    const { name, email, password } = values 
    try {
      const response = login
        ? await firebase.login(email, password) 
        : await firebase.register(name, email, password)
      props.history.push("/")
      console.log({response})
    } catch(err) {
      console.error('Authentication Error:', err)
      setFirebaseError(err.message)
    } 
  }

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      // firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };
  

  async function authTest()  {
    // ui.start('#firebaseui-auth-container', uiConfig);

      ui.start('#firebaseui-auth-container', {
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
          }
        ],
        // Other config options...
    });
  }


  return (
    <div>
      <div id="firebaseui-auth-container">{authTest}</div>
      <h2 className="mv3"> {login ? "Login" : "Create Account"}  </h2>
      <form onSubmit={handleSubmit} className="flex flex-column" >
        { !login && (<input
          onChange={handleChange}
          value={values.name}
          name="name"
          type="text"
          placeholder="Your name"
          autoComplete="off"
        />)}
        <input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          name="email"
          type="email"
          className={errors.email && 'error-input'}
          placeholder="Your email"
          autoComplete="off"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          className={errors.password && 'error-input'}
          name="password"
          type="password"
          placeholder="Choose a secure password"
          autoComplete="off"
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        {firebaseError && <p className="error-text">{firebaseError}</p>}
        <div className="flex mt3">
          <button
            type="submit"
            className="button pointer mr2"
            disabled={isSubmitting}
            style={{background: isSubmitting ? "grey" : "orange" }}
          >
            Submit
          </button>
          <button
            type="button"
            className="pointer button"
            // onClick={() => setLogin(!login)}
            onClick={() => setLogin(prevLogin => !prevLogin)}
          >
            { login ? "need to create an account?" : "already have an account?"}
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <Link to="/forgot">Forgot Password?</Link>
      </div>
    </div>
  )
}

export default Login;
