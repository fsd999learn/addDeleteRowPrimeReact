import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Form = ({ serviceList }) => {
  const { control, handleSubmit } = useForm();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedServices, setSelectedServices] = useState(serviceList);
  const [makerCheckboxes, setMakerCheckboxes] = useState([]);
  const [checkerCheckboxes, setCheckerCheckboxes] = useState([]);

  const projects = [
    ...new Set(serviceList.map((item) => item.projectname))
  ];

  const makerHeader = <Checkbox onChange={toggleMakerCheckboxes} />;
  const checkerHeader = <Checkbox onChange={toggleCheckerCheckboxes} />;

  const onSubmit = (data) => {
    console.log(data);
  };

  const toggleMakerCheckboxes = (event) => {
    const checked = event.checked;
    const newCheckboxes = selectedServices.map((service) => ({
      ...service,
      maker: checked
    }));
    setMakerCheckboxes(newCheckboxes);
  };

  const toggleCheckerCheckboxes = (event) => {
    const checked = event.checked;
    const newCheckboxes = selectedServices.map((service) => ({
      ...service,
      checker: checked
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <Column
            header="Maker"
            body={makerCheckboxTemplate}
            style={{ textAlign: "center" }}
          />
          <Column
            header="Checker"
            body={checkerCheckboxTemplate}
            style={{ textAlign: "center" }}
          />
        </DataTable>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
