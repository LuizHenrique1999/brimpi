const API_URL = "https://api.liferay.cloud/projects/"
// const API_CLUSTER_URL = "https://api.liferay.cloud/clusters/"

const Token =
  "eyJraWQiOiI1OFY5Z2pXRkU0d3lTQWh6OUxONmw5MzAzUTV3YWRYQW1peVRyOTdBOU9ZIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmlWUGdsZTJTUnhLS3A2TmZYNlA4bVV4NEF0WXcwdFVWNWVXYmgyUVJQLWcub2FyMzE4c210NEpBeENoZWszNTciLCJpc3MiOiJodHRwczovL2F1dGgubGlmZXJheS5jbG91ZC9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2ODQ4NjI2MjcsImV4cCI6MTY4NDkxNjYyNywiY2lkIjoiMG9ha2R6djltYXBFeE96OU4zNTYiLCJ1aWQiOiIwMHVsaHI0ZDduOHFoWGVERjM1NyIsInNjcCI6WyJvZmZsaW5lX2FjY2VzcyIsInByb2ZpbGUiLCJvcGVuaWQiXSwiYXV0aF90aW1lIjoxNjg0ODYyNjI3LCJzdWIiOiJyYWZhZWwudWVuQGxpZmVyYXkuY29tIn0.rwNX787Dq7gyuGLGMuiWVBis3C0WxNbL-hMx3NeMP1FUVVIqDuvxYmAKNg2DrjrxH5nQvGjSuhenzcF1FsyhwGFyeg4D0TFk1mPHoLItWpvwV321XK4_vkT532Sx68mD27xlqe98Wl1L_JCs2y-veHfkh8FU7ptznV_VRot5lJzoy-XGbCJHqNvtiYEPXbmkbGuGVv3jNENrU4-Qq2njwlbinueW2gEpBbk1YDwWPgMSrL5QfI_UKez8oi67vAnOgEl0xmQbGX9RW3GNbN3eyGvpLRHAL3jSrhW2ndNIcC8XoeEiIhzGkgxsCttAXtJ4D0Wa7MoGamuVDa5qivysMA"

const headers = {
  headers: {
    Authorization: `Bearer ${Token}`,
  },
}



export async function getLastDeploy(setLastDeploy) {
  const response = await fetch(
    `${API_URL}pg-prd/activities/builds-deployments`,
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

export async function getServices(setServices) {
  const response = await fetch(`${API_URL}pg-prd/services`, headers);
  const responseData = await response.json();
  setServices(responseData);
}
