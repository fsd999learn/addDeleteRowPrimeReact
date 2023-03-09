import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form"
import PrimeInputText from "../components/shared/PrimeInputText";
import PrimeDropdown from "../components/shared/PrimeDropdown";
import PrimeFileUpload from '../components/shared/PrimeFileUpload';
import SuccessPage from "../components/shared/SuccessPage";
import { useHistory } from "react-router-dom";

export default function LoadFile({ projectList, serviceList, setSelected, setServiceList, targetService, setTargetService }) {
    let history = useHistory();

    const { handleSubmit, formState: { errors }, control, reset, setValue, watch } = useForm();
    const [formStep, setFormStep] = useState(0);
    const [serviceOptions, setServiceOptions] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);

    const projOptions = projectList.sort((a, b) => a.value.localeCompare(b.value));

    const selectedProject = watch('projectname');
    const selectedService = watch('servicename');

    const targetServiceObj = JSON.parse(sessionStorage.getItem('targetService'));

    useEffect(() => {
        if (targetServiceObj) { setTargetService(targetServiceObj); }
    }, []);

    useEffect(() => {
        if (Object.keys(targetService).length !== 0) {
            setValue('projectname', targetService[0].projectname);
            setValue('servicename', targetService[0].servicename);
            setValue('filename', targetService[0].filename);
            setValue('serviceid', targetService[0].serviceid);
            setValue('sheetname', targetService[0].sheetname);
            setValue('frequency', targetService[0].frequency.toLowerCase());

            sessionStorage.setItem('targetService', JSON.stringify(targetService));
        } else {
            setValue('filename', 'Auto-retrieved');
            setValue('serviceid', 'Auto-retrieved');
            setValue('sheetname', 'Auto-retrieved');
            setValue('frequency', 'Auto-retrieved');
            setValue('requestid', 'Auto-retrieved');
        }
    }, [targetService]);

    useEffect(() => {
        let options = [];

        let filteredList = serviceList.filter((service) => { return service.projectname === selectedProject });

        filteredList.map((f) => { options.push({ 'value': f.servicename, 'label': f.servicename }); });

        setServiceOptions(options);

    }, [selectedProject]);

    useEffect(() => {
        let serviceObj = serviceList.find((service) => { return service.servicename === selectedService });

        if (serviceObj) {
            setValue('filename', serviceObj.filename);
            setValue('serviceid', serviceObj.serviceid);
            setValue('sheetname', serviceObj.sheetname);
            setValue('frequency', serviceObj.frequency);
            setValue('requestid', 'REQ-' + (serviceList.slice(-1)[0]['requestid'].replace(/\D/g, '') + 1));
        }
    }, [selectedService]);

    const onSubmit = (data, e) => {
        let objIndex = serviceList.findIndex((service => service.servicename === selectedService));

        // serviceList[objIndex].status = 'Pending approval';
        serviceList[objIndex].status = 'Pending for Approval';
        
        setServiceList(serviceList);
        setFormStep(1);

        sessionStorage.removeItem('targetService');

        setTargetService({});
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setFormStep(0)
        setSelected("1");

        history.push("/home");

        sessionStorage.removeItem('targetService');

        setTargetService({});
    };

    const resetValues = () => {
        reset();

        setUploadedFile(null);
    };

    return (
        <div className="grid mx-auto rounded-lg h-main min-w-max 2xl:w-11/12">
            {formStep === 0 ? (
                <div className="w-full h-full p-12 bg-white pt-9">
                    <h1 className="text-2xl font-semibold">Load File</h1>

                    <p className="mt-4 mb-6 text-SCGrey">User guidance text here to inform users what they can do at this screen</p>

                    <form id="demoform" className="mt-6" onSubmit={handleSubmit(onSubmit)}>
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
                                    name="servicename"
                                    control={control}
                                    rules={{ required: 'Service name is required' }}
                                    render={({ field, fieldState }) => (
                                        <PrimeDropdown field={field} value={field.value} optionLabel={'label'} options={serviceOptions} label={'Service Name'} control={control} onChange={field.onChange} tooltip='Please select your service' required={true} errors={errors} fieldState={fieldState} disabled={serviceOptions.length === 0} />
                                    )}
                                />
                            </span>
                        </div>

                        <div className="flex justify-between gap-8 mt-12">
                            <span className="w-1/2">
                                <Controller
                                    name="filename"
                                    control={control}
                                    defaultValue=''
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='File Name' disabled={true} />
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

                        <div className="flex justify-between gap-8 mt-12">
                            <span className="w-1/2">
                                <Controller
                                    name="sheetname"
                                    control={control}
                                    defaultValue=''
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='Sheet Name' disabled={true} />
                                    }
                                />
                            </span>
                            <span className="w-1/2">
                                <Controller
                                    name="frequency"
                                    control={control}
                                    defaultValue=''
                                    render={({ field, fieldState }) =>
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='Frequency' disabled={true} />
                                    }
                                />
                            </span>
                        </div>
                                 
                        <h1 className="text-2xl font-semibold mt-14">Upload File</h1>

                        <div className="mt-6 text-center">
                            <PrimeFileUpload setUploadedFile={setUploadedFile} />
                        </div >

                        <div className="flex justify-end mt-16">
                            <button
                                className="py-2 mr-4 text-blue-500 bg-white border border-blue-600 rounded-full px-7 hover:bg-blue-100 hover:text-blue-800"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                            <button className={`py-2 text-white bg-SCBlue rounded-full px-7 mr-4 ${uploadedFile ? 'hover:bg-blue-600 text-white' : 'text-SCPaletteDarkGray'}`} type="submit" disabled={uploadedFile ? false : true}>
                                Load File
                            </button>
                            <button className='py-2 text-white rounded-full bg-SCBlue px-7 text-SCPaletteDarkGray' disabled>
                                Submit
                            </button>
                        </div>
                    </form>
                </div >
            ) : <SuccessPage setFormStep={setFormStep} page="submitted" setSelected={setSelected} resetValues={resetValues} requestid={'REQ-' + (serviceList.slice(-1)[0]['requestid'].replace(/\D/g, '') + 1)} />
            }
        </div >
    );
}
