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
                        ssh -o StrictHostKeyChecking=no ubuntu@${AWS_IP} '                                                                                                                   
                            cd /home/ubuntu &&                                                                                                                                               
                            docker-compose -f docker-compose.prod.yml pull frontend &&
                            docker-compose -f docker-compose.prod.yml stop frontend &&
                            docker-compose -f docker-compose.prod.yml rm -f frontend &&
                            docker-compose -f docker-compose.prod.yml up -d frontend
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
