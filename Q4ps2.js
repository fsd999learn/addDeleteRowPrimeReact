const tabOptions = [

  'In Progress',

  'Approved',

  'Rejected',

  'Failed'

];

useEffect(() => {

  if (filteredData) {

    setLocalData(filteredData);

  } else {

    if (tabOptions) {

      let key = 'status';

      let filteredList;

      if (selectedTab === 0) {

        // 'In Progress' tab selected

        filteredList = data.filter((d) => {

          return (

            d[key] === 'Pending approval' ||

            d[key] === 'Validation is in progress'

          );

        });

      } else if (selectedTab === tabOptions.indexOf('Failed')) {

        // 'Failed' tab selected

        filteredList = data.filter((d) => {

          return (

            d[key] === 'Validation Failed' ||

            d[key] === 'Submission failed'

          );

        });

      } else {

        // Other tab selected

        filteredList = data.filter((d) => {

          return d[key] === tabOptions[selectedTab];

        });

      }

      setLocalData(filteredList);

    } else {

      setLocalData(data);

    }

  }

}, [data, filteredData, selectedTab, tabOptions]);

