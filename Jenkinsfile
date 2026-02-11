pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        AWS_IP = '13.62.225.210'
        DOCKER_HUB = 'moboks'
    }
    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/modibo-26/Aeroport-Front.git'
            }
        }
        stage('Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker build --build-arg REACT_APP_API_URL=http://${AWS_IP}:8080 -t ${DOCKER_HUB}/aeroport-frontend:v1 ."
                    sh "docker push ${DOCKER_HUB}/aeroport-frontend:v1"
                }
            }
        }
        stage('Deploy') {
            steps {
                sshagent(['aws-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${AWS_IP} '
                            docker pull ${DOCKER_HUB}/aeroport-frontend:v1 &&
                            docker stop ubuntu_frontend_1 || true &&
                            docker rm ubuntu_frontend_1 || true &&
                            docker stop aeroport-frontend || true &&
                            docker rm aeroport-frontend || true &&
                            docker run -d --name aeroport-frontend -p 3000:80 ${DOCKER_HUB}/aeroport-frontend:v1
                        '
                    """
                }
            }
        }
    }
    post {
        success { echo '✅ Frontend déployé !' }
        failure { echo '❌ Échec du déploiement frontend' }
    }
}