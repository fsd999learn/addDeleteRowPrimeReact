import React, { useState } from "react";

import { DataTable } from "primereact/datatable";

import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";

const UserTable = () => {

  const [users, setUsers] = useState([{ service: "", role: "" }]);

  const services = [

    { label: "Service 1", value: "Service 1" },

    { label: "Service 2", value: "Service 2" },

    { label: "Service 3", value: "Service 3" },

    { label: "Service 4", value: "Service 4" },

    { label: "Service 5", value: "Service 5" },

  ];

  const roles = [

    { label: "Select an option", value: null },

    { label: "Checker", value: "Checker" },

    { label: "Maker", value: "Maker" },

  ];

  const onRoleChange = (e, index) => {

    const updatedUsers = [...users];

    updatedUsers[index].role = e.value;

    setUsers(updatedUsers);

  };

  const onServiceChange = (e, index) => {

    const updatedUsers = [...users];

    updatedUsers[index].service = e.value;

    setUsers(updatedUsers);

  };

  const removeRow = (index) => {

    const updatedUsers = [...users];

    updatedUsers.splice(index, 1);

    setUsers(updatedUsers);

  };

  const addRow = () => {

    setUsers([...users, { service: "", role: "" }]);

  };

  const editTemplate = (rowData, index) => {

    return (

      <Button

        icon="pi pi-times"

        className="p-button-danger"

        onClick={() => removeRow(index)}

      />

    );

  };

  const userRoleTemplate = (rowData, index) => {

    return (

      <Dropdown

        value={rowData.role}

        options={roles}

        onChange={(e) => onRoleChange(e, index)}

        placeholder="Select"

      />

    );

  };

  const serviceNameTemplate = (rowData, index) => {

    return (

      <Dropdown

        value={rowData.service}

        options={services}

        onChange={(e) => onServiceChange(e, index)}

        placeholder="Select"

      />

    );

  };

  return (

    <>

      <DataTable value={users}>

        <Column

          field="service"

          header="Service Name"

          body={serviceNameTemplate}

        />

        <Column field="role" header="User Role" body={userRoleTemplate} />

        <Column header="Edit" body={editTemplate} />

      </DataTable>

      <Button label="Add row" onClick={addRow} />

      <Button label="Submit" />

    </>

  );

};

export default UserTable;

