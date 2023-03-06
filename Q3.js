For tabOptions when 'In Progress' is clicked, data will be filtered to return filteredList that match 'Pending approval' or 'Validation is in progress'. 

const tabOptions = {
        'status': [
            'In Progress',
            // 'Pending approval',
            'Approved',
            'Rejected'
        ]
    }
    
    useEffect(() => {
        if (filteredData) { setLocalData(filteredData); }

        else {
            if (tabOptions) {
                let key = Object.keys(tabOptions);
                let filteredList = data.filter((d) => { return d[key[0]] === tabOptions[key][0]; });

                setLocalData(filteredList);

            } else {
                setLocalData(data);
            }
        }
    }, [data]);

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
