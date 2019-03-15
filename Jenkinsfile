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
        stage('Prepare') {
            checkout scm
            sh "pip install --user -r test/setup/test-requirements.txt"
        }

        stage('Build') {
            image = docker.build('toolisticon/ssl-hostinfo-prometheus-exporter')
            sh "cd test/setup && docker-compose up -d"
            nodeJS.nvmRun('clean')
        }

        stage('Test') {
            nodeJS.nvmRun('jasmine-test')
        }

        stage('End2End Test') {
            sh "pytest test/end2end/test_*.py --junitxml=target/reports/junit.xml"
            sh "curl -s localhost:9000 | docker exec -i prometheus promtool check metrics"
            junit 'target/reports/*.xml'
            sh "cd test/setup && docker-compose rm -f -s -v && docker volume prune -f || true"
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
