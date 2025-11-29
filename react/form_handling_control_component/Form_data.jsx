import React, { useState } from "react";

function Form_data() {
  let [formData, setFormData] = useState({
    user: "",
    pass: "",
  });

  let [user, setUser] = useState([]);

  let SetData = (e) => {
    let CurrentData = { ...formData };
    let InputName = e.target.name;
    let InputValue = e.target.value;

    CurrentData[InputName] = InputValue;
    console.log(CurrentData);
    setFormData(CurrentData);
  };

  let handleData = (e) => {
    let oldData = {
      user: formData.user,
      pass: formData.pass,
    };

    let userData = [...user, oldData];

    setUser(userData);
    console.log(userData);
    e.preventDefault();
  };
  return (
    <div>
      {user.length}
      <form action="" onSubmit={handleData}>
        user <br />
        <input
          type="text"
          name="user"
          onChange={SetData}
          value={formData.user}
        />
        <br />
        pass <br />
        <input
          type="text"
          name="pass"
          onChange={SetData}
          value={formData.pass}
        />
        <br />
        <button type="submit">save</button>
      </form>
    </div>
  );
}

export default Form_data;
