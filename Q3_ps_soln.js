const [filteredData, setFilteredData] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    
    const tabOptions = {
      'status': [
          {
              "In Progress": ["Pending for Approval", "Validation Pending"]
          },
          {
              Failed: ["Validation Failed", "Submission Failed"]
          },
          {
              Approved: ["Approved"]
          },
          {
              Rejected: ["Rejected"]
          }
      ]
  }


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
                                          
                                          handleFilter(tab, Object.keys(tabOptions)[0].replaceAll(" ", "").toLowerCase());

                                          setSelectedTab(i);
                                         
                                        
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
            </div>
        </>
        )
        };
