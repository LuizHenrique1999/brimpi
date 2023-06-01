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

  const openGcpClusterDetails = () =>
    `https://console.cloud.google.com/kubernetes/clusters/details/${getStringUntilSecondDash(
      services[0].cluster
    )}/${services[0].cluster}/?project=${services[0].gcpProject}`
  
  const openGcpMySql = () => 
  `https://console.cloud.google.com/sql/instances/dxpcloud-${services[0].projectUid}-${findDatabaseId()}/overview?project=${services[0].gcpProject}`

  const openGcpQuerieMaliciusAccess = () =>
    `https://console.cloud.google.com/logs/query;query=resource.type%3D%22http_load_balancer%22%0Aresource.labels.forwarding_rule_name:%22${services[0].projectUid}%22%0Aseverity%3E%3DDEFAULT%0AhttpRequest.requestUrl%3D~%2528%22%2520OR%2520.*%5C-%5C-%22%20OR%20%22passwd%22%20OR%20%22%2F%5C.%5C.%22%20OR%20%22%255C%5C.%5C.%22%20OR%20%22%253Cphp%253E%22%20OR%20%22%5C.xml$%22%20OR%20%22%5C.yml$%22%20OR%20%22%255C%22%20OR%20%22%5C.json$%22%20OR%20%22filemanager%22%20OR%20%22%2Fbrowser%22%20OR%20%22%2Fadmin%22%20OR%20%22%2F%5C.%5Ba-z%5D%2B%22%2529%0A-httpRequest.requestUrl%3D~%22%5C-%5C-%5C-%22%0A-httpRequest.requestUrl%3D~%2528%22https:%2F%2F%5B1-9%5D%5B0-9%5D%22%20OR%20%22http:%2F%2F%5B1-9%5D%5B0-9%5D%22%2529%0A-httpRequest.status%3D%2528200%20OR%20304%2529;timeRange=PT1H;summaryFields=httpRequest%252FremoteIp:false:32:beginning;lfeCustomFields=httpRequest%252FremoteIp;cursorTimestamp=2023-06-01T02:56:20.407994Z?liferaycloud=&project=${services[0].gcpProject}`
  const openGcpQuerieNodeAutoScale = () =>
    `https://console.cloud.google.com/logs/query;query=resource.type%3D%22k8s_node%22%0AjsonPayload.message%3D%22marked%20the%20node%20as%20toBeDeleted%2Funschedulable%22%20OR%0AjsonPayload.MESSAGE%3D~%2528%22Eviction%20manager.*${services[0].projectUid}%22%20OR%20%22${services[0].projectUid}.*ContainerDied%22%20OR%20%22Killing%20container.*${services[0].projectUid}%22%20OR%20%22liveness.*unhealthy.*${services[0].projectUid}%22%2529;timeRange=PT1H;cursorTimestamp=2023-05-25T20:43:25Z?project=${services[0].gcpProject}`

  const openGcpQuerieCloudSql = () =>
    `https://console.cloud.google.com/logs/query;query=resource.type%3D%22cloudsql_database%22%0Aresource.labels.database_id:%22${services[0].projectUid}%22%0A-protoPayload.methodName:%22backup%22;timeRange=PT1H;summaryFields=resource%252Flabels%252Fpod_name:false:32:beginning;cursorTimestamp=2023-05-27T13:45:43.177620Z?${services[0].gcpProject}=&project=${services[0].gcpProject}`

  const openGcpQuerieProbesEvents = () =>
    `https://console.cloud.google.com/logs/query;query=resource.type%3D%22k8s_node%22%0AjsonPayload.MESSAGE%3D~%2528%22Eviction%20manager.*${services[0].projectUid}%22%20OR%20%22${services[0].projectUid}.*ContainerDied%22%20OR%20%22Killing%20container.*${services[0].projectUid}%22%20OR%20%22liveness.*unhealthy.*${services[0].projectUid}%22%2529%0A%0A--Uncomment%20the%20line%20below%20and%20add%20node_name%20to%20check%20for%20OOM%20or%20Node%20Deleted%0A--%2528resource.labels.node_name%3D%22node%22%20AND%20%2528jsonPayload.message%3D%22marked%20the%20node%20as%20toBeDeleted%2Funschedulable%22%20OR%20jsonPayload.MESSAGE%3D~%22%2528TaskOOM%7COOMKilling%2529%22%2529%2529;timeRange=PT1H;cursorTimestamp=2023-05-25T20:43:25Z?project=${services[0].gcpProject}`

  const openGcpQuerieService = (serviceId) => {
    if (serviceId === "liferay") {
      return `https://console.cloud.google.com/logs/query;query=resource.type%3D%22k8s_container%22%0Aresource.labels.namespace_name%3D%22${services[0].projectUid}%22%0Aresource.type%3D%22k8s_pod%22%20OR%20%2528resource.labels.container_name%3D%22liferay%22%2529%0A%0A--Hides%20%2528some%20of%2529%20%E2%80%9Cat%20org.apache%E2%80%A6.%E2%80%9D%20stack%20trace%20logs%0A-textPayload%3D~%22%5E%5Ct%7B1,4%7Dat%22;timeRange=PT1H;summaryFields=resource%252Flabels%252Fpod_name:false:32:beginning;cursorTimestamp=2023-05-28T12:04:46.246356612Z?project=${services[0].gcpProject}`
    } else if (serviceId === "webserver") {
      return `https://console.cloud.google.com/logs/query;query=resource.type%3D%22k8s_container%22%0Aresource.labels.namespace_name%3D%22${services[0].projectUid}%22%0Aresource.labels.container_name%3D%22webserver%22%0A%0A--Connection%20logs%0A-textPayload%3D~%2528%22haproxy%5C%5B%5Cd%7B1,2%7D%5C%5D:%20Connect%20from%20127%5C.0%5C.0%5C.1:%5Cd%7B5%7D%20to%20127%5C.0%5C.0%5C.1:%5Cd%7B2%7D%20%5C%2528proxy%2FHTTP%5C%2529$%22%20OR%20%22%5C%2B0%7B4%7D%5C%5D%20%5C%22%2528GET%7CPOST%7CPUT%7CHEAD%7COPTIONS%7CDELETE%7CPATCH%7CPROPFIND%2529%22%2529%0A%0A--Closed%20connections%0A-textPayload%3D~%22upstream%20prematurely%20closed%20connection%20while%20reading%20%2528upstream%7Cresponse%2529%22%0A-textPayload:%22upstream%20timed%20out%20%2528110:%20Connection%20timed%20out%2529%20while%20reading%20response%20header%20from%20upstream%22%0A%0A%0A--Buffer%20logs%0A-textPayload%3D~%22%2528an%20upstream%20response%7Ca%20client%20request%20body%2529%20is%20buffered%20to%20a%20temporary%20file%22%0A%0A%0A--Forbidden%20access%0A-textPayload:%22access%20forbidden%20by%20rule,%20client:%22;timeRange=PT1H;summaryFields=resource%252Flabels%252Fpod_name:false:32:beginning;cursorTimestamp=2023-05-28T12:33:07.564309378Z?project=${services[0].gcpProject}`
    } else {
      return `https://console.cloud.google.com/logs/query;query=resource.labels.namespace_name%3D%22lwnacqkjcnvdrnxgll%22%0Aresource.type%3D%22k8s_pod%22%20OR%20%2528resource.labels.container_name%3D%22${serviceId}%22%2529;timeRange=PT1H;summaryFields=resource%252Flabels%252Fpod_name:false:32:beginning;cursorTimestamp=2023-05-28T12:53:42.557820375Z?${services[0].gcpProject}`
    }
  }

  const openAdminProject = () =>
    `https://admin.liferay.cloud/projects/${projectId}`

  const openAdminService = (projectId, serviceId) =>
    `https://admin.liferay.cloud/projects/${projectId}/services/${serviceId}`

  const openConsoleProject = () =>
    `https://console.liferay.cloud/projects/${projectId}/services`

  const openConsoleActivities = () =>
    `https://console.liferay.cloud/projects/${projectId}/activities`

  const getStringUntilSecondDash = (inputString) => {
    const firstDashIndex = inputString.indexOf("-")
    const secondDashIndex = inputString.indexOf("-", firstDashIndex + 1)

    if (firstDashIndex !== -1 && secondDashIndex !== -1) {
      return inputString.substring(0, secondDashIndex)
    }

    return inputString // Return the original string if the second dash is not found
  }

  const findDatabaseId = () => {
    const databaseService = services.find(
      (item) => item.serviceId === "database"
    )
    return databaseService ? databaseService.id : null
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
      {lastActivity && lastActivity.length > 0 && services ? (
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
                >
                  <a
                    href={openConsoleActivities()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    {lastActivity[0].name}
                  </a>
                  : {lastActivity[0].date}
                </div>

                <div>
                  <a
                    href={openGcpClusterDetails()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    Cluster
                  </a>
                  : {services[0].cluster}
                </div>
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
                    href={openGcpQuerieMaliciusAccess()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    GCP Ingress Logs (with malicious scan query)
                  </a>
                </div>
                
              </div>
              <div className="links">
              <div>
                  <a
                    href={openGcpQuerieNodeAutoScale()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    GCP Cluster Logs (with Node AutoScaling Query)
                  </a>
                </div>
                <div>
                  <a
                    href={openGcpQuerieProbesEvents()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    GCP Probe and Events Logs (insert node_name)
                  </a>
                </div>
                <div>
                  <a
                    href={openGcpQuerieCloudSql()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    GCP CloudSql Logs
                  </a>
                </div>
                
                <div>
                  <a
                    href={openGcpMySql()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-link"
                  >
                    GCP MySql Telemetry
                  </a>
                </div>
              </div>
            </div>
            <h2>Services</h2>
            <div className="services">
              {services.map((service) => (
                
                <div key={service.serviceId} className="service">
                  <div className={`service-id ${service.ready ? "true" : ""}`}>{service.serviceId}</div>
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
                      <div>
                        <a
                          href={openGcpQuerieService(service.serviceId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="custom-link"
                        >
                          GCP Logs
                        </a>
                      </div>
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
                      </a>
                      : {service.canAutoscale.toString()}
                    </div>
                    <div>
                      <a
                        href={openConsoleProject()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="custom-link"
                      >
                        <span>Current Pod</span>
                      </a>
                      : {service.scale.toString()}
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
                      >
                        <span>Publish Not Ready Addresses For Cluster</span>
                      </a>
                      : {service.publishNotReadyAddressesForCluster.toString()}
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
                        href={openConsoleProject()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="custom-link"
                      >
                        <span>Ready</span>
                      </a>
                      : {service.ready.toString()}
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

export default SectionRequest
