import React from 'react'
import { FormProps } from '../utils/types'

export default function Login(props: FormProps) {
  return (
    <>
      <h1 className="title">Welcome to Sygic converter</h1>
      <form onSubmit={props.formSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="bmd-label-floating">
            Email address
          </label>
          <input type="email" className="form-control" name="username" id="username" />
          <span className="bmd-help">We'll never share your email with anyone else.</span>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </>
  )
}
