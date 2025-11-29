import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { byNumber, decrement, increment, minor, reset } from "./features/counterSlice";
import { useState } from "react";
function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [number,setNumber]=useState(0)
  const handleChage=(e)=>{
    setNumber(e.target.value)
  }
  const handleSubmitForm=(e)=>{
    e.preventDefault()
    dispatch(byNumber(number))
  }
  return (
    <>
      <h1>count:{count}</h1>
      <button onClick={() => dispatch(increment())}>plus</button>
      <button onClick={() => dispatch(decrement())}>minus</button>
      <button onClick={() => dispatch(minor())}>plus by 2</button>
      <button onClick={() => dispatch(reset())}>reset</button>
      <form onSubmit={handleSubmitForm}>
        <input type="number" name="number" value={number} onChange={handleChage}/>
        <button type="submit">by number</button>
      </form>
    </>
  );
}

export default App;
