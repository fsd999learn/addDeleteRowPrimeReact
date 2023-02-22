import PrimeDataTable from '../components/shared/PrimeDataTable';
import { useHistory } from "react-router-dom";

export default function UserManagement({ userList, setUserList, setSelected }) {
  let history = useHistory();

  const formatData = () => {
    const tableData = [];

    for (const user of userList) {
      tableData.push({
        "Staff Bank ID": user.staffbankid,
        "Staff Name": user.staffname,
        "Business Unit 6": user.businessunit6,
        "Country": user.country,
        "Role": user.role,
        "Status": user.status
      })
    }

    return tableData;
  }

  const emptyData = {
    "Staff Bank ID": '',
    "Staff Name": 'Auto-retrieved',
    "Business Unit 6": 'Auto-retrieved',
    "Country": 'Auto-retrieved',
    "Role": 'User',
    "Status": 'Inactive'
  }

  const rawEmptyData = {
    "staffbankid": '',
    "staffname": 'Auto-retrieved',
    "businessunit6": 'Auto-retrieved',
    "country": 'Auto-retrieved',
    "role": 'User',
    "status": 'Inactive'
  }

  const editableObj = {
    'Staff Bank ID': 'textfield',
    'Role': ['Admin', 'User'],
    'Status': ['Active', 'Inactive']
  }

  const mapUser = () => {
    setSelected("6");

    history.push("/mapping");
  }

  return (
    <div className="grid rounded-lg h-main place-items-center">
      <div className="w-full h-full p-12 pt-9 bg-white 2xl:w-11/12">
        <h1 className="text-2xl font-semibold">User Management</h1>

        <p className="mt-4 text-SCGrey mb-6">User guidance text here to inform users what they can do at this screen</p>

        <PrimeDataTable data={formatData()} rawData={userList} showDelete={true} selectionMode='multiple' header={true} primaryButton={'Add a user'} setRawData={setUserList} editable={true} emptyData={emptyData} rawEmptyData={rawEmptyData} editableObj={editableObj} selectionMode='checkbox' sortable={false} secondaryButton='Map user to services' secondaryOnClick={mapUser} />
      </div>
    </div>
  );
}
