import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const DataTableDemo = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingRows, setEditingRows] = useState([]);

  const [users, setUsers] = useState([
    {
      staffbankid: "1234567",
      staffname: "User1",
      businessunit6: "Business Unit 1",
      country: "Australia",
      role: "Admin",
      status: "Active",
    },
    {
      staffbankid: "1234568",
      staffname: "User2",
      businessunit6: "Business Unit 2",
      country: "India",
      role: "Admin",
      status: "Active",
    },
    {
      staffbankid: "1234569",
      staffname: "User3",
      businessunit6: "Business Unit 3",
      country: "Malaysia",
      role: "User",
      status: "Active",
    },
    {
      staffbankid: "1234570",
      staffname: "User4",
      businessunit6: "Business Unit 4",
      country: "Singapore",
      role: "User",
      status: "Active",
    },
    {
      staffbankid: "1234571",
      staffname: "User5",
      businessunit6: "Business Unit 5",
      country: "Zimbawe",
      role: "User",
      status: "Inactive",
    },
    {
      staffbankid: "1234572",
      staffname: "User6",
      businessunit6: "Business Unit 6",
      country: "China",
      role: "User",
      status: "Inactive",
    },
  ]);

  const onRowEditInit = (event) => {
    setEditingRows([...editingRows, event.data.staffbankid]);
  };

  const onRowEditSave = (event) => {
    const index = users.findIndex(
      (user) => user.staffbankid === event.data.staffbankid
    );
    const newUser = { ...users[index], ...event.data };
    const newUsers = [...users];
    newUsers[index] = newUser;
    setUsers(newUsers);
    setEditingRows(editingRows.filter((id) => id !== event.data.staffbankid));
  };

  const onRowEditCancel = (event) => {
    setEditingRows(editingRows.filter((id) => id !== event.data.staffbankid));
  };

  const editButton = (rowData) => {
    const editing = editingRows.includes(rowData.staffbankid);

    if (editing) {
      return (
        <React.Fragment>
          <Button
            icon="pi pi-check"
            onClick={() => onRowEditSave({ data: rowData })}
          />
          <Button
            icon="pi pi-times"
            className="p-button-danger"
            onClick={() => onRowEditCancel({ data: rowData })}
          />
        </React.Fragment>
      );
    } else {
      return (
        <Button
          icon="pi pi-pencil"
          onClick={() => onRowEditInit({ data: rowData })}
        />
      );
    }
  };

  return (
    <div>
      <DataTable
        value={users}
        selection={selectedItems}
        onSelectionChange={(e) => setSelectedItems(e.value)}
        editMode="row"
        dataKey

