pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        DOCKER_HUB = 'moboks'
    }
    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/modibo-26/Aeroport-Front.git'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build --build-arg REACT_APP_API_URL=http://13.62.224.45:8080 -t aeroport-frontend .'
            }
        }
        stage('Push to Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker tag aeroport-frontend $DOCKER_HUB/aeroport-frontend:v1'
                    sh 'docker push $DOCKER_HUB/aeroport-frontend:v1'
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker stop aeroport-frontend || true'
                sh 'docker rm aeroport-frontend || true'
                sh 'docker run -d --name aeroport-frontend -p 3000:80 --network aeroport_aeroport-network $DOCKER_HUB/aeroport-frontend:v1'
            }
        }
    }
    post {
        success {
            echo '✅ Frontend déployé avec succès !'
        }
        failure {
            echo '❌ Échec du déploiement frontend'
        }
    }
}
