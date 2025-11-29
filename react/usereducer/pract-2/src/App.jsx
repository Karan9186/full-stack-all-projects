import { useReducer, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

let handleF = (state, action) => {
  switch (action.type) {
    case "input_text":
      return [
        ...state,
        { user: action.payload.user, pass: action.payload.pass },
      ];
    case "delete_data":
      return action.data;
    case "update_data":
      const updatedState = [...state];
      updatedState[action.payload.index] = {
        user: action.payload.user,
        pass: action.payload.pass,
      };
      return updatedState;
    default:
      return state;
  }
};

function App() {
  let [user, dispatch] = useReducer(handleF, []);
  let userRef = useRef();
  let passRef = useRef();
  let [updS, setUpdS] = useState(false); // Flag for update mode
  let [updateIndex, setUpdateIndex] = useState(null); // Index for the item being updated

  let handlingValue = (e) => {
    e.preventDefault();
    const user = userRef.current.value;
    const pass = passRef.current.value;

    if (updS) {
      let dispa = {
        type: "update_data",
        payload: {
          index: updateIndex, // Use the stored index for update
          user: user,
          pass: pass,
        },
      };
      dispatch(dispa);
      setUpdS(false); // Reset update mode flag
      setUpdateIndex(null); // Reset update index
    } else {
      let dis = {
        type: "input_text",
        payload: {
          user: user,
          pass: pass,
        },
      };
      dispatch(dis);
    }

    userRef.current.value = "";
    passRef.current.value = "";
  };

  let deleteData = (ind) => {
    let currentData = user.filter((v, i) => i !== ind);
    let dispa = {
      type: "delete_data",
      data: currentData,
    };
    dispatch(dispa);
  };

  let updateData = (ind) => {
    let currentData = user[ind];
    userRef.current.value = currentData.user;
    passRef.current.value = currentData.pass;
    setUpdS(true); // Set update mode flag
    setUpdateIndex(ind); // Store the index for update
  };

  let allData = user.map((v, i) => {
    return (
      <tr key={i}>
        <th scope="row">{i + 1}</th>
        <td>{v.user}</td>
        <td>{v.pass}</td>
        <td>
          <div className="d-flex gap-4">
            <button className="btn btn-danger" onClick={() => deleteData(i)}>
              delete
            </button>
            <button className="btn btn-primary" onClick={() => updateData(i)}>
              update
            </button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <div className="container pt-5">
        <form onSubmit={handlingValue}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              ref={userRef}
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              ref={passRef}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            {updS ? "Update" : "Submit"}
          </button>
        </form>
      </div>
      <div className="mt-5">
        <table className="table table-hover table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Password</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {user.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No data found
                </td>
              </tr>
            ) : (
              allData
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
  