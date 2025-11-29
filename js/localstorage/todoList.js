let btn = document.querySelector('.btnAdd');
let mainTodoElem = document.querySelector(".Demo");
let inputId = document.getElementById("inputId");

btn.addEventListener("click", (e) => {

  addToDo(e);
});
const allTodoItemsData = () => {
  return JSON.parse(localStorage.getItem("toDoItems")) || []; 
}

let localElem = allTodoItemsData() || [];



const addToDoListInLocalStorage=(el)=>{
  localStorage.setItem("toDoItems",JSON.stringify(el))
}

const showElement=(el,inx)=>{
  const divelem = document.createElement("div");
  divelem.classList.add("title");
  divelem.innerHTML = `<h2>${el}</h2>
                       <button id=${inx} class="deleteElem">delete</button>`;
  mainTodoElem.appendChild(divelem);
}

function addToDo(e) {
  e.preventDefault();
  
  let inputText = inputId.value.trim();
  
if (inputText !== "") {
  if(!localElem.includes(inputText)){

    localElem.push(inputText);
    localElem = [...new Set(localElem)];
    localStorage.setItem("toDoItems", JSON.stringify(localElem));
    
    inputId.value = "";
    showElement(inputText);
  }
  else{
    alert("This item is already added");
  }
  }
}

const removeItem=(e)=>{
  let todolistContent = e.target.previousElementSibling.innerText;
  let parentEel=e.target.parentElement;
  localElem=localElem.filter((el)=>{
    return el!=todolistContent.toLowerCase()
  })

  addToDoListInLocalStorage(localElem)
  parentEel.remove()
}
mainTodoElem.addEventListener("click",(e)=>{
  e.preventDefault();
  if(e.target.classList.contains("deleteElem")){
    removeItem(e)
  }
})


const showTodo = () => {
  localElem.forEach((e,inx) => {
    showElement(e,inx);
  });
}
showTodo();
