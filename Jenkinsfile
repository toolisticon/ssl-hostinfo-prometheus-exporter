properties properties: [
        [$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '30', numToKeepStr: '10']],
        parameters([booleanParam(defaultValue: false, description: 'Push build images directly to docker hub from Jenkins', name: 'push_docker_image')]),
        disableConcurrentBuilds()
]

@Library('holisticon-build-library')
def build = new de.holisticon.ci.jenkins.Build()
def nodeJS = new de.holisticon.ci.jenkins.NodeJS()
def git = new de.holisticon.ci.jenkins.Git()
def notify = new de.holisticon.ci.jenkins.Notify()

def pushDocker = "${env.push_docker_image}".toBoolean()

node {
    def image

    try {
        stage('Checkout') {
            deleteDir()
            checkout scm
        }

        stage('Build') {
            image = docker.build('toolisticon/ssl-hostinfo-prometheus-exporter')
            nodeJS.nvmRun('clean')
        }

        stage('Test') {
           nodeJS.nvmRun('test')
        }

        stage('Deploy') {
            // NodeJS Publish
            if (git.isProductionBranch()){
                nodeJS.publish('.')
                // Docker Publish
                if (pushDocker) {
                    docker.withRegistry('https://registry-1.docker.io/v2/', 'docker-hub-holisticon') {
                        image.push('latest')
                    }
                }
            } else {
                nodeJS.publishSnapshot('.', env.BUILD_NUMBER, env.BRANCH_NAME)
                // Docker Publish
                if (pushDocker) {
                    docker.withRegistry('https://registry-1.docker.io/v2/', 'docker-hub-holisticon') {
                        image.push("${env.BUILD_NUMBER}")
                    }
                }
            }
        }

    } catch (e) {
        notify.buildMessage(currentBuild, 'holi-oss', 'Error with recent changes: ' + build.summarizeBuild(currentBuild))
        throw e
    }

}
