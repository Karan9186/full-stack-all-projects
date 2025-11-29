import "./App.css";
import Alluser from "./component/Alluser";
import Navbar from "./component/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Update from "./component/Update";
import Create from "./component/Create";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/create" element={<Create />} />
          <Route exact path="/all" element={<Alluser />} />
          <Route exact path="/upd/:id" element={<Update />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
