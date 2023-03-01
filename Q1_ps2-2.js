import React from 'react';

import Dropdowns from './Dropdowns';

const data = [

  { projectname: 'Project A', servicename: 'Service 1' },

  { projectname: 'Project A', servicename: 'Service 2' },

  { projectname: 'Project B', servicename: 'Service 3' },

  { projectname: 'Project B', servicename: 'Service 4' },

];

function App() {

  return <Dropdowns data={data} />;

}

export default App;

