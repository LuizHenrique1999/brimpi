import React from 'react';
import "./InitialPage.css"

function InitialPage({ onFormSubmit, setProjectId, setToken, token, projectId }) {


  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(projectId, token);
  };

  return (
    <div className="initial-page">
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project ID:</span>
          <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
        </label>
        <label>
        <span>Token:</span>
          <input type="text" value={token} onChange={(e) => setToken(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default InitialPage;