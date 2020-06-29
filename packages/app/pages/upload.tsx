import React from 'react'
import { FormProps } from '../utils/types'

export default function Login(props: FormProps) {
  return (
    <>
      <h1 className="title">Upload file</h1>
      <form onSubmit={props.formSubmit}>
        <div className="form-group">
          <label htmlFor="clearing-factor" className="bmd-label-floating">
            Cleaning Factor
          </label>
          <input
            type="number"
            className="form-control"
            name="cleaning-factor"
            id="cleaning-factor"
          />
          <span className="bmd-help">You can reduce number of points by this.</span>
        </div>
        <div className="form-group">
          <label htmlFor="file" className="bmd-label-floating">
            Log file
          </label>
          <input type="file" className="form-control-file" name="file" id="file" multiple={true} />
          <span className="bmd-help">Upload your sygic log file.</span>
        </div>
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
    </>
  )
}
