  

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
