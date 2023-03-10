import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import data from "./data.json";

const Form = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [makerCheckboxes, setMakerCheckboxes] = useState([]);
  const [checkerCheckboxes, setCheckerCheckboxes] = useState([]);

  const projects = [...new Set(data.map((item) => item.projectname))];

  const services = selectedProject
    ? data
        .filter((item) => item.projectname === selectedProject)
        .map((item) => item.servicename)
    : [];

  const makerHeader = <Checkbox onChange={toggleMakerCheckboxes} />;
  const checkerHeader = <Checkbox onChange={toggleCheckerCheckboxes} />;

  const onSubmit = () => {
    console.log("Selected Services:", selectedServices);
    console.log("Maker Checkboxes:", makerCheckboxes);
    console.log("Checker Checkboxes:", checkerCheckboxes);
  };

  const toggleMakerCheckboxes = (event) => {
    const checked = event.checked;
    const newCheckboxes = selectedServices.map((service) => ({
      ...service,
      maker: checked,
    }));
    setMakerCheckboxes(newCheckboxes);
  };

  const toggleCheckerCheckboxes = (event) => {
    const checked = event.checked;
    const newCheckboxes = selectedServices.map((service) => ({
      ...service,
      checker: checked,
    }));
    setCheckerCheckboxes(newCheckboxes);
  };

  const makerCheckboxTemplate = (rowData) => (
    <Checkbox
      checked={rowData.maker}
      onChange={(event) => {
        const checked = event.checked;
        const newCheckboxes = selectedServices.map((service) => {
          if (service.id === rowData.id) {
            return { ...service, maker: checked };
          } else {
            return service;
          }
        });
        setMakerCheckboxes(newCheckboxes);
      }}
    />
  );

  const checkerCheckboxTemplate = (rowData) => (
    <Checkbox
      checked={rowData.checker}
      onChange={(event) => {
        const checked = event.checked;
        const newCheckboxes = selectedServices.map((service) => {
          if (service.id === rowData.id) {
            return { ...service, checker: checked };
          } else {
            return service;
          }
        });
        setCheckerCheckboxes(newCheckboxes);
      }}
    />
  );

  return (
    <div>
      <Dropdown
        value={selectedProject}
        options={projects}
        onChange={(event) => {
          setSelectedProject(event.target.value);
          setSelectedServices([]);
          setMakerCheckboxes([]);
          setCheckerCheckboxes([]);
        }}
        placeholder="Select a Project"
      />
      <DataTable value={selectedServices}>
        <Column field="servicename" header="Service Name" />
        <Column field="maker" header={makerHeader} body={makerCheckboxTemplate} />
        <Column field="checker" header={checkerHeader} body={checkerCheckboxTemplate} />
      </DataTable>
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
};

export default Form;
