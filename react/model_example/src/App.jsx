import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './app.css'
function App() {
let [mod,setmod]=useState(false);
  return (
    <>
    <div className='btn_model'>
    <button onClick={()=>setmod(!mod)}>model button</button>
    </div>

    <div className={`model_black ${(mod)? 'show_mod' : ''}`}></div>
    <div className={`main_mod ${(mod)? 'show_moddiv' : ''}`}>
      <h1>main model</h1>
    </div>
    </>
  )
}

export default App
