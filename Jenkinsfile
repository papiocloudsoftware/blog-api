gitHubLibrary("deployment-library")

pipeline {
  agent any

  stages {
    stage("Init") {
      steps { sh "yarn" }
    }
    stage("Build") {
      steps { sh "yarn build-all" }
    }
    stage("Test") {
      steps { sh "yarn test-all" }
    }
    stage("Deploy Test") {
      agent {
        docker {
          image cdkDeployImage()
          reuseNode true
        }
      }
      steps {
        cdkDeploy(cdk: "yarn cdk-app", context: [environmentName: "test"])
      }
    }
//     stage("Functional Test") {
//       steps { sh "yarn functional-test" }
//     }
    stage("Deploy Prod") {
      when { branch "main" }
      agent {
        docker {
          image cdkDeployImage()
          reuseNode true
        }
      }
      steps {
        cdkDeploy(cdk: "yarn cdk-app")
      }
    }
  }
}
