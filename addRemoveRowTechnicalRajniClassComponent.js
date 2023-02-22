import React from 'react';
import { render } from "react-dom";

class App extends React.Component {
  state = {
    rows: [{}]
  }
};
handleChange = idx => e => {
  const { name, value} = e.target;
  console.log(name, value);

  const rows = [...this.state.rows];
  rows[idx] = {
    ...rows[idx],
    [name]:value
  };
  this.setState({
    rows
  });
};

handleChangeEmail = idx => e => {
  const { name, value } = e.target;
  console.log(name, value);
  
  const rows = [...this.state.rows];
  rows[idx] = {
    ...rows[idx],
    email: value};
    this.setState({
      rows
    });
};

handleAddRow = () => {
  const item = {
    email: "",
    mobile: ""
  };
  this.setState({
    rows: [this.state.rows, item]
  });
}

handleRemoveRow = () => {
  this.setState({
    rows: this.state.rows.slice(0, -1)
  });
}

handleRemoveSpecificRow = idx => () => {
  const rows = [...this.state.rows];
  rows.splice(idx, 1);
  this.setState({ rows });
};

render() {
  console.log(this.state.rows);
}

return (
  <div>
    <div className="container">
      <div className="row clearfix">
        <div className="col-md-12 column">
          <table className="table table-bordered table-hover"
          id="tab_logic">

            <thead>
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">Name</th>
                <th className="text-center">Mobile</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.rows.map((item, idx) => (
                <tr id="addr0" key={idx}>
                  <td>{idx}</td>
                  <td>
                    <input type="text" name="email" value={this.state.rows[idx].email} className="form-control" />
                  </td>
                  <td>
                    <input type="text" name="mobile" value={this.state.rows[idx].mobile} className="form-control" />
                  </td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm" onClick={this.handleRemoveSpecificRow(idx)}>
                      Remove
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={this.handleAddRow} className="btn btn-primary">
            Add Row
          </button>
        </div>
      </div>
    </div>
  </div>
)

render(<App />, document.getElementById("root"))
