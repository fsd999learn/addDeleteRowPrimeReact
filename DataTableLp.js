<DataTable
  columns={[
    {
      Header: 'Info',
      columns: [
        {
          Header: (
            <div style={{ width: '100%', textAlign: 'left' }}>Name</div>
          ),
          accessor: 'name',
          id: 'name',
          filterMethod: (filter, row) => {
            if (filter.value === '') {
              return true
            }
            return row[filter.id].includes(filter.value)
          },
        },
        {
          Header: (
            <div style={{ width: '100%', textAlign: 'left' }}>E-mail</div>
          ),
          accessor: 'email',
          id: 'email',
          Cell: row => <a href={'mailto='+row.value}>{row.value}</a>,
        },
      ],
    },
    {
      Header: 'Legal Drinking Age',
      columns: [
        {
          Header: () => (
            <div style={{ width: '100%', textAlign: 'left' }}>Age</div>
          ),
          accessor: 'age',
          id: 'age',
        },
        {
          Header: () => (
            <div style={{ width: '100%', textAlign: 'left' }}>
              Above Legal Drinking Age?
            </div>
          ),
          accessor: 'age',
          id: 'drink',
          Cell: ({ value }) => <span>{value >= 21 ? 'Yes' : 'No'}</span>,
          filterMethod: (filter, row) => {
            if (filter.value === 'all') {
              return true
            }
            if (filter.value === 'true') {
              return row[filter.id] >= 21
            }
            return row[filter.id] < 21
          },
          Filter: ({ filter, onChange }) => (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value="all">Show All</option>
              <option value="true">Old enough to drink</option>
              <option value="false">Too young to drink</option>
            </select>
          ),
        },
      ],
    },
  ]}
  data={testSimpleData}
  defaultPageSize={10}
  defaultSorted={[
    {
      id: 'accountBalance',
      desc: true,
    },
  ]}
  filterable
  highlight
  striped
/>
