import React, { useState } from "react"
import InitialPage from "./components/InitialPage"
import SectionRequest from "./components/SectionRequest/SectionRequest"

function App() {
  const [projectId, setProjectId] = useState("")
  const [token, setToken] = useState("")
  const [showPage, setShowPage] = useState(false)

  const handleFormSubmit = () => {
    setShowPage(true)
  }

  return (
    <div>
      {!showPage ? (
        <InitialPage onFormSubmit={handleFormSubmit} setProjectId={setProjectId} setToken={setToken} token={token} projectId={projectId}/>
      ) : (
        <div className="container">
          <SectionRequest token={token} projectId={projectId}/>
        </div>
      )}
    </div>
  )
}

export default App

// import React from 'react';
// import SectionRequest from './components/SectionRequest/SectionRequest';

// function App() {
// 	return (
// 		<>
// 		<SectionRequest/>
// 		</>
// 	);
// }

// export default App;
