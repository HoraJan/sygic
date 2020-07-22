import React, { useState } from 'react'
import { FormProps } from '../utils/types'

export default function Login(props: FormProps) {
  const [files, setFiles] = useState([{ id: 0, file: null }])

  const copyFilesWithChange = (newFile: string | null, id: number) => {
    const index = files.findIndex((item) => item.id === id)
    const maxIndex = files.reduce((acc, cur) => {
      if (cur.id > acc) return cur.id
      return acc
    }, 0)

    let newFiles = [...files]
    if (newFiles[index]) newFiles[index].file = newFile

    newFiles = newFiles.filter((i) => i?.file)
    newFiles.push({ id: maxIndex + 1, file: null })

    setFiles(newFiles)
  }

  const fileChanged = (id: number, files: FileList) => {
    const newFiles = files.length ? files[0].name : null

    copyFilesWithChange(newFiles, id)
  }

  const removeFile = (id: number) => {
    copyFilesWithChange(null, id)
  }

  return (
    <>
      <h1 className="title">Upload file</h1>
      <form onSubmit={props.formSubmit} style={{ display: 'flex', flexFlow: 'column' }}>
        <div className="form-group">
          <label htmlFor="cleaning-factor" className="bmd-label-floating">
            Cleaning Factor
          </label>
          <input
            type="number"
            className="form-control"
            name="cleaning-factor"
            id="cleaning-factor"
          />
          <span className="bmd-help">You can reduce number of points by this value.</span>
        </div>
        {files.map((item, index) => (
          <div className="form-group" key={item.id}>
            <label
              htmlFor={`file${item.id}`}
              className="bmd-label-floating"
              style={{ flexShrink: 0 }}
            >
              {item.file ? <>Log file #{index + 1}</> : <>New file</>}
            </label>
            <div style={{ display: 'flex' }}>
              <input
                type="file"
                className={(item.file ? '' : 'empty ') + 'form-control-file'}
                name={`file${item.id}`}
                id={`file${item.id}`}
                onChange={(event) => fileChanged(item.id, event.target.files)}
              />
              <span className="bmd-help">Upload your sygic log file.</span>
              {item.file && (
                <button type="button" className="btn" onClick={() => removeFile(item.id)}>
                  ❌
                </button>
              )}
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
    </>
  )
}
