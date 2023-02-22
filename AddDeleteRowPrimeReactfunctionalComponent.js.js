import React, { useState } from 'react';

import { DataTable } from 'primereact/datatable';

import { Column } from 'primereact/column';

import { Button } from 'primereact/button';

const App = () => {

  const [rows, setRows] = useState([{ email: '', mobile: '' }]);

  const handleChange = (idx) => (e) => {

    const { name, value } = e.target;

    const newRows = [...rows];

    newRows[idx] = { ...newRows[idx], [name]: value };

    setRows(newRows);

  };

  const handleAddRow = () => {

    const newRow = { email: '', mobile: '' };

    setRows([...rows, newRow]);

  };

  const handleRemoveRow = () => {

    setRows(rows.slice(0, -1));

  };

  const handleRemoveSpecificRow = (idx) => () => {

    const newRows = [...rows];

    newRows.splice(idx, 1);

    setRows(newRows);

  };

  return (

    <div className="container">

      <div className="row clearfix">

        <div className="col-md-12 column">

          <DataTable value={rows}>

            <Column header="#" body={(rowData, rowIndex) => rowIndex} />

            <Column

              header="Name"

              field="email"

              body={(rowData, rowIndex) => (

                <input

                  type="text"

                  name="email"

                  value={rowData.email}

                  className="form-control"

                  onChange={handleChange(rowIndex)}

                />

              )}

            />

            <Column

              header="Mobile"

              field="mobile"

              body={(rowData, rowIndex) => (

                <input

                  type="text"

                  name="mobile"

                  value={rowData.mobile}

                  className="form-control"

                  onChange={handleChange(rowIndex)}

                />

              )}

            />

            <Column

              body={(rowData, rowIndex) => (

                <Button

                  className="btn btn-outline-danger btn-sm"

                  onClick={handleRemoveSpecificRow(rowIndex)}

                  label="Remove"

                />

              )}

            />

          </DataTable>

          <Button onClick={handleAddRow} label="Add Row" className="btn btn-primary" />

        </div>

      </div>

    </div>

  );

};

export default App;

