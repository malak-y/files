pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = "malak/todo-app"
        DOCKER_TAG     = "${env.BUILD_NUMBER}"
        REGISTRY_CREDS = credentials('dockerhub-credentials')
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo '📥 Cloning repository...'
                git branch: 'main',
                    url: 'https://github.com/yourrepo/devops-todo-project'
            }
        }

        stage('Install & Test') {
            steps {
                echo '🧪 Installing dependencies and running tests...'
                dir('app') {
                    sh 'npm ci'
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit 'app/coverage/junit.xml'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing image to DockerHub...'
                sh "echo ${REGISTRY_CREDS_PSW} | docker login -u ${REGISTRY_CREDS_USR} --password-stdin"
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker push ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Deploying to Kubernetes...'
                sh "kubectl set image deployment/todo-app todo-app=${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh 'kubectl rollout status deployment/todo-app'
                // Or apply full manifests:
                // sh 'kubectl apply -f k8s/'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
        always {
            sh 'docker logout'
        }
    }
}
