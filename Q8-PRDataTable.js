
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { ContextMenu } from 'primereact/contextmenu';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
// import PrimeMultiSelect from './PrimeMultiSelect'
import { useForm, Controller } from "react-hook-form";

export default function PrimeDataTable({ data, setData, columns, dataKey, primaryButton, primaryOnClick, secondaryButton, secondaryOnClick, showDelete, selectionMode, onSelect, primaryMultiSelectLabel, header, className, editable, editFunction, customAction, editableObj, sortable, tabOptions, approveFunction, employeeDetails, actionTooltip
    // createToolTip, headerMultiSelect, primaryMultiSelectOptions, secondaryMultiSelectLabel
}) {
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [localData, setLocalData] = useState(data);
    const [selected, setSelected] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [visible, setVisible] = useState(false);
    const [addNewRow, setAddNewRow] = useState(false);
    const [resetMultiSelect, setResetMultiSelect] = useState(data);
    const [priMSSelected, setPriMSSelected] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState({});
    const [priFilteredData, setPriFilteredData] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [deleteRow, setDeleteRow] = useState(null);
    const [showClearSearch, setShowClearSearch] = useState(false);

    const   toast = useRef(null);
    const dt = useRef(null);
    const cm = useRef(null);
    const menuModel = [
        { label: 'Refresh', icon: 'pi pi-fw pi-refresh', command: () => refreshProduct(selected) },
        // { label: 'Refresh', icon: 'pi pi-fw pi-refresh', command: () => deleteProduct(selected) }
    ];

    const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm();

    const selectedStyle = "text-SCBlue border-b-4 border-SCBlue pb-2 font-semibold";
    const defaultStyle = "group-hover:text-SCBlue transition-all duration-500  group-hover:border-SCBlue border-b-4 border-gray-300 cursor-pointer pb-2";

    const exportColumns = columns.map(col => ({ title: col.field, dataKey: col.field }));

    const roleOptions = [
        {
            label: "Admin",
            value: "Admin",
        },
        {
            label: "User",
            value: "User",
        }
    ];

    const statusOptions = [
        {
            label: "Active",
            value: "Active",
        },
        {
            label: "Inactive",
            value: "Inactive",
        }
    ];

    const refreshProduct = (product) => {
        toast.current.show({ severity: 'info', summary: 'Grid Refreshed successfully', detail: product.name });
    };

    const deleteProduct = (product) => {
        //let _products = [...localData];

        // _products = _products.filter((p) => p.id !== product.id);

        // toast.current.show({ severity: 'error', summary: 'Row Deleted', detail: product.name });
        // setLocalData(_products);
    };
    useEffect(() => {
        initFilters();

        function handleResize() { setWindowWidth(window.innerWidth); }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        if (filteredData) { setLocalData(filteredData); }

        else {
            if (tabOptions) {
                let key = Object.keys(tabOptions);
                let filteredList = data.filter((d) => { return tabOptions[key][0][Object.keys(tabOptions[key][0])[0]].includes(d[key[0]])});

                setLocalData(filteredList);

            } else {
                setLocalData(data);
            }
        }
    }, [data]);

    
    // useEffect(() => {
    //     if (filteredData) { setLocalData(filteredData); }

    //     else {
    //         if (tabOptions) {
    //         let key = "status";
        
    //         let filteredList;
        
    //         if (selectedTab === 0) {
    //         //   if (tabOptions[key][selectedTab === "In Progress"]) {
    //         // 'In Progress' tab selected
        
    //             filteredList = data.filter((d) => {
    //             return (
    //                 d[key] === "Pending for Approval" ||
    //                 d[key] === "Validation Pending"
    //             );
    //             });
    //             } else if (selectedTab === 1) {
    //             // } else if (tabOptions.status[selectedTab]) {
    //         // } else if (tabOptions[key][selectedTab] === "Failed") {
    //             // 'Failed' tab selected
        
    //             filteredList = data.filter((d) => {
    //             return (
    //                 d[key] === "Validation Failed" || d[key] === "Submission Failed"
    //             );
    //             });
    //         } else {
    //             // Other tab selected
        
    //             filteredList = data.filter((d) => {
    //             return d[key] === tabOptions[key][selectedTab];
    //             });
    //         }
        
    //         setLocalData(filteredList);
    //         } else {
    //         setLocalData(data);
    //         }
    //     }
    //     }, [data, filteredData, selectedTab, tabOptions]);
        // }, [data, filteredData, selectedTab]);

    //for filtering
    const initFilters = () => {
        let filterList = { 'global': { value: null, matchMode: FilterMatchMode.CONTAINS } }

        for (let i in columns) {
            filterList = { ...filterList, [columns[i].field]: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] } }
        }

        setFilters(filterList);
        setGlobalFilterValue('');
    }

    const clearFilter = () => {
        initFilters();
        setShowClearSearch(false);
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);

        if (value !== '' && showClearSearch === false) {
            setShowClearSearch(true)
        } else if (value === '' && showClearSearch === true) {
            setShowClearSearch(false);
        }
    }

    const renderGlobalFilter = () => {
        return (
            <>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={`Search ${localData.length} record(s)...`} className='search' />
                    { showClearSearch ? <i className="text-gray-500 cursor-pointer pi pi-times-circle"  style={{ right: "16px" }} onClick={clearFilter} /> : '' }
                </span>
               {/* <Button type="button" icon="pi pi-refresh" label={windowWidth < 1731 ? '' : "Clear search results"} className="p-button-outlined" onClick={clearFilter} data-pr-tooltip={windowWidth < 1731 ? 'Clear search results' : ""} /> */}
            </>
        );
    }
    //end of filtering

    //for export
    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }

    const exportPdf = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                // doc.autoTable(exportColumns, localData);

                doc.autoTable(exportColumns, data);
                doc.save('data.pdf');
            })
        })
    }

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(data);
            // const worksheet = xlsx.utils.json_to_sheet(localData);

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
    const confirmDeleteSelected = (rowData) => {
        setDeleteDialog(true);
        setDeleteRow(rowData);
    }

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
        setDeleteRow(null);
    }

    const deleteSelected = () => {
        let _data = data.filter(val => !deleteRow[dataKey].includes(val[dataKey]));

        if (filteredData) {
            let fd = filteredData.filter(val => !deleteRow[dataKey].includes(val[dataKey]));

            if (fd.length > 0) {
                setFilteredData(fd);

            } else {
                setFilteredData(null);
                setResetMultiSelect(true);
            }
        }

        setData(_data);
        setDeleteDialog(false);
        setSelected(null);
        setDeleteRow(null);

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Row(s) Deleted', life: 3000 });

        //for bulk delete
        // let selectedID = [];

        // selected.forEach(s => selectedID.push(s[dataKey]));

        // let _data = data.filter(val => !selectedID.includes(val[dataKey]));

        // if (filteredData) {
        //     let fd = filteredData.filter(val => !selectedID.includes(val[dataKey]));

        //     if (fd.length > 0) {
        //         setFilteredData(fd);

        //     } else {
        //         setFilteredData(null);
        //         setResetMultiSelect(true);
        //     }
        // } end of bulk delete
    }

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelected} />
        </React.Fragment>
    );
    //end of deleting

    const showPopup = () => {
        setVisible(true);
        setValue("bu6", "Auto-retrieved");
        setValue("country", "Auto-retrieved");
        setValue("staffname", "Auto-retrieved");
    }

    const addRow = (newData) => {
        let _data = [newData, ...data]
        console.log(_data);
        setLocalData(_data);
        setAddNewRow(true);

        // document.getElementsByClassName('p-row-editor-init p-link')[0].setAttribute('style', 'box-shadow: 0 0 0 0.2rem #BFDBFE');
    }

    // const getMultiSelectOptions = (field) => {
    //     let optionList = [];
    //     let formattedList = [];
    //     let listToFilter = [];

    //     if (priMSSelected) {
    //         if (priFilteredData && priFilteredData.length > 0) {
    //             listToFilter = priFilteredData;

    //         } else if (priFilteredData && priFilteredData.length === 0) {
    //             listToFilter = data;

    //         } else {
    //             listToFilter = filteredData;

    //             setPriFilteredData(filteredData);
    //         }
    //     } else {
    //         listToFilter = data;
    //     }

    //     if (listToFilter && listToFilter.length > 0) {
    //         for (let d of listToFilter) {
    //             let formatedField = field.replaceAll(" ", "").toLowerCase();

    //             optionList.push(d[formatedField]);
    //         }

    //         let uniqueList = optionList.filter((value, index, array) => array.indexOf(value) === index);

    //         uniqueList.sort();

    //         for (let unique of uniqueList) {
    //             let obj = {
    //                 'value': unique,
    //                 'label': unique
    //             }

    //             formattedList.push(obj);
    //         }
    //         return formattedList;
    //     }
    // }

    const handleFilter = (option, field) => {
        let filteredList = [];

        const filter = { ...selectedFilter };

        filter[field] = option;

        setSelectedFilter(filter);

        filteredList = data.filter(uData => {
            let matches = 0, noOfFilters = 0;

            for (const [k, value] of Object.entries(filter)) {
                if (typeof value === 'object' && k !== 'status') {
                    if (filter[k].length !== 0) {
                        noOfFilters++;

                        if (k === primaryMultiSelectLabel.replaceAll(" ", "").toLowerCase()) { setPriMSSelected(true); }

                        for (let obj of filter[k]) {
                            if (uData[k] === obj) { matches++; }
                        }
                    } else {
                        if (k === primaryMultiSelectLabel.replaceAll(" ", "").toLowerCase()) {
                            setPriMSSelected(false);
                            setPriFilteredData(null);
                        }
                    }
                } else {
                    if(filter[k][Object.keys(option)[0]].every( x => {return !x.toLowerCase().includes('all')})){
                        noOfFilters++;
                        if(filter[k][Object.keys(option)[0]].includes(uData[k])){
                            matches++;
                        }
                    }
                    // for(const x of filter[k][Object.keys(option)[0]]){
                    //     if (!x.toLowerCase().includes('all')) {
                    //         noOfFilters++;

                    //         if (x.includes(uData[k])) { matches++; }
                    //     }
                    // }
                    // if (!filter[k].toLowerCase().includes('all')) {
                    //     noOfFilters++;

                    //     if ("Validation Failed".includes(uData[k])) { matches++; }
                    // }
                }
            }
            return noOfFilters === matches;
        });

        setLocalData(filteredList);
        setFilteredData(filteredList);
    }

    // const renderMultiSelect = () => {
    //     return (
    //         <div className='flex space-x-4'>
    //             <PrimeMultiSelect handleMultiSelect={handleFilter} multiSelectOptions={primaryMultiSelectOptions} multiSelectLabel={primaryMultiSelectLabel} reset={resetMultiSelect} setReset={setResetMultiSelect} />
    //             {secondaryMultiSelectLabel ?
    //                 <PrimeMultiSelect handleMultiSelect={handleFilter} multiSelectOptions={getMultiSelectOptions(secondaryMultiSelectLabel)} multiSelectLabel={secondaryMultiSelectLabel} reset={resetMultiSelect} setReset={setResetMultiSelect} />
    //                 : ''}
    //         </div>
    //     );
    // }

    const renderHeader = () => {
        return (
            <>
                <div className="flex items-end justify-between mb-1 p-component">
                    <div>
                        {/* {headerMultiSelect ? renderMultiSelect() : renderGlobalFilter()} */}
                        <div className="space-x-4">
                            {renderGlobalFilter()}
                        </div>

                        {tabOptions ? (
                            <div className="flex mt-6 p-component">
                                <ul className="flex items-start justify-end 2xl:gap-11 2xl:text-base lg:gap-6 lg:text-sm">
                                    {Object.values(tabOptions)[0].map((tab, i) => {
                                        return (
                                            <li key={i} className="relative text-base group" onClick={selectedTab === i ? null : () => {
                                                // handleFilter(tab, Object.keys(tabOptions)[0].replaceAll(" ", "").toLowerCase());
                                                handleFilter(tab, Object.keys(tabOptions)[0].replaceAll(" ", "").toLowerCase());

                                                setSelectedTab(i);
                                                //for Tab 1 & 2
                                                // if (selectedTab === 0 || selectedTab === 1 ){
                                                // setFilteredData(null)}
                                                // else {
                                                // //
                                                // }
                                              
                                            }}>
                                                <p className={selectedTab === i ? selectedStyle : defaultStyle}>
                                                    {Object.keys(tab)[0]}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : ''}
                    </div>

                    <div className="space-x-4">
                        {/* {headerMultiSelect ? renderGlobalFilter() : ''} */}
                        <Button type="button" icon="pi pi-refresh" label={windowWidth < 1731 ? '' : "Clear all filters"} className="p-button-outlined" onClick={clearFilter} data-pr-tooltip={windowWidth < 1731 ? 'Clear all filters' : ""} />

                        <Button type="button" label={windowWidth < 1731 ? '' : "Export as CSV"} icon="pi pi-download" onClick={() => exportCSV(false)} className="p-button-outlined" data-pr-tooltip={windowWidth < 1731 ? 'Export as CSV' : ""} />

                        {showDelete ? <Button type="button" label={windowWidth < 1731 ? '' : "Delete"} icon="pi pi-trash" className="p-button-outlined" onClick={confirmDeleteSelected} disabled={!selected || !selected.length} data-pr-tooltip={windowWidth < 1731 ? 'Delete' : ""} /> : ''}

                        {secondaryButton ? <Button type="button" label={secondaryButton} icon='pi pi-arrow-right-arrow-left' className="p-button-outlined" onClick={secondaryOnClick} /> : ''}

                        {primaryButton ? <Button type="button" label={primaryButton} icon="pi pi-plus" className="bg-SCBlue" onClick={primaryOnClick !== undefined ? primaryOnClick : showPopup} /> : ''}

                        {/* <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="" data-pr-tooltip="Export as XLS" />

                    <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning" data-pr-tooltip="Export as PDF" /> */}
                    </div>
                </div>
            </>
        )
    }

    //for editing
    const onRowEditComplete = (e) => {
        let _data = [...localData], { newData, index } = e;
        let obj = columns.find((c) => c.field === dataKey);

        if (newData[dataKey] !== '') {
            if (_data.filter(e => e[dataKey] === newData[dataKey]).length > 0 && addNewRow && index === 0) {
                toast.current.show({ severity: 'warn', summary: 'Unable to Update Row', detail: `Duplicate ${obj.header} entered`, life: 3000 });

            } else {
                if ('staffbankid' in newData) {
                    if (addNewRow && index === 0) {
                        newData = employeeDetails(newData);

                        _data[0] = newData;

                        setAddNewRow(false);
                    } else {
                        let index = _data.findIndex((obj => obj[dataKey] === newData[dataKey]));

                        _data[index] = newData;
                    }
                }

                setData(_data);

                toast.current.show({ severity: 'info', summary: 'Row Updated', detail: `${e.data[dataKey] ? `${obj.header}: ${e.data[dataKey]}` : 'Added Sucessfully'}`, life: 3000 });
            }
        } else { toast.current.show({ severity: 'warn', summary: 'Unable to Update Row', detail: `Please enter ${obj.header}`, life: 3000 }); }
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

    const actionBodyTemplate = (rowData) => {
        let icons, status = rowData['status'];

        const editIcon = <i className="pb-1 border-b-2 cursor-pointer pi pi-pencil text-SCBlue border-SCBlue custom-target-icon" onClick={() => editFunction(rowData)} data-pr-tooltip={`Edit ${actionTooltip}`} data-pr-at="right+5 top" />
        const deleteIcon = <i className="cursor-pointer pi pi-trash text-SCInactive custom-target-icon" onClick={() => confirmDeleteSelected(rowData)} data-pr-tooltip={`Delete ${actionTooltip}`} data-pr-at="right+5 top" />
        const viewIcon = <i className="cursor-pointer pi pi-eye text-SCBlue custom-target-icon" onClick={() => approveFunction(rowData)} data-pr-tooltip={`View ${actionTooltip}`} data-pr-at="right+5 top" />
        const approveIcon = <i className="cursor-pointer pi pi-check text-SCActive custom-target-icon" data-pr-tooltip={`Approve ${actionTooltip}`} data-pr-at="right+5 top" />
        const rejectIcon = <i className="cursor-pointer pi pi-times text-SCInactive custom-target-icon" data-pr-tooltip={`Reject ${actionTooltip}`} data-pr-at="right+5 top" />

        if (columns.some(c => c.field === 'status')) {
            switch (status.toLowerCase()) {
                // case 'pending approval':
                // case 'pending for approval':
                case 'in progress':
                    if (sessionStorage.getItem('userProfile').toLowerCase() === 'maker') {
                        icons = (
                            <>
                                {editIcon}
                                {deleteIcon}
                            </>
                        )
                    } 
                    if (sessionStorage.getItem('userProfile').toLowerCase() === 'checker') {
                        icons = (
                            <>
                                {approveIcon}
                                {rejectIcon}
                                {viewIcon}
                            </>
                        )
                    } else {
                        icons = (
                            <>
                                {viewIcon}
                                {/* {approveIcon}
                                {rejectIcon} */}
                            </>
                        );
                    }
                    break;

                case 'approved':
                    icons = viewIcon;

                    break;

                case 'rejected':
                    icons = viewIcon;

                    break;

                case 'failed':
                    icons = viewIcon;

                    break;

                case 'validation pending':
                    icons = viewIcon;

                    break;

                case 'pending for approval':
                    icons = viewIcon;

                    break;

                case 'validation failed':
                    icons = viewIcon;

                    break;

                case 'submission failed':
                    icons = viewIcon;

                    break;

                default:
                    icons = editIcon;

                    break;
            }
        } else { icons = editIcon; }

        return (
            <div className='space-x-4'>
                <Tooltip target=".custom-target-icon" />

                {icons}
            </div>
        );
    }

    const formatColumn = (rowData) => {
        if (rowData['status'] !== undefined) {
            switch (rowData['status'].toLowerCase()) {
                case 'active':
                case 'approved':
                case 'validated':
                    return 'text-white bg-SCActive font-semibold';

                case 'inactive':
                case 'rejected':

                    return 'text-white bg-SCInactive font-semibold';

                case 'draft':
                    return 'text-white bg-SCPaletteDarkGray font-semibold';

                case 'pending for approval':
                    return 'text-white orange font-semibold';

                case 'validation pending':
                    return 'text-white orange font-semibold';

                case 'file submitted':
                    return 'text-white orange font-semibold';
                
                case 'failed':
                    return 'text-white bg-SCInactive font-semibold';

                case 'submission failed':
                    return 'text-white bg-SCInactivePurple font-semibold';

                case 'validation failed':
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

    const checkEditable = (options) => {
        if (editableObj !== undefined) {
            if (options.field in editableObj) {
                if (editableObj[options.field] === 'textfield') {
                    return addNewRow && options.rowIndex === 0 ? textEditor(options) : options.value;

                } else {
                    return dropdownEditor(options, options.field, editableObj[options.field]);
                }
            } else {
                return options.value;
            }
        }
        return options.value;
    }

    const onSubmit = (data, e) => {
        e.preventDefault();
        addRow(data);
        setVisible(false);
        reset();
    }

    const onHide = () => {
        setVisible(false);
        reset();
    }

    const getFormErrorMessage = (label) => {
        return errors[label] ? <small className="p-error">{errors[label].message}</small> : <small className="p-error">&nbsp;</small>;
    }
 
    return (
        <div>
            <Toast ref={toast} />

            <div className="card">
                <Tooltip target="button" position="bottom" />

                <Dialog header="User Management" visible={visible} onHide={onHide} position='center' className="w-1/3">
                    <form
                        id="add-user"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col mb-5">
                            <label
                                htmlFor="staffbankid"
                                className="block text-sm font-semibold text-gray-600"
                            >
                                Staff Bank ID
                            </label>
                            <input
                                id="staffbankid"
                                type="text"
                                name="staffbankid"
                                className="block w-full p-3 mt-2 text-sm border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-600"
                                {...register("staffbankid")}
                            />
                            <label
                                htmlFor="staffname"
                                className="block mt-4 text-sm font-semibold text-gray-600"
                            >
                                Staff Name
                            </label>
                            <input
                                id="staffname"
                                type="text"
                                name="staffname"
                                className="block w-full p-3 mt-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-600 focus:shadow-inner"
                                defaultValue="Auto-retrieved"
                                disabled
                                {...register("staffname")}
                            />
                            <label
                                htmlFor="bu6"
                                className="block mt-4 text-sm font-semibold text-gray-600"
                            >
                                Business Unit
                            </label>
                            <input
                                id="bu6"
                                type="text"
                                name="bu6"
                                className="block w-full p-3 mt-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-600"
                                defaultValue="Auto-retrieved"
                                disabled
                                {...register("bu6")}
                            />
                            <label
                                htmlFor="country"
                                className="block mt-4 text-sm font-semibold text-gray-600"
                            >
                                Country
                            </label>
                            <input
                                id="country"
                                type="text"
                                name="country"
                                className="block w-full p-3 mt-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-600"
                                defaultValue="Auto-retrieved"
                                disabled
                                {...register("country")}
                            />
                            <label
                                htmlFor="role"
                                className="block mt-4 text-sm font-semibold text-gray-600"
                            >
                                Role
                            </label>
                            <Controller
                                name="role"
                                control={control}
                                rules={{ required: 'Role is required' }}
                                render={({ field, fieldState }) =>
                                    <Dropdown value={field.value} optionLabel={'label'} label={'Role'} options={roleOptions} control={control} onChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.error })} />
                                }
                            />
                            {getFormErrorMessage('role')}
                            <label
                                htmlFor="status"
                                className="block text-sm font-semibold text-gray-600"
                            >
                                Status
                            </label>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: 'Status is required' }}
                                render={({ field, fieldState }) =>
                                    <Dropdown value={field.value} optionLabel={'label'} label={'Status'} options={statusOptions} control={control} onChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.error })} />
                                }
                            />
                            {getFormErrorMessage('status')}
                        </div>
                        <div className="flex flex-row gap-x-4">
                            <Button label="Submit" type="submit" icon="pi pi-check" />
                            <Button type="button" label="Cancel" icon='pi pi-times' className="p-button-outlined" onClick={onHide} />
                        </div>
                    </form>
                </Dialog>
                <ContextMenu model={menuModel} ref={cm} onHide={() => setSelected(null)} />
                <DataTable dataKey={dataKey} value={localData} responsiveLayout="scroll" paginator rows={10} paginatorTemplate={pTemplate} editMode='row' header={header ? renderHeader() : ''} filters={filters} onRowEditComplete={onRowEditComplete} ref={dt} metaKeySelection={false} selection={selected} onSelectionChange={e => setSelected(e.value)} autolayout='true' onRowSelect={onSelect ? (e => onSelect(e.data[columns[0]])) : onRowSelect} onRowUnselect={onRowUnselect} style={{ 'borderRadius': '10px' }} rowHover className={className} size={windowWidth < 1731 ? 'small' : ''}
                onContextMenu={(e) => cm.current.show(e.originalEvent)} contextMenuSelection={selected} onContextMenuSelectionChange={(e) => setSelected(e.value)} 
                // rowsPerPageOptions={[5, 10, 25]} 
                // globalFilterFields={columns} 
                // selectionMode={selectionMode} 
                >
                    {/* <Column selectionMode={selectionMode === 'single' ? '' : 'multiple'} headerStyle={{ width: '3rem' }} exportable={false}></Column> */}

                    {columns.map((c) => {
                        return <Column key={`${c.field}`} field={`${c.field}`} header={`${c.header}`} sortable={sortable} filter filterPlaceholder={`Search by ${c.header}`}
                            editor={(options) => checkEditable(options)}
                            bodyClassName={c.field === 'status' ? formatColumn : ''} style={c.field === 'status' ? { 'textAlign': 'center' } : ''} />
                    })}

                    {editable ? <Column rowEditor header="Edit" alignHeader='center' style={{ 'textAlign': 'center', 'minWidth': '110px' }} /> : null}

                    {customAction ? <Column header={customAction} alignHeader='center' body={actionBodyTemplate} style={{ 'textAlign': 'center' }} /> : null}
                </DataTable>
            </div>

            <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="mr-3 pi pi-exclamation-triangle" style={{ fontSize: '2rem' }} />

                    {data && <span>Are you sure you want to delete the selected row(s)?</span>}
                </div>
            </Dialog>
        </div >
    );
}
