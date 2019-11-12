import React from "react";

function Login(props) {
  return (
    <div>
      <h2 className="mv3">Create Account</h2>
      <form className="flex flex-column">
        <input
          type="text"
          placeholder="Your name"
          autoComplete="off"
        />
        <input
          type="email"
          placeholder="Your email"
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="Choose a secure password"
          autoComplete="off"
        />
        <div className="flex mt3">
          <button
            type="submit"
            className="button pointer mr2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login;
