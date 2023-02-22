import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import PrimeDropdown from '../components/shared/PrimeDropdown';
import PrimeRadioButton from '../components/shared/PrimeRadioButton';
import PrimeInputText from '../components/shared/PrimeInputText';

export default function CreateService({ projectList, serviceList, targetService, setSelected, setTargetService }) {
    let history = useHistory();

    if (sessionStorage.getItem("loggedIn") === "false") {
        history.push("/");
    }

    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();

    useEffect(() => {
        setValue('serviceid', serviceList.length + 1);
        setValue('status', 'active');
        setValue('fileincpath', '.../...');
        setValue('fileloadpath', '.../...');
        setValue('filearchpath', '.../...');
    });

    const [formStep, setFormStep] = useState(0);
    const [numRows, setNumRows] = useState([...Array(1)]);

    const projOptions = projectList.sort((a, b) => a.value.localeCompare(b.value));

    const selectDefaultValue = (field) => {
        if (field === "projectname") {
            const targetProjName = targetService.projectname;
            let posInArray = 0;
            for (let i = 0; i < projOptions.length; i++) {
                if (projOptions[i].label === targetProjName) {
                    posInArray = i;
                }
            }
            return projOptions[posInArray];
        } else if (field === "frequency") {
            const targetFreq = targetService.frequency;
            let posInArray = 0;
            for (let i = 0; i < freqOptions.length; i++) {
                if (freqOptions[i].label === targetFreq) {
                    posInArray = i;
                }
            }
            return freqOptions[posInArray];
        }
        return null;
    };

    // const customMainStyle = {
    //     control: (provided) => ({
    //         ...provided,
    //         height: 45,
    //         minHeight: 45,
    //         marginTop: 8
    //     }),
    // };

    const customTableStyle = {
        control: (provided) => ({
            ...provided,
            boxShadow: "none",
            borderRadius: 0,
            borderColor: "gray-100",
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: 0,
            borderColor: "gray-100",
        }),
    };

    const freqOptions = [
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "annually", label: "Annually" },
        { value: "biannually", label: "Biannually" },
    ];

    const dataOptions = [
        { value: "string", label: "String" },
        { value: "number", label: "Number" },
        { value: "date", label: "Date" },
    ];

    const yesNoOptions = [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
    ];

    const onSubmit = (data, e) => {
        console.log(data);
        setFormStep(1);
    };

    const handleClickBack = () => {
        setTargetService({});
        history.push("/service");
        setSelected("2");
    };

    const handleClickAdd = (e) => {
        e.preventDefault();
        setNumRows((oldArray) => [...oldArray, ...Array(1)]);
    }

    const handleClickRemove = (e) => {
        e.preventDefault();
        let oldArray = [...numRows]; // make a separate copy of the old array
        oldArray.pop();
        setNumRows(oldArray);
    }



    //delete row
    // const deleteRow = (rowNum) => {
    const deleteSpecificRow = (r) => {
        // let copy = [...numRows]
        // copy = copy.filter((item, index) => rowNum != index)
        // setNumRows(copy)
        // console.log('rowNum:', rowNum);
        //below not working
        // console.log('index:', index)
    }    //delete row
    // const deleteRow = (schemaNum) => {
    //     let copy = [...numRows]
    //     copy = copy.filter((item, i) => schemaNum != i)
    //     setNumRows(copy)
    // }




    const tableBody = (rowNum) => {
        let schemaNum = rowNum - 1;

        return (
            <tr key={rowNum}>
                <td>
                    <input
                        id={`${rowNum}-${rowNum}`}
                        type="text"
                        name={`${rowNum}-${rowNum}`}
                        className="block w-full p-2 px-3 text-sm text-gray-700 bg-gray-100 border appearance-none focus:outline-none focus:border-blue-600"
                        defaultValue={rowNum}
                        disabled
                    />
                </td>
                <td>
                    <input
                        id={`schema.${schemaNum}.fieldname`}
                        type="text"
                        name={`schema.${schemaNum}.fieldname`}
                        className="block w-full p-2 px-3 text-sm text-gray-700 bg-white border appearance-none focus:outline-none focus:border-blue-600"
                        {...register(`schema.${schemaNum}.fieldname`)}
                    />
                </td>
                <td>
                    <Controller
                        className="block text-sm cursor-pointer basic-single"
                        render={({ field }) => (
                            <Select options={dataOptions} styles={customTableStyle} onChange={(e) => { if (e) { field.onChange(e.value); } }} />
                        )}
                        control={control}
                        name={`schema.${schemaNum}.datatype`}
                    />
                </td>
                <td>
                    <input
                        id={`schema.${schemaNum}.format`}
                        type="text"
                        name={`schema.${schemaNum}.format`}
                        className="block w-full p-2 px-3 text-sm text-gray-700 bg-white border appearance-none focus:outline-none focus:border-blue-600"
                        {...register(`schema.${schemaNum}.format`)}
                    />
                </td>
                <td>
                    <Controller
                        className="block text-sm cursor-pointer basic-single"
                        render={({ field }) => (
                            <Select options={yesNoOptions} styles={customTableStyle} onChange={(e) => { if (e) { field.onChange(e.value); } }} />
                        )}
                        control={control}
                        name={`schema.${schemaNum}.cde`}
                    />
                </td>
                <td>
                    <Controller
                        className="block text-sm cursor-pointer basic-single"
                        render={({ field }) => (
                            <Select options={yesNoOptions} styles={customTableStyle} onChange={(e) => { if (e) { field.onChange(e.value); } }} />
                        )}
                        control={control}
                        name={`schema.${schemaNum}.pii`}
                    />
                </td>
                <td>
                    <Controller
                        className="block text-sm cursor-pointer basic-single"
                        render={({ field }) => (
                            <Select options={yesNoOptions} styles={customTableStyle} onChange={(e) => { if (e) { field.onChange(e.value); } }} />
                        )}
                        control={control}
                        name={`schema.${schemaNum}.dqreq`}
                    />
                </td>
                <td>
                    <button className="flex items-center mx-auto justify-center col-span-1 gap-2" onClick={(e) => deleteSpecificRow(e)}>
                            <MinusCircleIcon alt="remove current row" className="h-6 text-red-500" />
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div className="grid rounded-lg h-main min-w-max 2xl:w-11/12 mx-auto">
            {formStep === 0 ? (
                <div className="w-full p-12 pt-9 bg-white">
                    <h1 className="text-2xl font-semibold text-SCGrey">Create Service</h1>

                    <p className="mt-4 text-SCGrey">User guidance text here to inform users what they can do at this screen</p>

                    <form id="servicecreationform" className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <PrimeRadioButton id="active" label="Active" field={field} tooltip='Select Status' />

                                        <PrimeRadioButton id="inactive" label="Inactive" field={field} tooltip='Select Status' />
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex justify-between gap-8 mt-12">
                            <span className="w-1/2">
                                <Controller
                                    name="projectname"
                                    control={control}
                                    rules={{ required: 'Project is required' }}
                                    render={({ field, fieldState }) =>
                                        <PrimeDropdown field={field} value={field.value} optionLabel={'label'} options={projOptions} label={'Project Name'} control={control} onChange={field.onChange} tooltip='Please select your project' required={true} errors={errors} fieldState={fieldState} />
                                    }
                                />
                            </span>

                            <span className="w-1/2">
                                <Controller
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='Service ID' disabled={true} />
                                    }
                                    control={control}
                                    name="serviceid"
                                    defaultValue=''
                                />
                            </span>
                        </div>

                        <div className="flex justify-between gap-8 mt-10">
                            <span className="w-1/2">
                                <Controller
                                    name="servicename"
                                    control={control}
                                    rules={{ required: 'Service name is required' }}
                                    render={({ field, fieldState }) => (
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='Service Name' placeholder='Please enter your service name' required={true} helperText='Guidance text on any service naming conventions to use' />
                                    )}
                                />
                            </span>
                            <span className="w-1/2">
                                <Controller
                                    name="CDACref"
                                    control={control}
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='COO Data Lake Design and Architecture Council (CDAC) Reference Number' placeholder='Enter your CDAC Reference Number' helperText='Guidance text (1-line) on what CDAC is/how to get/relevant link' />
                                    }
                                />
                            </span>
                        </div>

                        <div className="flex justify-between gap-8 mt-12">
                            <span className="w-1/2">
                                <Controller
                                    name="filename"
                                    control={control}
                                    rules={{ required: 'File name is required' }}
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='File Name' placeholder='Please enter your file name' required={true} helperText='Guidance text on any file naming conventions to use' />
                                    }
                                />
                            </span>

                            <span className="w-1/2">
                                <Controller
                                    name="sheetname"
                                    control={control}
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='Sheet Name' placeholder='Please enter your sheet name' helperText='Guidance text on any sheet naming conventions to use' />
                                    }
                                />
                            </span>
                        </div>

                        <div className="flex justify-between gap-8 mt-12">
                            <span className="w-1/2">
                                <Controller
                                    name="fileincpath"
                                    control={control}
                                    defaultValue=''
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='File Incoming Path' disabled={true} />
                                    }
                                />
                            </span>

                            <span className="w-1/2">
                                <Controller
                                    name="frequency"
                                    control={control}
                                    render={({ field, fieldState }) =>
                                        <PrimeDropdown field={field} fieldState={fieldState} value={field.value} optionLabel={'label'} options={freqOptions} label={'Frequency'} control={control} onChange={field.onChange} tooltip='Please select an option' errors={errors} helperText='Guidance text on what this frequency refers to' />
                                    }
                                />
                            </span>
                        </div>

                        <div className="flex mt-12">
                            <span className="w-full">
                                <Controller
                                    name="fileloadpath"
                                    control={control}
                                    defaultValue=''
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='File Loader Path' disabled={true} />
                                    }
                                />
                            </span>
                        </div>

                        <div className="flex mt-12">
                            <span className="w-full">
                                <Controller
                                    name="filearchpath"
                                    control={control}
                                    defaultValue=''
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='File Archival Path' disabled={true} />
                                    }
                                />
                            </span>
                        </div>

                        {/* Form table */}
                        <div className="flex flex-col gap-4 my-10">
                            <h2 className="font-semibold text-md">Schema Definition</h2>
                            <table className="border border-collapse table-fixed">
                                <thead className="bg-SCBlue">
                                    <tr>
                                        <th className="w-1/12 p-3 text-sm font-normal tracking-wider text-left text-white uppercase border">Row No.</th>
                                        <th className="w-3/12 p-3 text-sm font-normal tracking-wider text-left text-white uppercase border">Field Name</th>
                                        <th className="w-3/12 p-3 text-sm font-normal tracking-wider text-left text-white uppercase border">Datatype</th>
                                        <th className="w-2/12 p-3 text-sm font-normal tracking-wider text-left text-white uppercase border">Format</th>
                                        <th className="w-1/12 p-3 text-sm font-normal tracking-wider text-left text-white uppercase border">CDE</th>
                                        <th className="w-1/12 p-3 text-sm font-normal tracking-wider text-left text-white uppercase border">PII</th>
                                        <th className="w-1/12 p-3 text-sm font-normal tracking-wider text-left text-white uppercase border">DQ Required</th>
                                        <th className="w-1/12 p-3 text-sm font-normal tracking-wider text-left text-white uppercase border">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {numRows.map((data, i) => {
                                        return tableBody(i + 1);
                                    })}
                                </tbody>
                            </table>
                            <div className="flex flex-row gap-8">
                                <button className="flex items-center justify-center col-span-1 gap-2" onClick={(e) => handleClickAdd(e)}>
                                    <PlusCircleIcon alt="add new row" className="h-6 text-green-500" />
                                    <span>Add new row</span>
                                </button>
                                <button className="flex items-center justify-center col-span-1 gap-2" onClick={(e) => handleClickRemove(e)}>
                                    <MinusCircleIcon alt="remove row" className="h-6 text-red-500" />
                                    <span>Remove last row</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                className="py-2 mt-6 mr-4 text-blue-500 bg-white border border-blue-600 rounded-full px-7 hover:bg-blue-100 hover:text-blue-800"
                                onClick={() => {
                                    setFormStep(0);
                                    handleClickBack();
                                }}
                            >
                                Cancel
                            </button>

                            <button className="py-2 mt-6 text-white bg-blue-500 rounded-full px-7 hover:bg-blue-600" type="submit">
                                Create Service
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full p-12 bg-white border rounded-lg shadow-2xl">
                    <img className="mx-auto mt-10 submission-complete-img" alt="submission complete" />
                    <p className="mt-12 mb-1 text-lg font-semibold text-center text-SCBlackGStart">Done! Your form has been submitted.</p>
                    <button
                        className="py-2 text-blue-500 bg-white border border-blue-600 rounded-full w-28 px-7 hover:bg-blue-100 hover:text-blue-800"
                        onClick={() => {
                            setFormStep(0);
                            setTargetService({});
                            history.push("/home");
                            setSelected("1");
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}
