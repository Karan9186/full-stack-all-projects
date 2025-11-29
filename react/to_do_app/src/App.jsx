import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Title_name from './components/Title_name'
import Input_com from './components/Input_com'
import 'bootstrap/dist/css/bootstrap.min.css'
import Todo_list from './components/Todo_list'
import Todo_list1 from './components/Todo_list1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <center>
      <div className="main_app_container">
      <Title_name/>
      <Input_com/>
      <Todo_list/>
      <Todo_list1/>
      </div>
    </center>
    </>
  )
}

export default App
