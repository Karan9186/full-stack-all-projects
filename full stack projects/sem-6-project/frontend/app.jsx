import React from 'react'
import User from './User'

// child to perent - contextAPI

const app = () => {
  let id=4;
  return (
    <div>
      <User id={id}/>
    </div>
  )
}

export default app
