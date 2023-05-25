import React, { useEffect, useState } from "react"
import { getLastDeploy, getServices } from "../../services/requestApiCloud"
import "../../styles.css"

function SectionRequest( {projectId, token} ) {
  const [lastDeploy, setLastDeploy] = useState([])
  const [services, setServices] = useState(null)

  useEffect(() => {
    getLastDeploy(setLastDeploy, token, projectId)
    getServices(setServices, token, projectId)
  }, [token, projectId])

  return (
    <div className="container">
      {lastDeploy && services ? (
        <div className="content">
          <h2>General Info</h2>
          <div className="general-info">
            <div className={`deployment ${lastDeploy[1] ? "true" : ""}`}>Last Deployment: {lastDeploy[0]}</div>
            <div>Cluster: {services[0].cluster}</div>
            <div>Namespace: {services[0].projectUid}</div>
            <div>ProjectId: {services[0].projectId}</div>
          </div>
          <h2>Services</h2>
          <div className="services">
            {services.map((service) => (
              <div key={service.serviceId} className="service">
                <div className='service-id'>{service.serviceId}</div>
                <div className="service-details">
                  <div>
                    <span>Can Autoscale:</span>{" "}
                    {service.canAutoscale.toString()}
                  </div>
                  <div>
                    <span>Current Pod:</span> {service.scale.toString()}
                  </div>
                  <div>
                    <span>Max Pod Autoscale:</span>{" "}
                    {service.autoscale.maxInstances.toString()}
                  </div>
                  <div
                    className={`publish-not-ready-addresses ${
                      service.serviceId === "liferay" ||
                      service.serviceId === "webserver"
                        ? service.publishNotReadyAddressesForCluster
                          ? "red"
                          : "green"
                        : ""
                    }`}
                  >
                    <span>Publish Not Ready Addresses For Cluster:</span>{" "}
                    {service.publishNotReadyAddressesForCluster.toString()}
                  </div>
                  <div className={`strategy ${service.strategy.type === 'RollingUpdate' ? "true" : ""}`}>
                    <span>Strategy:</span> {service.strategy.type}
                  </div>
                  <div className={`ready ${service.ready ? "true" : ""}`}>
                    <span>Ready:</span> {service.ready.toString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-data">No data yet</div>
      )}
    </div>
  )
}

//   return (
//     <>
//       {lastDeploy && services ? (
//         <>
//           <div>

//             General Info
//             <div>Last Deployment: {lastDeploy}</div>
//             <div>Cluster: {services[0].cluster}</div>
//             <div>Namespace: {services[0].projectUid}</div>
//             <div>ProjectId: {services[0].projectId}</div>
//           </div>
//           <div>
//             {" "}
//             Services
//             {services.map((service, index) => (
//               <>
//                 <div key={service.serviceId}>{service.serviceId}</div>
//                 <div>
//                   <div key={`canAutoScale` + index}>
//                     {`Can Autoscale: ` + service.canAutoscale.toString()}
//                   </div>
//                   <div key={`publishNotReadyAddressesForCluster` + index}>
//                     {`publishNotReadyAddressesForCluster: ` +
//                       service.publishNotReadyAddressesForCluster.toString()}
//                   </div>
//                   <div key={`strategy` + index}>
//                     {`Strategy: ` + service.strategy.type}
//                   </div>
//                   <div key={`ready` + index}>
//                     {`Ready: ` + service.ready.toString()}
//                   </div>
//                 </div>
//               </>
//             ))}
//           </div>
//         </>
//       ) : (
//         <div>No data yet</div>
//       )}
//     </>
//   )
// }

export default SectionRequest
