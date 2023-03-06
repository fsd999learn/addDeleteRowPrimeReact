import { Checkbox } from 'primereact/checkbox';

const tableBody = (rowNum) => {

  let svcNum = rowNum - 1;

  return (

    <tr>

      <td className="border">

        <input

          id={`service-${rowNum}`}

          type="text"

          name="servicename"

          disabled

          defaultValue="Auto-retrieved"

          className="block p-3 text-sm text-gray-700 bg-gray-100 border border-gray-300 appearance-none w-full focus:outline-none focus:border-blue-600"

          {...register(`services[${svcNum}].servicename`)}

        />

      </td>

      <td className="border-b">

        <div className="flex justify-center text-center justify-content ml-6">

          <Controller

            name={`services[${svcNum}].maker`}

            control={control}

            rules={{ required: true }}

            render={({ field }) => (

              <>

                <div className="p-checkbox p-component">

                  <Checkbox

                    id={`maker-${rowNum}`}

                    inputId={`maker-${rowNum}`}

                    name={`maker-${svcNum}`}

                    value="maker"

                    onChange={(e) => field.onChange(e.checked)}

                    checked={field.value === 'maker'}

                  />

                  <label htmlFor={`maker-${rowNum}`}></label>

                </div>

              </>

            )}

          />

        </div>

      </td>

      <td className="border-b">

        <div className="flex justify-center ml-6">

          <Controller

            name={`services[${svcNum}].checker`}

            control={control}

            rules={{ required: true }}

            render={({ field }) => (

              <>

                <div className="p-checkbox p-component">

                  <Checkbox

                    id={`checker-${rowNum}`}

                    inputId={`checker-${rowNum}`}

                    name={`checker-${svcNum}`}

                    value="checker"

                    onChange={(e) => field.onChange(e.checked)}

                    checked={field.value === 'checker'}

                  />

                  <label htmlFor={`checker-${rowNum}`}></label>

                </div>

              </>

            )}

          />

        </div>

      </td>

    </tr>

  );

};

