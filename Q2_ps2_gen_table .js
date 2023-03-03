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

                <PrimeRadioButton

                  id={`maker-${rowNum}`}

                  label=""

                  field={field}

                  name={`maker-${svcNum}`}

                  value="maker"

                  tooltip="Select Status"

                />

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

                <PrimeRadioButton

                  id={`checker-${rowNum}`}

                  label=""

                  field={field}

                  name={`checker-${svcNum}`}

                  value="checker"

                  tooltip="Select Status"

                />

              </>

            )}

          />

        </div>

      </td>

    </tr>

  );

};

