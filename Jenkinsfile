pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_REPO = 'koussayoune/projet'
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
        
        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t ${DOCKERHUB_REPO}:catalogapi -f src/Catalog/Catalog.API/Dockerfile .
                    docker build -t ${DOCKERHUB_REPO}:basketapi -f src/Basket/Basket.API/Dockerfile .
                    docker build -t ${DOCKERHUB_REPO}:frontend-catalog -f src/Frontend/Catalog/Dockerfile .
                    docker build -t ${DOCKERHUB_REPO}:frontend-basket -f src/Frontend/Basket/Dockerfile .
                '''
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                sh '''
                    docker push ${DOCKERHUB_REPO}:catalogapi
                    docker push ${DOCKERHUB_REPO}:basketapi
                    docker push ${DOCKERHUB_REPO}:frontend-catalog
                    docker push ${DOCKERHUB_REPO}:frontend-basket
                '''
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                sh '''
                    docker compose down || true
                    docker rm -f catalogapi basketapi frontend-catalog frontend-basket || true
                '''
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
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
