import React, { useEffect, useState } from "react"
import { getLastDeploy, getServices } from "../../services/requestApiCloud"

function SectionRequest() {
  const [lastDeploy, setLastDeploy] = useState('')
  const [services, setServices] = useState(null)

  useEffect(() => {
    getLastDeploy(setLastDeploy)
    getServices(setServices)
  }, [])

  return (
    <>

    {lastDeploy && services ? (
        <>
          <div>
            {services.map((service) => (
              <div key={service.serviceId}>{service.serviceId}</div>
            ))}
          </div>
          <div>Last Deployment: {lastDeploy}</div>
        </>
      ) : 
      (
        <div>No data yet</div>
      )}

    
    </>
  )
}

export default SectionRequest
