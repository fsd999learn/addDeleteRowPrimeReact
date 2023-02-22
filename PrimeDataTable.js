
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
// import { MultiSelect } from 'primereact/multiselect';
import PrimeMultiSelect from './PrimeMultiSelect'
import { Dropdown } from 'primereact/dropdown';

export default function PrimeDataTable({ data, rawData, setRawData, primaryButton, primaryOnClick, secondaryButton, secondaryOnClick, createToolTip, showDelete, selectionMode, headerMultiSelect, onSelect, multiSelectOptions, handleMultiSelect, multiSelectLabel, header, className, editable, editFunction, customEdit, emptyData, rawEmptyData, editableObj, sortable }) {
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [localData, setLocalData] = useState(null);
    const [selected, setSelected] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [visible, setVisible] = useState(false);
    const [addNewRow, setAddNewRow] = useState(false);
    // const [selectedOptions, setSelectedOptions] = useState(null);   //for multiselect

    const toast = useRef(null);
    const dt = useRef(null);

    let columns = [];

    for (var key in data[0]) { columns.push(key); }

    const exportColumns = columns.map(col => ({ title: col, dataKey: col }));

    //for filtering
    const initFilters = () => {
        let filterList = { 'global': { value: null, matchMode: FilterMatchMode.CONTAINS } }

        for (let i in columns) {
            filterList = { ...filterList, [columns[i]]: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] } }
        }

        setFilters(filterList);
        setGlobalFilterValue('');
    }

    const clearFilter = () => {
        initFilters();
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const renderGlobalFilter = () => {
        return (
            <>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />

                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={`Search ${data.length} records...`} className='search' />
                </span>

                <Button type="button" icon="pi pi-filter-slash" label="Clear filters" className="p-button-outlined" onClick={clearFilter} />
            </>
        );
    }
    //end of filtering

    useEffect(() => {
        setLocalData(data);

        initFilters();

    }, []);

    useEffect(() => {
        setLocalData(data);

    }, [data]);


    //for export
    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }

    const exportPdf = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, localData);
                doc.save('data.pdf');
            })
        })
    }

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(localData);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'data');
        });
    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(module => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const d = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(d, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    }
    //end of export

    //for deleting
    const confirmDeleteSelected = () => {
        setDeleteDialog(true);
    }

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    }

    const deleteSelected = () => {
        let selectedID = [];

        selected.forEach(s => selectedID.push(s[columns[0]]));

        let _data = rawData.filter(val => !selectedID.includes(val[columns[0].replaceAll(" ", "").toLowerCase()]));

        setRawData(_data);
        setDeleteDialog(false);
        setSelected(null);

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Row(s) Deleted', life: 3000 });
    }

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelected} />
        </React.Fragment>
    );
    //end of deleting

    //for multiselect
    // const renderMultiSelect = () => {
    //     return (
    //         <span className="p-float-label">
    //             <MultiSelect inputId="multiselect" value={selectedOptions} options={multiSelectOptions} onChange={(e) => multiSelectOnChange(e.value)} optionLabel="label" maxSelectedLabels={3} display='chip' filter />

    //             <label htmlFor="multiselect">{multiSelectLabel}</label>
    //         </span>
    //     );
    // }

    // const multiSelectOnChange = (values) => {
    //     setSelectedOptions(values);

    //     handleMultiSelect(values);
    // }
    //end of multiselect

    const addRow = () => {
        let _data = [...localData]

        _data.unshift(emptyData);

        setLocalData(_data);

        // rawData.unshift(rawEmptyData);

        // setRawData(rawData);
        setVisible(true);
        setAddNewRow(true);

        document.getElementsByClassName('p-row-editor-init p-link')[0].setAttribute('style', 'box-shadow: 0 0 0 0.2rem #BFDBFE');

        setTimeout(() => {
            const closeEl = document.getElementsByClassName('p-dialog-header-icon p-dialog-header-close p-link')[0];

            if (closeEl) { closeEl.click(); }

        }, "3000")
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-between p-component mb-1">
                <div className="space-x-4">
                    {headerMultiSelect ? <PrimeMultiSelect handleMultiSelect={handleMultiSelect} multiSelectOptions={multiSelectOptions} multiSelectLabel={multiSelectLabel} /> : renderGlobalFilter()}
                </div>

                <div className="space-x-4">
                    {headerMultiSelect ? renderGlobalFilter() : ''}

                    <Button type="button" label="Export as CSV" icon="pi pi-file-export" onClick={() => exportCSV(false)} className="p-button-outlined" />

                    {secondaryButton ? <Button type="button" label={secondaryButton} icon='pi pi-arrow-right-arrow-left' className="p-button-outlined" onClick={secondaryOnClick} /> : ''}

                    {primaryButton ? <Button type="button" label={primaryButton} icon="pi pi-plus" className="bg-SCBlue" onClick={primaryOnClick !== undefined ? primaryOnClick : addRow} /> : ''}

                    {showDelete ? <Button type="button" label="Delete" icon="pi pi-trash" className="p-button-danger" onClick=
                        {confirmDeleteSelected} disabled={!selected || !selected.length} /> : ''}

                    {/* <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="" data-pr-tooltip="Export as XLS" />

                    <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning" data-pr-tooltip="Export as PDF" /> */}
                </div>
            </div>
        )
    }

    const getEmployeeDetails = (empData) => {
        let detailList = [];

        const demoDetails = {
            'Staff Bank ID': '1639187',
            'Staff Name': 'Dallon',
            'Business Unit 6': 'TTO OPS Data RF Projects',
            'Country': 'Singapore'
        }

        for (var key in demoDetails) { detailList.push(key); }

        if (empData['Staff Bank ID'] === demoDetails['Staff Bank ID']) {
            for (const detail of detailList) { empData[detail] = demoDetails[detail]; }
        }

        return empData;
    }

    //for editing
    const onRowEditComplete = (e) => {
        let _data = [...localData], { newData, index } = e, updatedList = rawData;

        if (newData[columns[0]] !== '') {
            if (_data.filter(e => e[columns[0]] === newData[columns[0]]).length > 0 && addNewRow) {
                toast.current.show({ severity: 'warn', summary: 'Unable to Update Row', detail: `Duplicate ${columns[0]} entered`, life: 3000 });

            } else {
                if ('Staff Bank ID' in newData) {
                    newData = getEmployeeDetails(newData);

                    if (addNewRow) {
                        rawData.unshift(rawEmptyData);

                        setRawData(rawData);
                    }
                }

                _data[index] = newData;

                setLocalData(_data);

                for (let i = 0; i < columns.length; i++) {
                    let formattedStr = columns[i].replaceAll(" ", "").toLowerCase()

                    updatedList[index][formattedStr] = newData[columns[i]];

                    setRawData(updatedList);
                }

                toast.current.show({ severity: 'info', summary: 'Row Updated', detail: `${e.data[columns[0]] ? `${columns[0]}: ${e.data[columns[0]]}` : 'Added Sucessfully'}`, life: 3000 });

                setAddNewRow(false);
            }
        } else { toast.current.show({ severity: 'warn', summary: 'Unable to Update Row', detail: `Please enter ${columns[0]}`, life: 3000 }); }
    }

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }
    //end of editing

    //for selection
    const onRowSelect = (event) => {
        // toast.current.show({ severity: 'info', summary: 'Row Selected', detail: `${columns[0]}: ${event.data[columns[0]]}`, life: 3000 });
    }

    const onRowUnselect = (event) => {
        // toast.current.show({ severity: 'warn', summary: 'Row Unselected', detail: `${columns[0]}: ${event.data[columns[0]]}`, life: 3000 });
    }
    //end of selection

    const pTemplate = {
        layout: 'RowsPerPageDropdown CurrentPageReport PageLinks',
        'RowsPerPageDropdown': (options) => {
            const dropdownOptions = [
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 15, value: 15 },
                { label: 20, value: 20 },
                { label: 50, value: 50 }
            ];

            return (
                <React.Fragment>
                    <span className="mx-1">Rows per page</span>
                    <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
                </React.Fragment>
            );
        }
        ,
        'CurrentPageReport': (options) => {
            return (
                <span className="mx-5">
                    Showing {options.first} - {options.last} of {options.totalRecords}
                </span>
            )
        }
    };

    const editBodyTemplate = (rowData) => {
        return <i className="pi pi-pencil text-SCBlue border-b-2 border-SCBlue pb-1" onClick={() => editFunction(rowData)} />;
    }

    const formatColumn = (rowData) => {
        if (rowData['Status'] !== undefined) {
            switch (rowData['Status'].toLowerCase()) {
                case 'active':
                    return 'text-white bg-SCActive font-semibold';

                case 'inactive':
                    return 'text-white bg-SCInactive font-semibold';

                default:
                    break;
            }
        }
    }

    const dropdownEditor = (options, field, optionList) => {
        return (
            <Dropdown
                value={options.value}
                options={optionList}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder={`Select a ${field}`}
            />
        );
    }

    const checkEditable = (field) => {
        if (editableObj !== undefined) {
            if (field in editableObj) {
                if (editableObj[field] === 'textfield') {
                    return (options) => textEditor(options)

                } else {
                    return (options) => dropdownEditor(options, field, editableObj[field])
                }
            } else {
                return null;
            }
        }

        return null;
    }

    return (
        <div>
            <Toast ref={toast} />

            <div className="card">
                <Tooltip target="button" position="bottom" />

                <Dialog header="User Management" visible={visible} onHide={() => setVisible(false)} position='top-right'>
                    <p className="m-0">
                        Please click on the edit button to enter staff details.
                    </p>
                </Dialog>

                <DataTable
                    // dataKey={columns[0]}
                    // rowsPerPageOptions={[5, 10, 25]} 
                    value={localData} responsiveLayout="scroll" paginator rows={10}
                    paginatorTemplate={pTemplate} editMode='row' globalFilterFields={columns} header={header ? renderHeader() : ''} filters={filters} onRowEditComplete={onRowEditComplete} ref={dt} selectionMode={selectionMode} metaKeySelection={false} selection={selected} onSelectionChange={e => setSelected(e.value)} autoLayout='true' onRowSelect={onSelect ? (e => onSelect(e.data[columns[0]])) : onRowSelect} onRowUnselect={onRowUnselect} style={{ 'borderRadius': '10px' }} rowHover className={className}>
                    <Column selectionMode={selectionMode === 'single' ? '' : 'multiple'} headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    {columns.map((c) => {
                        return <Column key={`${c}`} field={`${c}`} header={`${c}`} sortable={sortable} filter filterPlaceholder={`Search by ${c}`}
                            editor={checkEditable(c)}
                            bodyClassName={c.toLowerCase() === 'status' ? formatColumn : ''} style={c.toLowerCase() === 'status' ? { 'textAlign': 'center' } : ''} />
                    })}
                    {editable ? <Column rowEditor header="Edit" alignHeader='center' style={{ 'textAlign': 'center', 'minWidth': '110px' }} /> : null}
                    {customEdit ? <Column header="Edit" alignHeader='center' body={editBodyTemplate} style={{ 'textAlign': 'center' }} /> : null}
                </DataTable>
            </div>

            <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {localData && <span>Are you sure you want to delete the selected row(s)?</span>}
                </div>
            </Dialog>
        </div >
    );
}
