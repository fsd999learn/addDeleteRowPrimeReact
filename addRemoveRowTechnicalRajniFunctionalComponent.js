import React, { useState } from "react";

const App = () => {
  const [rows, setRows] = useState([{}]);

  const handleChange = (idx) => (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    const updatedRows = [...rows];
    updatedRows[idx] = {
      ...updatedRows[idx],
      [name]: value
    };
    setRows(updatedRows);
  };

  const handleChangeEmail = (idx) => (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    const updatedRows = [...rows];
    updatedRows[idx] = {
      ...updatedRows[idx],
      email: value
    };
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const item = {
      email: "",
      mobile: ""
    };
    setRows([...rows, item]);
  };

  const handleRemoveRow = () => {
    setRows(rows.slice(0, -1));
  };

  const handleRemoveSpecificRow = (idx) => () => {
    const updatedRows = [...rows];
    updatedRows.splice(idx, 1);
    setRows(updatedRows);
  };

  console.log(rows);

  return (
    <div>
      <div className="container">
        <div className="row clearfix">
          <div className="col-md-12 column">
            <table className="table table-bordered table-hover" id="tab_logic">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Mobile</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((item, idx) => (
                  <tr id="addr0" key={idx}>
                    <td>{idx}</td>
                    <td>
                      <input
                        type="text"
                        name="email"
                        value={rows[idx].email}
                        className="form-control"
                        onChange={handleChangeEmail(idx)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="mobile"
                        value={rows[idx].mobile}
                        className="form-control"
                        onChange={handleChange(idx)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleRemoveSpecificRow(idx)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleAddRow} className="btn btn-primary">
              Add Row
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
