import React from "react";
import { useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Form = ({ serviceList }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm();

  const projects = [...new Set(serviceList.map((item) => item.projectname))];

  const services = watch("project")
    ? serviceList.filter((item) => item.projectname === watch("project"))
    : [];

  const makerHeader = <Checkbox />;
  const checkerHeader = <Checkbox />;

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  const makerCheckboxTemplate = (rowData) => (
    <Checkbox
      {...register(`services.${rowData.id}.maker`)}
      checked={watch(`services.${rowData.id}.maker`)}
    />
  );

  const checkerCheckboxTemplate = (rowData) => (
    <Checkbox
      {...register(`services.${rowData.id}.checker`)}
      checked={watch(`services.${rowData.id}.checker`)}
    />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dropdown
        {...register("project")}
        options={projects}
        placeholder="Select a Project"
      />
      <DataTable value={services}>
        <Column field="servicename" header="Service Name" />
        <Column field="maker" header={makerHeader} body={makerCheckboxTemplate} />
        <Column
          field="checker"
          header={checkerHeader}
          body={checkerCheckboxTemplate}
        />
      </DataTable>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
