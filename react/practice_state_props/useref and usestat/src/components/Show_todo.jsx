import React from "react";

function Show_todo({ allTodo }) {
  let all = allTodo.map((v, i) => {
    return (
      <>
        <div className="all_items_todo">
          <p>{v.text}</p>
          <p>{v.date}</p>
        </div>
      </>
    );
  });
  return (
    <div>
      <h1>this is the show todo</h1>
      {all}
    </div>
  );
}

export default Show_todo;
