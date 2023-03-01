import React, { useState } from 'react';

const data = [
  { projectname: 'Project A', servicename: 'Service 1' },
  { projectname: 'Project A', servicename: 'Service 2' },
  { projectname: 'Project B', servicename: 'Service 3' },
  { projectname: 'Project B', servicename: 'Service 4' },
];

function App() {
  const [project, setProject] = useState('');
  const [services, setServices] = useState([]);

  const handleProjectChange = (e) => {
    const selectedProject = e.target.value;
    setProject(selectedProject);

    const filteredServices = data.filter((item) => item.projectname === selectedProject);
    setServices(filteredServices);
  };

  return (
    <div>
      <label htmlFor="project">Select Project:</label>
      <select id="project" onChange={handleProjectChange} value={project}>
        <option value="">Select Project</option>
        <option value="Project A">Project A</option>
        <option value="Project B">Project B</option>
      </select>

      <label htmlFor="service">Select Service:</label>
      <select id="service" value={services}>
        {services.map((item) => (
          <option key={item.servicename} value={item.servicename}>
            {item.servicename}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App
