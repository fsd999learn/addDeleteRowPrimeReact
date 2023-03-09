//prime react upload datatable, upload a csv, excel file and have it preview upon loading in primereact datatable format 

import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import uploadImg from '../../icons/upload.svg';

export default function PrimeFileUpload({ setUploadedFile }) {
    let temp = null;

    const toast = useRef(null);

    const [data, setData] = useState([]);
    const [totalSize, setTotalSize] = useState(0);

    const [chooseButtonObj, setChooseButtonObj] = useState(null);

    const chooseOptions = { className: 'bg-SCBlue' };

    const handleUpload = async (event) => {
        const file = event.files[0];

        setUploadedFile(file);

        var filename = file.name;
        var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();

        if (extension === '.CSV') { csvFileToJSON(file); }

        var el = document.getElementsByClassName('p-fileupload-content')[0];

        el.style.backgroundColor = "#F4F4F4";
        el.style.border = '1px solid #dee2e6';
    };

    useEffect(() => { setChooseButtonObj(temp); }, []);

    function csvFileToJSON(file) {
        try {
            var reader = new FileReader();

            reader.readAsText(file);
            reader.onload = function (e) {
                var jsonData = [];
                var headers = [];
                var rows = reader.result.split("\n");

                for (var i = 0; i < rows.length; i++) {
                    if (rows[i] !== '') {
                        var cells = rows[i].split(",");
                        var rowData = {};

                        for (var j = 0; j < cells.length; j++) {
                            if (i == 0) {
                                var headerName = cells[j].replaceAll('"', '').trim();

                                headers.push(headerName);

                            } else {
                                var key = headers[j];

                                if (key) {
                                    rowData[key] = cells[j].replaceAll('"', '').trim();
                                }
                            }
                        }
                        //skip the first row (header) data
                        if (i != 0) { jsonData.push(rowData); }
                    }
                }
                setData(jsonData);
            }
        } catch (e) {
            console.error(e);
        }
    }
    console.log(data)
    const bodyTemplate = (rowData, column) => {
        if (rowData['Employee Name'].includes('Datatype')) {
            let stringList = rowData[column].split('\\n');

            return (
                <>{stringList.map((s, i) => { return <p key={i}>{s}</p> })}</>
            )
        } else {
            return rowData[column];
        }
    }

    const renderDataTable = () => {
        let columns = [];

        for (var key in data[0]) { columns.push(key); }

        return (
            <DataTable id='uploadTable' value={data} className='mt-6' rowHover paginator rows={10} rowsPerPageOptions={[5, 10, 25]} paginatorTemplate="CurrentPageReport RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
                {columns.map((c, i) => { return <Column key={`${c}`} field={`${c}`} header={`${c}`} body={(rowData) => bodyTemplate(rowData, c)} /> })}
            </DataTable>
        );
    }

    const headerTemplate = (options) => {
        const { chooseButton } = options;

        temp = chooseButton;
    };

    const emptyTemplate = () => {
        return (
            <div className="flex flex-col items-center m-5">
                <img src={uploadImg} alt='upload image' className="h-8" />

                <span className="my-5 text-xs">Drag files to upload, or</span>

                {chooseButtonObj}

                <p className='mt-3' style={{ 'fontSize': '8px' }}>Include any file requirements here</p>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex flex-wrap items-center align-items-center">
                <div className="flex items-center align-items-center" style={{ width: '40%' }}>
                    <i className="ml-2 pi pi-file text-SCBlue" />

                    <span className="flex ml-3 text-lg">
                        <p className='font-semibold'>{file.name}</p>

                        <p className='ml-2'> {props.formatSize.toLowerCase()}</p>
                    </span>
                </div>

                <i className="ml-auto mr-2 cursor-pointer pi pi-times text-SCInactive" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();

        var el = document.getElementsByClassName('p-fileupload-content')[0];

        el.style.backgroundColor = "#FEFEFE";
        el.style.border = '1px dashed #525355';

        setUploadedFile(null);
    };



    return (
        <div className="card">
            <Toast ref={toast}></Toast>

            <FileUpload url='' name="file" maxFileSize={1000000} chooseLabel='Choose File' className='w-full' customUpload uploadHandler={handleUpload} emptyTemplate={emptyTemplate} onRemove={() => setData([])} auto itemTemplate={itemTemplate} headerClassName='hidden' headerTemplate={headerTemplate}
                chooseOptions={chooseOptions}
            />

            {data.length !== 0 ? renderDataTable() : ''}
        </div>
    )
}
