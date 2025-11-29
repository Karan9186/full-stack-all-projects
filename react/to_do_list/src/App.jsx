import { useState, useTransition } from "react";
import "./app.css";
function App() {
  let [todo, setTodo] = useState([]);

  let [some, setsome] = useState("you did't have goal");
  let todolist = todo.map((v, i) => {
    return <Todo value={v} index={i} key={i} all_items={todo} set_all_tems={setTodo}/>;
  });
  let saveToDoList = (event) => {
    let tonmae = event.target.todoname.value;

    if (!todo.includes(tonmae)) {
      setTodo([...todo, tonmae]);
      setsome("");
    } else {
      alert("already exitst");
    }
    event.preventDefault();
  };

  return (
    <>
      <div className="flex_class">
        <div className="main_container">
          <div>
            <h1>To Do List</h1>
          </div>
          <br />

          <div className="second_div_con">
            <form onSubmit={saveToDoList}>
              <input type="text" name="todoname" />
              <button>save</button>
            </form>
            <div className="flex-main-div">
              <div className="all_items_show">
                <p className={`${some ? "error-if-not-set-some" : ""}`}>
                  {some}
                </p>

                <ul>{todolist}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
function Todo({ value, index,all_items,set_all_tems }) {
  let del_fun = () => {
    let finaldata=all_items.filter((v,i)=>i!=index);
    // console.log(finaldata);
    set_all_tems(finaldata);
    
  };

  let [line,setLine]=useState(false);
  return (
    <>
      <li>
        <h3 onClick={()=>setLine(!line)} className={`${(line)? 'line_items' : ''}`}>{index+1} {value}</h3>
        <button onClick={del_fun} className={`${(line)? 'display_none' : ''}`}>
          <span>&times;</span>
        </button>
      </li>
    </>
  );
}
