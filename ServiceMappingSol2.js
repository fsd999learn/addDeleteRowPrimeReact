import { useState } from 'react';

import { Dropdown } from 'primereact/dropdown';

import { Button } from 'primereact/button';

import { Table } from 'primereact/table';

const initialServiceMapping = [

  { service: 'Select an option', role: 'Select an option' },

];

const roles = ['Checker', 'Maker'];

const ServiceMappingTable = () => {

  const [serviceMapping, setServiceMapping] = useState(initialServiceMapping);

  const onRoleChange = (event, rowIndex) => {

    const updatedServiceMapping = [...serviceMapping];

    updatedServiceMapping[rowIndex].role = event.value;

    setServiceMapping(updatedServiceMapping);

  };

  const onAddRow = () => {

    setServiceMapping([...serviceMapping, { service: 'Select an option', role: 'Select an option' }]);

  };

  const onRemoveRow = (rowIndex) => {

    const updatedServiceMapping = [...serviceMapping];

    updatedServiceMapping.splice(rowIndex, 1);

    setServiceMapping(updatedServiceMapping);

  };

  const roleDropdown = (rowData, rowIndex) => {

    return (

      <Dropdown

        value={rowData.role}

        options={roles}

        onChange={(e) => onRoleChange(e, rowIndex)}

        placeholder="Select a role"

      />

    );

  };

  const removeButton = (rowData, rowIndex) => {

    return (

      <Button

        label="Remove"

        className="p-button-danger"

        onClick={() => onRemoveRow(rowIndex)}

      />

    );

  };

  const columns = [

    { field: 'service', header: 'Service Name' },

    { field: 'role', header: 'User Role', body: roleDropdown },

    { body: removeButton },

  ];

  return (

    <>

      <Table value={serviceMapping} header="Service Mapping" responsive>

        <thead>

          <tr>

            {columns.map((column) => (

              <th key={column.field}>{column.header}</th>

            ))}

          </tr>

        </thead>

        <tbody>

          {serviceMapping.map((row, rowIndex) => (

            <tr key={rowIndex}>

              {columns.map((column) => (

                <td key={`${rowIndex}_${column.field}`}>

                  {column.body ? column.body(row, rowIndex) : row[column.field]}

                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </Table>

      <Button label="Add Row" className="p-mt-2" onClick={onAddRow} />

    </>

  );

};

export default ServiceMappingTable;

