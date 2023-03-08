import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { csvFileToJSON } from './csvFileToJSON';

const MyDataTable = ({ data }) => {
  return (
    <DataTable value={data} header="Uploaded Data">
      <Column field="field1" header="Field 1" />
      <Column field="field2" header="Field 2" />
      <Column field="field3" header="Field 3" />
    </DataTable>
  );
};

const App = () => {
  const [jsonData, setJsonData] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Here, you can submit the data to your server or do whatever else you need to do with it.
    // For this example, we're just logging it to the console.
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    csvFileToJSON(file, (jsonData) => {
      setJsonData(jsonData);
    });
  };

  return (
    <div className="p-grid p-nogutter">
      <div className="p-col-12">
        <h1>Upload Data File</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-field">
            <label htmlFor="file-input">Select a CSV file:</label>
            <input type="file" id="file-input" {...register("file", { required: true })} onChange={handleFileUpload} />
            {errors.file && <span className="p-error">Please select a file.</span>}
          </div>
          <Button type="submit" label="Submit" disabled={!Object.keys(errors).length} />
          <Button type="button" label="Cancel" onClick={() => setJsonData([])} className="p-button-secondary p-ml-2" />
        </form>
      </div>
      {jsonData.length > 0 && (
        <div className="p-col-12">
          <MyDataTable data={jsonData} />
        </div>
      )}
    </div>
  );
};

export default App;
