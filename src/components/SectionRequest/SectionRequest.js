import React, { useEffect, useState } from "react"
import { getLastActivity, getServices } from "../../services/requestApiCloud"
import "../../styles.css"

function SectionRequest({ projectId, token }) {
  const [lastActivity, setLastActivity] = useState([])
  const [services, setServices] = useState(null)

  useEffect(() => {
    getLastActivity(setLastActivity, token, projectId)
    getServices(setServices, token, projectId)
  }, [token, projectId])

  const openGcpClusterDetails = () => `https://console.cloud.google.com/kubernetes/clusters/details/${getStringUntilSecondDash(
    services[0].cluster
  )}/${services[0].cluster}/?project=${services[0].gcpProject}`


  //https://console.cloud.google.com/kubernetes/clusters/details/us-central1/us-central1-c1?project=liferaycloud

  const openAdminProject = () =>
    `https://admin.liferay.cloud/projects/${projectId}`

  const openAdminService = (projectId, serviceId) =>
    `https://admin.liferay.cloud/projects/${projectId}/services/${serviceId}`

  const openConsoleProject = () => `https://console.liferay.cloud/projects/${projectId}/services`

  const openConsoleActivities = () => `https://console.liferay.cloud/projects/${projectId}/activities`

  const getStringUntilSecondDash = (inputString) => {
    const firstDashIndex = inputString.indexOf("-")
    const secondDashIndex = inputString.indexOf("-", firstDashIndex + 1)

    if (firstDashIndex !== -1 && secondDashIndex !== -1) {
      return inputString.substring(0, secondDashIndex)
    }

    return inputString // Return the original string if the second dash is not found
  }

  const overviewFilter = (kind) =>
    kind === "deployment" ? "overview" : "details"

  const openGcpIngressTelemetry = () =>
    `https://console.cloud.google.com/kubernetes/ingress/${getStringUntilSecondDash(
      services[0].cluster
    )}/${services[0].cluster}/${
      services[0].projectUid
    }/ingress/metrics?project=${services[0].gcpProject}`
  const openGcpServiceTelemetry = (
    kind,
    cluster,
    namespace,
    serviceId,
    gcpProject
  ) =>
    `https://console.cloud.google.com/kubernetes/${kind}/${getStringUntilSecondDash(
      cluster
    )}/${cluster}/${namespace}/${serviceId}/${overviewFilter(
      kind
    )}?project=${gcpProject}`

  return (
    <div className="container">
      {lastActivity && services ? (
        <div className="content">
          <>
            <div className="external-links">
              <div>
                <a
                  href="https://webserver-brim-prd.lfr.cloud/web/brim-tool"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom-link"
                >
                  Brim Tool
                </a>
              </div>
              <div>
                <a
                  href="https://liferaycloud.app.opsgenie.com/alert/list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom-link"
                >
                  Opsgenie
                </a>
              </div>
              <div>
                <a
                  href="https://liferay.atlassian.net/wiki/spaces/DSOH/pages/1357284918/LXC+Self-Managed+Critical+Incident+Management+Playbook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom-link"
                >
                  IM Playbook
                </a>
              </div>
              <div>
                <a
                  href="https://issues.liferay.com/secure/RapidBoard.jspa?rapidView=6523&quickFilter=38530"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom-link"
                >
                  BRIM Jira Board
                </a>
              </div>
            </div>
            <h2>General Info</h2>
            <div className="general-info">
              <div className="info">
                <div
                  className={`deployment ${
                    lastActivity[0].recent ? "true" : ""
                  }`}
                ><a
                href={openConsoleActivities()}
                target="_blank"
                rel="noopener noreferrer"
                className="custom-link"
              >
                  {lastActivity[0].name}</a>: {lastActivity[0].date}
                </div>

                <div><a
                    href={openGcpClusterDetails()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >Cluster</a>: {services[0].cluster}</div>
                <div>Namespace: {services[0].projectUid}</div>
                <div>ProjectId: {services[0].projectId}</div>
              </div>
              <div className="links">
                <div>
                  <a
                    href={openAdminProject()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    Liferay Admin
                  </a>
                </div>
                <div>
                  <a
                    href={openGcpIngressTelemetry()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    GCP Ingress Telemetry
                  </a>
                </div>
                <div>
                  <a
                    href={openAdminProject()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    Liferay Admin
                  </a>
                </div>
                <div>
                  <a
                    href={openAdminProject()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    Liferay Admin
                  </a>
                </div>
              </div>
            </div>
            <h2>Services</h2>
            <div className="services">
              {services.map((service) => (
                <div key={service.serviceId} className="service">
                  <div className="service-id">{service.serviceId}</div>
                  <div className="service-details">
                    <div className="service-links">
                      <div>
                        <a
                          href={openGcpServiceTelemetry(
                            service.kind,
                            service.cluster,
                            service.projectUid,
                            service.serviceId,
                            service.gcpProject
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="custom-link"
                        >
                          GCP Telemetry
                        </a>
                      </div>
                      <div>GCP Logs</div>
                    </div>
                    <div>
                      <a
                        href={openAdminService(
                          service.projectId,
                          service.serviceId
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="custom-link"
                      >
                        <span>Can Autoscale</span>
                      </a>:{" "}
                      {service.canAutoscale.toString()}
                    </div>
                    <div>
                    <a
                        href={openConsoleProject(
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="custom-link"
                      ><span>Current Pod</span></a>: {service.scale.toString()}
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
                       <a
                        href={openAdminService(
                          service.projectId,
                          service.serviceId
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="custom-link"
                      ><span>Publish Not Ready Addresses For Cluster</span></a>:{" "}
                      {service.publishNotReadyAddressesForCluster.toString()}
                    </div>
                    <div
                      className={`strategy ${
                        service.strategy.type === "RollingUpdate" ? "true" : ""
                      }`}
                    >
                      <span>Strategy:</span> {service.strategy.type}
                    </div>
                    <div className={`ready ${service.ready ? "true" : ""}`}>
                    <a
                        href={openConsoleProject(
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="custom-link"
                      ><span>Ready</span></a>: {service.ready.toString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        </div>
      ) : (
        <div className="no-data">Loading...</div>
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
