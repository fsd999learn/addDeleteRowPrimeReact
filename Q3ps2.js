const [filteredData, setFilteredData] = useState(null);
const [selectedTab, setSelectedTab] = useState(0);
const tabOptions = {
  'status': [
    'In Progress',
    'Failed',
    'Approved',
    'Rejected'
  ]
}

useEffect(() => {
  if (filteredData) {
    setLocalData(filteredData);
  } else {
    let filteredList;

    if (selectedTab === 0) {
      // 'In Progress' tab selected
      filteredList = data.filter((d) => {
        return (
          d.status === "Pending approval" ||
          d.status === "Validation is in progress"
        );
      });
    } else if (selectedTab === 1) {
      // 'Failed' tab selected
      filteredList = data.filter((d) => {
        return (
          d.status === "Validation Failed" || 
          d.status === "Submission failed"
        );
      });
    } else if (selectedTab === 2) {
      // 'Approved' tab selected
      filteredList = data.filter((d) => {
        return d.status === "Approved";
      });
    } else if (selectedTab === 3) {
      // 'Rejected' tab selected
      filteredList = data.filter((d) => {
        return d.status === "Rejected";
      });
    } else {
      // Other tab selected
      filteredList = data.filter((d) => {
        return d.status === tabOptions.status[selectedTab];
      });
    }

    setLocalData(filteredList);
  }
}, [data, filteredData, selectedTab]);

const handleFilter = (option, field) => {
  let filteredList = [];

  const filter = { ...selectedFilter };
  filter[field] = option;
  setSelectedFilter(filter);

  filteredList = data.filter(uData => {
    let matches = 0, noOfFilters = 0;

    for (const [k, value] of Object.entries(filter)) {
      if (typeof value === 'object') {
        if (filter[k].length !== 0) {
          noOfFilters++;

          if (k === primaryMultiSelectLabel.replaceAll(" ", "").toLowerCase()) {
            setPriMSSelected(true);
          }

          for (let obj of filter[k]) {
            if (uData[k] === obj) {
              matches++;
            }
          }
        } else {
          if (k === primaryMultiSelectLabel.replaceAll(" ", "").toLowerCase()) {
            setPriMSSelected(false);
            setPriFilteredData(null);
          }
        }
      } else {
        if (!filter[k].toLowerCase().includes('all')) {
          noOfFilters++;

          if (value.includes(uData[k])) {
            matches++;
          }
        }
      }
    }

    return noOfFilters === matches;
  });

  setLocalData(filteredList);
  setFilteredData(filteredList);
};

const renderHeader = () => {
  return (
    <div>
      {tabOptions ? (
        <div className="flex mt-6 p-component">
          <ul className="flex items-start justify-end 2xl:gap-11 2xl:text-base lg:gap-6 lg:text-sm">
            {Object.values(tabOptions)[0].map((tab, i) => {
              return (
                <li key={i} className="relative text-base group" onClick={() => {
                  setSelectedTab(i);
                  handleFilter(tab, Object.keys(tabOptions)[0].replaceAll(" ", "").toLowerCase());
                }}>
                  <p className={selectedTab === i ? selectedStyle : defaultStyle}>
                    {tab}
                  </p>
                </
