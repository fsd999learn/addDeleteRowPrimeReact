import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function csvFileToJSON(file) {
  try {
    var reader = new FileReader();

    reader.readAsText(file);
    reader.onload = function (e) {
      var jsonData = [];
      var headers = [];
      var rows = reader.result.split('\n');

      for (var i = 0; i < rows.length; i++) {
        if (rows[i] !== '') {
          var cells = rows[i].split(',');
          var rowData = {};

          for (var j = 0; j < cells.length; j++) {
            if (i === 0) {
              var headerName = cells[j].replaceAll('"', '').trim();

              headers.push(headerName);
            } else {
              var key = headers[j];

              if (key) {
                rowData[key] = cells[j].replaceAll('"', '').trim();
              }
            }
          }
          //skip the first row (header) data
          if (i !== 0) {
            jsonData.push(rowData);
          }
        }
      }
      setData(jsonData);
    };
  } catch (e) {
    console.error(e);
  }
}

function validateData(data) {
  for (let i = 0; i < data.length; i++) {
    for (let key in data[i]) {
      if (data[i][key] === '') {
        return `${key} cannot be empty`;
      }
    }
  }
  return null;
}

function App() {
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    csvFileToJSON(file);
  }

  function handleDataChange(newData) {
    const errorMessage = validateData(newData);
    setErrorMessage(errorMessage);
    setData(newData);
  }

  return (
    <div>
      {errorMessage && <div className="p-error">{errorMessage}</div>}
      <input type="file" onChange={handleFileUpload} />
      <DataTable value={data} onValueChange={handleDataChange}>
        {Object.keys(data[0]).map((key) => (
          <Column key={key} field={key} header={key} />
        ))}
      </DataTable>
      <button disabled={!!errorMessage}>Submit</button>
      <button onClick={() => setData([])}>Cancel</button>
    </div>
  );
}

export default App;
