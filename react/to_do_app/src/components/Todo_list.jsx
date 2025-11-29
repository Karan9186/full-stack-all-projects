function Todo_list(){
  let w="college work";
  let d="2/4/2023";
  return(
    <>
      <div>
        <div className="list_container">
        <div>
          <p>{w}</p>
        </div>
        <div>
          <p>{d}</p>
        </div>
        <button type="button" class="btn btn-danger">delete</button>
        </div>
      </div>
    </>
  )
}

export default Todo_list;