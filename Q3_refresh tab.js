useEffect(() => {
  if (filteredData) {
    setLocalData(filteredData);
  } else {
    if (tabOptions) {
      let key = Object.keys(tabOptions);
      let filteredList;
      if (selectedTab === 0) {
        // 'In Progress' tab selected
        filteredList = data.filter((d) => {
          return (
            d[key[0]] === 'Pending approval' ||
            d[key[0]] === 'Validation is in progress'
          );
        });
      } else {
        // Other tab selected
        filteredList = data.filter((d) => {
          return d[key[0]] === tabOptions[key][selectedTab];
        });
      }
      setLocalData(filteredList);
    } else {
      setLocalData(data);
    }
  }
}, [data, filteredData, selectedTab]);
