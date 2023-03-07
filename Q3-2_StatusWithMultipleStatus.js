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
    if (tabOptions) {
      let key = "status";

      let filteredList;

      if (selectedTab === 0) {
        // 'In Progress' tab selected

        filteredList = data.filter((d) => {
          return (
            d[key] === "Pending approval" ||
            d[key] === "Validation is in progress"
          );
        });
      } else if (selectedTab === tabOptions.indexOf("Failed")) {
        // 'Failed' tab selected

        filteredList = data.filter((d) => {
          return (
            d[key] === "Validation Failed" || d[key] === "Submission failed"
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

                case 'pending approval':
                    return 'text-white orange font-semibold';
                case 'validation in progress':
                    return 'text-white orange font-semibold';

                default:
                    break;
            }
        }
    }

const renderHeader = () => {
        return (
            <>
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
                                                    {tab}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : ''}
              <>
              
              
