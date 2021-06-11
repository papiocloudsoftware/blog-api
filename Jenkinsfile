pipeline {
  agent any

  stages {
    stage("Init") {
      steps { sh "yarn" }
    }
    stage("Build") {
      steps { sh "yarn build" }
    }
    stage("Test") {
      steps { sh "yarn test" }
    }
    stage("Deploy Test") {
      steps { sh "echo TODO: Deploy Test" }
    }
    stage("Functional Test") {
      steps { sh "yarn functional-test" }
    }
    stage("Deploy Prod") {
      steps { sh "echo TODO: Deploy Prod" }
    }
  }
}