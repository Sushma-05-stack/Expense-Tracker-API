import React, { useState, useEffect } from 'react';
import ResourceForm from './ResourceForm';
// import './App.css'; // Add your styling here

function App() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setResources(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete resource');
      setResources(resources.filter(resource => resource._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Resource Dashboard</h1>
      
      <ResourceForm onResourceAdded={fetchResources} />

      {loading && <p>Loading resources...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Current Resources</h2>
        {resources.length === 0 && !loading ? (
          <p>No resources found. Create one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {resources.map((resource) => (
              <li key={resource._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>
                  {resource.name} - <span style={{ fontSize: '0.8rem', padding: '3px 8px', backgroundColor: '#eee', borderRadius: '12px' }}>{resource.status}</span>
                </h3>
                <p style={{ margin: '0 0 10px 0' }}>{resource.description}</p>
                <small style={{ color: '#666', display: 'block', marginBottom: '10px' }}>
                  External ID: {resource.externalId}
                </small>
                <button 
                  onClick={() => handleDelete(resource._id)}
                  style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
