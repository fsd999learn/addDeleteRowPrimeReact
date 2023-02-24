import React, { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';

import { Column } from 'primereact/column';

import { InputText } from 'primereact/inputtext';

import userList from './userList.json';

const DataTableDemo = () => {

  const [staffList, setStaffList] = useState([]);

  useEffect(() => {

    const jsonData = userList.map(user => {

      return {

        staffbankid: user.staffbankid,

        staffname: user.staffname,

        businessunit6: user.businessunit6,

        country: user.country,

        role: user.role,

        status: user.status,

      };

    });

    setStaffList(jsonData);

  }, []);

  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (

    <div className="table-header">

      <h1>Staff Details</h1>

      <div className="p-datatable-globalfilter-container">

        <InputText

          type="search"

          onInput={(e) => setGlobalFilter(e.target.value)}

          placeholder="Global Search"

        />

      </div>

    </div>

  );

  const editButtonBodyTemplate = () => {

    return (

      <button className="p-link">

        <span className="pi pi-pencil"></span>

      </button>

    );

  };

  return (

    <div className="datatable-editing-demo">

      <div className="card">

        <DataTable

          value={staffList}

          editable={true}

          editMode="row"

          className="p-datatable-customers"

          globalFilter={globalFilter}

          header={header}

        >

          <Column selectionMode="multiple" style={{width:'3em'}} />

          <Column field="staffbankid" header="Staff Bank ID" sortable={true} />

          <Column field="staffname" header="Staff Name" sortable={true} />

          <Column field="businessunit6" header="Business Unit" sortable={true} />

          <Column field="country" header="Country" sortable={true} />

          <Column field="role" header="Role" sortable={true} />

          <Column field="status" header="Status" sortable={true} />

          <Column body={editButtonBodyTemplate} />

        </DataTable>

      </div>

    </div>

  );

};

export default DataTableDemo;

