import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
  <nav className='navbar d-flex '>
    <div className='logo'>
      <h1>tourist</h1>
    </div>
    <div className='links'>
      <ul>
        <li>Home</li>
        <li>Services</li>
        <li>Contact Us</li>
        <li>About Us</li>
      </ul>
        <div className='icon_links'>
        <li className='icon_menu'>menu</li>
        </div>
    </div>
  </nav>
    </>
  )
}

export default App
