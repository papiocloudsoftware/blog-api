Closure deploySteps = {
  // TODO: Inject credentials and deploy
  sh "yarn synth -c environmentName=${env}"
}

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
      steps(deploySteps)
    }
    stage("Functional Test") {
      steps { sh "yarn functional-test" }
    }
    stage("Deploy Prod") {
      when { branch "master" }
      steps { sh "echo TODO: Deploy Prod" }
    }
  }
}
