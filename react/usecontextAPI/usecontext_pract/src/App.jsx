import "./App.css";
import NewComponent from "./component/NewComponent";
import { NewStore } from "./component/Store";

function App() {
  let a = 4;
  return (
    <>
      <NewStore.Provider value={a}>
        <h1>this is the h1 tag in App component</h1>
        <NewComponent />
      </NewStore.Provider>
    </>
  );
}

export default App;
