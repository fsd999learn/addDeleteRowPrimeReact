import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function PrimeFileUpload({ setUploadedFile }) {
  const toast = useRef(null);
  const [data, setData] = useState([]);

  const handleUpload = async (event) => {
    const file = event.files[0];
    setUploadedFile(file);

    const filename = file.name;
    const extension = filename.substring(filename.lastIndexOf('.') + 1).toUpperCase();

    if (extension === 'CSV' || extension === 'XLS' || extension === 'XLSX') {
      const reader = new FileReader();

      reader.onload = function (e) {
        const content = e.target.result;
        const workbook = XLSX.read(content, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        setData(jsonData);
      };

      reader.readAsBinaryString(file);
    } else {
      toast.current.show({ severity: 'error', summary: 'Invalid File', detail: 'Please upload a CSV or Excel file.' });
    }
  };

  const bodyTemplate = (rowData, column) => {
    if (rowData['Employee Name'].includes('Datatype')) {
      const stringList = rowData[column].split('\\n');

      return (
        <>
          {stringList.map((s, i) => {
            return <p key={i}>{s}</p>;
          })}
        </>
      );
    } else {
      return rowData[column];
    }
  };

  const renderDataTable = () => {
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return (
      <DataTable value={data} className="mt-6" rowHover paginator rows={10} rowsPerPageOptions={[5, 10, 25]} paginatorTemplate="CurrentPageReport RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
        {columns.map((c, i) => {
          return <Column key={c} field={c} header={c} body={(rowData) => bodyTemplate(rowData, c)} />;
        })}
      </DataTable>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast}></Toast>

      <FileUpload
        mode="basic"
        name="file"
        url=""
        maxFileSize={1000000}
        accept=".csv,.xls,.xlsx"
        chooseOptions={{ className: 'bg-SCBlue' }}
        chooseLabel="Choose File"
        className="p-mr-2"
        onUpload={handleUpload}
      />

      <div className="p-mt-2">{renderDataTable()}</div>
    </div>
  );
}
