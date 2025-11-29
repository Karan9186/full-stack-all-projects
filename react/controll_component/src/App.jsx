import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
function App() {
  let [user, seUser] = useState();
  let [pass, sePass] = useState();
  let [form, setForm] = useState({
    user:'',
    pass:'',
  });

  let handleData = (e) => {
    e.preventDefault();
    console.log(user, pass);
  };

  return (
    <>
      <div className="container pt-5">
        <h1>Controlled Component</h1>

        <div>
          <form action="" onSubmit={handleData}>
            <div className="form-group">
              <input
                type="text"
                name="useName"
                value={user}
                onChange={(e) => seUser(e.target.value)}
                className="form-control mt-5"
                placeholder="Enter The UserName"
              />
              <input
                type="text"
                name="password"
                value={pass}
                onChange={(e) => sePass(e.target.value)}
                className="form-control mt-3"
                placeholder="Enter The Password"
              />
              <button type="submit" className="btn btn-primary mt-4">
                save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
