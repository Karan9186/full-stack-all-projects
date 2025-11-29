import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Create from "./components/Create";
import Alluser from "./components/Alluser";
import UpdateUser from "./components/UpdateUser";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/create" element={<Create />} />
          <Route exact path="/alluser" element={<Alluser />} />
          <Route exact path="/update/:id" element={<UpdateUser />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
