pipeline {
    agent any

    stages {

        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t todo-app:latest .'
            }
        }

        stage('Run') {
            steps {
                sh '''
                docker rm -f todo-app || true
                docker run -d -p 3001:3000 --name todo-app todo-app:latest
                '''
            }
        }
    }

    post {
        success { echo 'Pipeline succeeded!' }
        failure { echo 'Pipeline failed!' }
    }
}