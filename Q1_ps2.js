import React, { useState } from 'react';

function Dropdowns({ data }) {
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
        {data.map((item) => (
          <option key={item.projectname} value={item.projectname}>
            {item.projectname}
          </option>
        ))}
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

export default Dropdowns;
