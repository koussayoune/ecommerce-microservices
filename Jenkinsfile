pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials'
        IMAGE_BASKET = 'koussayoune/projet:basket'
        IMAGE_CATALOG = 'koussayoune/projet:catalog'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/koussayoune/ecommerce-microservices.git'
            }
        }
        
        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                        sh "docker push ${IMAGE_BASKET}"
                        sh "docker push ${IMAGE_CATALOG}"
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                sh 'docker compose down --rmi local || true'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finished!'
        }
    }
}
