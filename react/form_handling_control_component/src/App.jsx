import { useState } from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import Form_data from "../Form_data";
import { Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
function App() {
  let [formdata, setFormData] = useState({
    name: "",
    pass: "",
    index: "",
  });

  let [userData, setUserData] = useState([]);

  let getVal = (e) => {
    let oldVal = { ...formdata };
    let inputName = e.target.name;
    let inputValue = e.target.value;
    oldVal[inputName] = inputValue;
    setFormData(oldVal);
  };

  let handleFormData = (e) => {
    let currentData1 = {
      name: formdata.name,
      pass: formdata.pass,
    };
    if (formdata.index == "") {
      let checkData = userData.filter((v) => v.name == formdata.name);
      if (checkData.length == 1) {
        toast.error("User already exist");
      } else {
        if (formdata.name == "" || formdata.pass == "") {
          toast.error("Invalid Input");
        } else {
          let oldData = [...userData, currentData1];
          setUserData(oldData);
          toast.success("Data Insered ");
        }
      }
    } else {
      if (formdata.name == "" || formdata.pass == "") {
        toast.error("Invalid Input");
      } else {
        let Eindex = formdata.index - 1;
        console.log(Eindex);
        let oldData = userData;
        oldData[Eindex]["name"] = formdata.name;
        oldData[Eindex]["pass"] = formdata.pass;
        setUserData(oldData);

        toast.success("Data Updated ");
      }
      setFormData({
        name: "",
        pass: "",
        index: "",
      });
    }
    e.preventDefault();
  };

  let deleteData = (inex) => {
    let filterData = userData.filter((v, i) => i != inex);
    setUserData(filterData);
    toast.success("Data Deleted ");
  };

  let updateData = (index) => {
    let currentD = userData.filter((v, i) => i == index)[0];
    console.log(index);
    let tempData = {
      name: currentD.name,
      pass: currentD.pass,
      index: index + 1,
    };
    setFormData(tempData);
  };

  let all_form_data = userData.map((v, i) => {
    return (
      <>
        <tr>
          <td>{i + 1}</td>
          <td>{v.name}</td>
          <td>{v.pass}</td>
          <div className="d-flex gap-4">
            <td>
              <button className="btn btn-primary" onClick={() => updateData(i)}>
                Update
              </button>
            </td>
            <td>
              <button className="btn btn-danger" onClick={() => deleteData(i)}>
                Delete
              </button>
            </td>
          </div>
        </tr>
      </>
    );
  });
  return (
    <>
      <div className="container p-5 form-group">
        <ToastContainer />
        <form onSubmit={handleFormData}>
          <div className="form-control pt-2">
            <label for="name">Username</label>
            <br />
            <input
              type="text"
              onChange={getVal}
              name="name"
              value={formdata.name}
            />
          </div>

          <div className="form-control pt-2">
            <label for="pass">Password</label>
            <br />
            <input
              type="text"
              onChange={getVal}
              name="pass"
              value={formdata.pass}
            />
            <br />
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            {!formdata.index == "" ? "update" : "save"}
          </button>
        </form>
        <h1 className="container mt-4">All Datas</h1>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Username</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.length == 0 ? (
                <tr colspan="4">no data</tr>
              ) : (
                all_form_data
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default App;
