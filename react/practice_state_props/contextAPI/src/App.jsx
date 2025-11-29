import "./App.css";
import Demo_text2 from "./component/Demo_text2";
import { ShowContext } from "./store/ContextList";

function App() {
  return (
    <>
      <ShowContext.Provider value={4}>
        <h1>this is the App componenet</h1>
        <Demo_text2 />
      </ShowContext.Provider>
    </>
  );
}

export default App;
