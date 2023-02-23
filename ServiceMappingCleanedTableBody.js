// import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import SuccessPage from "../components/shared/SuccessPage";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import PrimeDropdown from '../components/shared/PrimeDropdown';
import PrimeInputText from '../components/shared/PrimeInputText';

export default function ServiceMapping({ projectList, serviceList, setSelected }) {
  let history = useHistory();

  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const [formStep, setFormStep] = useState(0);
  const [checked, setChecked] = useState(true);
  const [serviceOptions, setServiceOptions] = useState([]);

  const projOptions = projectList.sort((a, b) =>
    a.value.localeCompare(b.value)
  );

  const handleChangeChecked = () => {
    setChecked(!checked);
  };

  const onSubmit = (data, e) => {
    console.log(data);
    setFormStep(1);
  };

  const customMainStyle = {
    control: (provided) => ({
      ...provided,
      height: 45,
      minHeight: 45,
      marginTop: 8
    }),
  };

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

   //delete row FOR CREATE SERVICE
//    const deleteRow = (rowNum) => {
//     let copy = [...numRows]
//     copy = copy.filter((item, index) => rowNum != index)
//     setNumRows(copy)
//     console.log('rowNum:', rowNum);

    
// }    
//delete row
// const deleteRow = (schemaNum) => {
//     let copy = [...numRows]
//     copy = copy.filter((item, i) => schemaNum != i)
//     setNumRows(copy)
// }

 //delete row WIP //need add new row also
 const deleteCurrentRow = () => {

}    


//define to delete current row 
  // let copy = [...numRows]
  // copy = copy.filter((item, index) => rowNum != index)
  // setNumRows(copy)
  // console.log('rowNum:', rowNum);

  //below not working
  // console.log('index:', i

//
//delete row
// const deleteRow = (schemaNum) => {
//     let copy = [...numRows]
//     copy = copy.filter((item, i) => schemaNum != i)
//     setNumRows(copy)
// }


  const tableBody = (rowNum) => {
    let svcNum = rowNum - 1;

    return (
      <tr>
      
        <td className="border">
          <Controller
            id={`service.${svcNum}.servicename`}
            name={`service.${svcNum}.servicename`}
            className="block p-2 px-3 text-sm text-gray-700 w-full bg-white border appearance-none focus:outline-none focus:border-blue-600"
            control={control}
            placeholder="Please choose your service"
            defaultValue=""
            render={( {field} ) => (
              <Select
                options={serviceName}
                styles={customTableStyle}
                onChange={(e) => { if (e) { field.onChange(e.value); } }}
              />
            )}
          ></Controller>
          
        </td>

        <td className="border">
          <Controller
            className="block p-2 px-3 text-sm text-gray-700 w-full bg-white border appearance-none focus:outline-none focus:border-blue-600"
            render={({ field }) => (
              <Select options={checkerMaker} styles={customTableStyle} onChange={(e) => { if (e) { field.onChange(e.value); } }}/>
            )}
            control={control}
            name={`service.${svcNum}.userrole`}
            // defaultValue={null}
          ></Controller>
        </td>

        <td className="border">
            <button className="flex items-center mx-auto justify-center col-span-1 gap-2" onClick={(e) => deleteCurrentRow(e)}>
                <MinusCircleIcon alt="remove current row" className="h-6 text-red-500" />
            </button>
        </td>
       
      </tr>
    );
  };

  const checkerMaker = [
    { value: "checker", label: "Checker" },
    { value: "maker", label: "Maker" },
  ];

  const serviceName = [
    { value: "service-1", label: "Service 1" },
    { value: "service-2", label: "Service 2" },
    { value: "service-3", label: "Service 3" },
    { value: "service-4", label: "Service 4" },
    { value: "service-5", label: "Service 5" },
    { value: "service-6", label: "Service 6" },
    { value: "service-7", label: "Service 7" },
  ];

  const handleChangeProj = (e) => {
    setServiceOptions([]);
    serviceList.map((service) => {
      if (service.projectname.toLowerCase().replace(/\s/g, "-") === e) {
        setServiceOptions((current) => [
          ...current,
          { value: service.servicename, label: service.servicename },
        ]);
        console.log(
          "setServiceOptions, service.projectname",
          setServiceOptions,
          service.servicename
        );
      }
      console.log(
        "setServiceOptions, service.projectname",
        setServiceOptions,
        service.servicename
      );
    });
  };

  return (
    <div className="grid h-main w-11/12 max-w-3xl mx-auto lg:max-w-8xl">
      {formStep === 0 ? (
        <div className="w-full p-12 pt-9">
          <h1 className="text-2xl font-semibold text-SCGrey">Service Mapping</h1>

          <p className="mt-4 text-SCGrey">User guidance text here to inform users what they can do at this screen</p>

          <form
            id="servicemappingform"
            className="mt-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            
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
                                    name="staffbankid"
                                    type="number"
                                    control={control}
                                    rules={{ required: 'Bank ID is required' }}
                                    render={({ field, fieldState }) => (
                                        <PrimeInputText field={field} fieldState={fieldState} errors={errors} label='Staff Bank ID' placeholder='Please enter your Staff Bank ID' required={true} />
                                    )}
                                />
                            </span>
                        </div>
            

            <div className="flex justify-between gap-8 mt-6">
              <span className="w-1/2">
                <label
                  htmlFor="department"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  disabled
                  defaultValue="Auto-retrieved"
                  className="block p-3 mt-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md appearance-none w-full focus:outline-none focus:border-blue-600"
                  {...register('country')}
                />

              </span>

              <span className="w-1/2">
                <label
                  htmlFor="product"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Business Unit 6 (BU6)
                </label>
                <input
                  id="bu6"
                  type="text"
                  name="bu6"
                  disabled
                  defaultValue="Auto-retrieved"
                  className="block p-3 mt-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md appearance-none w-full focus:outline-none focus:border-blue-600"
                  {...register('bu6')}
                />
              </span>
            </div>

            
              <div>
                <>
                  <div className="flex flex-col my-10 gap-4">
                    <table className="border border-collapse table-fixed">
                      <thead className="bg-SCBlue">
                        <tr>
                          {/* <th className="border p-3 text-left text-white uppercase text-sm font-normal tracking-wider w-2/5">
                            Project Name
                          </th> */}
                          <th className="border p-3 text-left text-white text-sm font-normal tracking-wider w-4/6">
                            Service Name
                          </th>
                          <th
                            // colspan="2"
                            className="border p-3 text-white text-sm font-normal tracking-wider text-center w-2/6"
                          >
                            User Role
                          </th>
                          <th
                            // colspan="2"
                            className="border p-3 text-white text-sm font-normal tracking-wider text-center w-1/6"
                          >
                            Edit
                          </th>
                        </tr>
                       
                      </thead>
                      <tbody>
                        {tableBody(1)}
                        {/*{tableBody(2)}
                        {tableBody(3)}
                        {tableBody(4)}
                        {tableBody(5)}
                        {tableBody(6)}
                        {tableBody(7)} */}
                      </tbody>
                    </table>
                    <div className="flex flex-row gap-8">
                                {/* <button className="flex items-center justify-center col-span-1 gap-2" onClick={(e) => handleClickAdd(e)}> */}
                                <button className="flex items-center justify-center col-span-1 gap-2 onClick={(e) => event.preventDefault()">
                                    <PlusCircleIcon alt="add new row" className="h-6 text-green-500" />
                                    <span>Add new row</span>
                                </button>
                            </div>
                  </div>
                </>
              </div>
            {/* )} */}

            <div className="flex justify-end">
              <button className="py-2 mt-6 mr-4 text-blue-500 bg-white border border-blue-600 rounded-full px-7 hover:bg-blue-100 hover:text-blue-800"
                onClick={(e) => {
                  e.preventDefault();

                  history.push("/service");

                  setSelected("2");
                }}
              >
                Cancel
              </button>

              <button
                className="py-2 mt-6 text-white bg-blue-500 rounded-full px-7 hover:bg-blue-600"
                type="submit"
              >
                Map Services
              </button>
            </div>
          </form>
        </div>
      ) : <SuccessPage setFormStep={setFormStep} page="service-mapping"/>
      }
    </div>
  );
}
