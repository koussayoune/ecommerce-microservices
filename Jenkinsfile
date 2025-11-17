pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/koussayoune/ecommerce-microservices.git'
            }
        }
        
        stage('Docker Login') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }
        
        stage('Pull Docker Images') {
            steps {
                sh 'docker compose pull'
            }
        }
        
        stage('Deploy Services') {
            steps {
                sh 'docker compose up -d'
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh 'docker compose ps'
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
            echo 'Pipeline finished!'
        }
    }
}
