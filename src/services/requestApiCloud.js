const API_URL = "https://api.liferay.cloud/projects/"

export async function getLastActivity(setLastActivity, token, projectId) {
  const dateCheckAndConvert = (activityDate, type) => {
    const currentTime = new Date()
    let date = new Date(activityDate)
    let recent = true
    if ((currentTime - date) / (60 * 60 * 1000) > 1) {
      recent = false
    }
    date = new Date(activityDate).toLocaleString()
    return { date: date, recent: recent, name: type }
  }
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const lastActivity = []
  try {
    const response = await fetch(`${API_URL}${projectId}/activities/builds-deployments/`, headers)
    if (!response.ok) {
      throw new Error("Failed to fetch activities from the API.")
    }
    const activities = await response.json()

    const lastDeploy = activities.find(
      (activity) => activity.type === "DEPLOY_STARTED"
    )
    if (lastDeploy) {
      lastActivity.push(dateCheckAndConvert(lastDeploy.createdAt, "Last Deployment"))
    }
    // lastRestart não funciona (mesmo usando ${API_URL}${projectId}/activities/) porque só puxa restart completo (e não de serviço)

    // const lastRestart = activities.find(
    //   (activity) => activity.type === "SERVICE_RESTARTED"
    // )
    // if (lastRestart) {
    //   lastActivity.push(
    //     dateCheckAndConvert(lastRestart.createdAt, "Last Restart")
    //   )
    // }

    setLastActivity(lastActivity)
  } catch (error) {
    console.error("Error occurred while fetching activities:", error)
    // Handle the error as needed, e.g., display an error message to the user.
  }
}

export async function getServices(setServices, token, projectId) {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await fetch(`${API_URL}${projectId}/services`, headers)
  const responseData = await response.json()

  const response2 = await fetch(`https://api.liferay.cloud/clusters`)
  const clusters = await response2.json()
  const projectCluster = clusters.find(
    (cluster) => cluster.name === responseData[0].cluster
  )
  responseData.forEach((elem) => {
    elem.gcpProject = projectCluster.cloudProjectId
    elem.kind = elem.kind.toLowerCase()
  })

  responseData.sort((a, b) => {
    const serviceIdA = a.serviceId.toLowerCase()
    const serviceIdB = b.serviceId.toLowerCase()
    if (serviceIdA < serviceIdB) {
      return -1
    }
    if (serviceIdA > serviceIdB) {
      return 1
    }
    return 0
  })
  setServices(responseData)
}
