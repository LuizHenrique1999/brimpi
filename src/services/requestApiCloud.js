


const API_URL = "https://api.liferay.cloud/projects/"
// const API_CLUSTER_URL = "https://api.liferay.cloud/clusters/"

// const Token =
//   "eyJraWQiOiI1OFY5Z2pXRkU0d3lTQWh6OUxONmw5MzAzUTV3YWRYQW1peVRyOTdBOU9ZIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkNiR2ZuNkg3b1k3b3dibkp0UnBRdzctZ3ZXRDdFQ243WHZSY2VVX09GdVEub2FyMzFkOXpyeldWdEdLa2IzNTciLCJpc3MiOiJodHRwczovL2F1dGgubGlmZXJheS5jbG91ZC9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2ODQ5NTA2NDMsImV4cCI6MTY4NTAwNDY0MywiY2lkIjoiMG9ha2R6djltYXBFeE96OU4zNTYiLCJ1aWQiOiIwMHVsaHI0ZDduOHFoWGVERjM1NyIsInNjcCI6WyJvZmZsaW5lX2FjY2VzcyIsIm9wZW5pZCIsInByb2ZpbGUiXSwiYXV0aF90aW1lIjoxNjg0OTUwNjQyLCJzdWIiOiJyYWZhZWwudWVuQGxpZmVyYXkuY29tIn0.wnqwaJtGdZ7_rOilWQVIlkDS6AV8pFAs43PCmF5sYR0pc8T3H2UcQTKCM9O0Ocw-ubhh7tTGj1YB9okCtMiJi0DOk_yHmRrSe3xmEzS1jO9eiUKDnkcaZoO-pwIvTzrTQSX1rLMPHdWCNSdTxiULbamzJWm8E8p1JD4SmdkcbfBQJvdJV8PHoB73N09PdeFGt2H20Lx6Iom9mXO1_KUUJScXyGmIy43XT4uLHI8MF4pLpJz6CcqXuZSNkt3X6dXj-mYxgk7Oh5tXQs9Eyeu7c9U2HMQgS6g0oIQNt2UN-Eq6pu59gljujQsWhoNUDS9VnK3CXU5_xtnO0fd6aYOcow"

// const headers = {
//   headers: {
//     Authorization: `Bearer ${Token}`,
//   },
// }



export async function getLastDeploy(setLastDeploy, token, projectId) {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await fetch(
    `${API_URL}${projectId}/activities/builds-deployments`,
    headers
  )
  const lastDeploy = await response.json().then((activities) => {
    const deployStartedActivity = activities.find(
      (activity) => activity.type === "DEPLOY_STARTED"
    )
    if (deployStartedActivity) {
      const currentTime = new Date()
      let createdAt = new Date (deployStartedActivity.createdAt)
      let recentDeploy = true
      if((currentTime - createdAt)/(60*60*1000) > 1) {
        recentDeploy = false
      }
      createdAt = new Date(
        deployStartedActivity.createdAt
      ).toLocaleString()
      
      return [createdAt, recentDeploy]
    }
  })
  setLastDeploy(lastDeploy)
  
}

export async function getServices(setServices, token, projectId) {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await fetch(`${API_URL}${projectId}/services`, headers);
  const responseData = await response.json();
  setServices(responseData);
}
