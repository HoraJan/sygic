import React, { useState } from 'react'
import { FormProps } from '../utils/types'

export default function Login(props: FormProps) {
  const filechanged = (args) => {
    const id = args.target.id.replace(/file(\d*)/, '$1')
    const index = files.findIndex((item) => item.id.toString() === id)
    const maxIndex = files.reduce((acc, cur) => {
      if (cur.id > acc) return cur.id
      return acc
    }, 0)
    const empty = args.target.files.length === 0

    let newFiles = [...files]

    newFiles[index].file = empty ? null : args.target.files[0].name

    newFiles = newFiles.filter((i) => i?.file)
    newFiles.push({ id: maxIndex + 1, file: null })

    setFiles(newFiles)
  }
  const [files, setFiles] = useState([{ id: 0, file: null }])

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
        {files.map((item) => (
          <div className="form-group" key={item.id}>
            <label htmlFor={`file${item.id}`} className="bmd-label-floating">
              Log file
            </label>
            <input
              type="file"
              className="form-control-file"
              name={`file${item.id}`}
              id={`file${item.id}`}
              onChange={filechanged}
            />
            <span className="bmd-help">Upload your sygic log file.</span>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
    </>
  )
}
