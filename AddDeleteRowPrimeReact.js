import { useState } from "react";

import { useForm, useFieldArray } from "react-hook-form";

import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";

import { DataTable } from "primereact/datatable";

import { Column } from "primereact/column";

const ServiceOptions = [

  { label: "Service 1", value: "service1" },

  { label: "Service 2", value: "service2" },

  { label: "Service 3", value: "service3" },

  { label: "Service 4", value: "service4" },

  { label: "Service 5", value: "service5" },

];

const RoleOptions = [

  { label: "Checker", value: "checker" },

  { label: "Maker", value: "maker" },

];

const Table = () => {

  const [selectedRow, setSelectedRow] = useState(null);

  const { control, handleSubmit, reset } = useForm({

    defaultValues: {

      rows: [],

    },

  });

  const { fields, append, remove } = useFieldArray({

    control,

    name: "rows",

  });

  const onSubmit = (data) => {

    if (selectedRow === null) {

      append(data.rows);

    } else {

      fields[selectedRow] = data.rows[0];

    }

    reset();

    setSelectedRow(null);

  };

  const deleteRow = () => {

    if (selectedRow !== null) {

      remove(selectedRow);

      reset();

      setSelectedRow(null);

    }

  };

  const editRow = (index) => {

    setSelectedRow(index);

    reset({ rows: [fields[index]] });

  };

  return (

    <>

      <form onSubmit={handleSubmit(onSubmit)}>

        <DataTable value={fields} selectionMode="single" selection={selectedRow} onSelectionChange={(e) => setSelectedRow(e.value)}>

          <Column header="Service">

            <Dropdown name="rows.0.service" options={ServiceOptions} optionLabel="label" optionValue="value" />

          </Column>

          <Column header="User Role">

            <Dropdown name="rows.0.role" options={RoleOptions} optionLabel="label" optionValue="value" />

          </Column>

          <Column header="Edit">

            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={deleteRow} />

          </Column>

        </DataTable>

        <div className="p-mt-2">

          <Button label="Add Row" onClick={() => reset({ rows: [{ service: "", role: "" }] })} className="p-mr-2" />

          <Button label="Save" type="submit" className="p-button-success" />

        </div>

      </form>

    </>

  );

};

export default Table;

