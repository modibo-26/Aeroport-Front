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
                git branch: 'master', url: 'https://github.com/modibo-26/Aeroport-Front.git'
            }
        }
        stage('Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker build -t ${DOCKER_HUB}/aeroport-frontend:v1 ."
                    sh "docker push ${DOCKER_HUB}/aeroport-frontend:v1"
                }
            }
        }
        stage('Deploy') {
            steps {
                sshagent(['aws-ssh-key']) {
                    sh """
                        scp -o StrictHostKeyChecking=no docker-compose.yml ubuntu@${AWS_IP}:~/frontend/docker-compose.yml
                        ssh -o StrictHostKeyChecking=no ubuntu@${AWS_IP} '
                            cd ~/frontend &&
                            docker pull ${DOCKER_HUB}/aeroport-frontend:v1 &&
                            docker-compose down || true &&
                            docker-compose up -d
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
