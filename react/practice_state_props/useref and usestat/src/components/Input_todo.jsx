import React, { useRef, useState } from "react";
import Show_todo from "./Show_todo";

function Input_todo() {
  const [todoData, setTodoData] = useState([]);
  const inputTextRef = useRef("");
  const inputDateRef = useRef("");
  const handling_data = (e) => {
    e.preventDefault();
    let inputText = inputTextRef.current.value;
    let inputDate = inputDateRef.current.value;
    const newdata = {
      text: inputText,
      date: inputDate,
    };
    setTodoData([...todoData, newdata]);
    inputTextRef.current.value = "";
    inputDateRef.current.value = "";
  };

  return (
    <div className="todo_input">
      <form className="div_todo" onSubmit={handling_data}>
        <input
          type="text"
          className="textbox"
          name="text_todo"
          ref={inputTextRef}
        />
        <input
          type="date"
          className="date_box"
          name="date_todo"
          ref={inputDateRef}
        />
        <input type="submit" className="submit_todo" />
      </form>
      {todoData.map((v, i) => (
        <div className="all_items_todo" key={i}>
          <p>{v.text}</p>
          <p>{v.date}</p>
        </div>
      ))}
    </div>
  );
}

export default Input_todo;
