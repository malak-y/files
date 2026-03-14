pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/malak-y/files'
            }
        }

        stage('Test') {
            steps {
                dir('app') {
                    sh 'npm ci && npm test'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t todo-app:latest .'
            }
        }

        stage('Run') {
            steps {
                sh 'docker stop todo-app || true'
                sh 'docker rm todo-app || true'
                sh 'docker run -d -p 3000:3000 --name todo-app todo-app:latest'
            }
        }

    }

    post {
        success { echo 'Pipeline succeeded!' }
        failure { echo 'Pipeline failed!' }
    }
}