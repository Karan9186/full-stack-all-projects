import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  let [formdata, setFormData] = useState({
    name: "",
    pass: "",
    index: "",
  });
  let [user, setUser] = useState([]);
  let getval = (e) => {
    let olddata = { ...formdata };
    let InputName = e.target.name;
    let InputValue = e.target.value;
    olddata[InputName] = InputValue;
    setFormData(olddata);
  };

  let handlingData = (e) => {
    let CurrentUser = {
      name: formdata.name,
      pass: formdata.pass,
    };
    if (formdata.index == "") {
      let OldUser = [...user, CurrentUser];
      setUser(OldUser);
    } else {
      let index = formdata.index - 1;
      let UserUpd = user;
      UserUpd[index]["name"] = formdata.name;
      UserUpd[index]["pass"] = formdata.pass;
      setUser(UserUpd);
    }

    setFormData({
      name: "",
      pass: "",
      index: "",
    });
    e.preventDefault();
  };

  let UpdateData = (index) => {
    // let Inex = i;
    let ShowUser = user.filter((v, i) => i == index)[0];
    let CurrentUserUpd = {
      name: ShowUser.name,
      pass: ShowUser.pass,
      index: index + 1,
    };
    setFormData(CurrentUserUpd);
  };
  let deleteData = (i) => {
    let Index = i;
    let NewUser = user.filter((v, i) => i != Index);

    setUser(NewUser);
  };
  let AllDataPrint = user.map((v, i) => {
    return (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{v.name}</td>
        <td>{v.pass}</td>
        <td>
          <div className="d-flex gap-4">
            <button className="btn btn-primary" onClick={() => UpdateData(i)}>
              Update
            </button>
            <button className="btn btn-danger" onClick={() => deleteData(i)}>
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  });
  return (
    <div className="container pt-5">
      <Form onSubmit={handlingData}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter User Name"
            value={formdata.name}
            onChange={getval}
            name="name"
          />
          <Form.Text className="text-muted">
            We'll never share your username with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Password"
            value={formdata.pass}
            onChange={getval}
            name="pass"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {!formdata.index == "" ? "Update" : "save"}
        </Button>
      </Form>
      <div className="pt-5">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>UserName</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{user.length <= 0 ? "no data" : AllDataPrint}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;
