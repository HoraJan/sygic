import React from 'react'

export default function Loading() {
  return (
    <div className="progress" style={{ marginTop: '33%' }}>
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        style={{ width: '100%' }}
      ></div>
    </div>
  )
}
