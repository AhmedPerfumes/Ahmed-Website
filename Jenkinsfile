// pipeline {
//     agent any

//     environment {
//         NODE_ENV = 'production'
//     }

//     tools {
//         nodejs 'nextjs-jenkins' // Make sure NodeJS is installed in Jenkins global tools config
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git 'https://github.com/yazilansari/nextjs-jenkins.git'
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 sh 'npm install'
//                 // sh 'npm install pm2 -g' // Install PM2 globally
//             }
//         }

//         stage('Build') {
//             steps {
//                 sh 'npm run build'
//             }
//         }
        
//         stage('Start with PM2') {
//             steps {
//                 // Ensure you have a suitable start script in package.json (e.g., "start": "next start")
//                 // sh 'pm2 delete nextjs-app || true' // Delete existing process if exists
//                 // sh 'pm2 start npm --name "nextjs-app" -- run start' // Run Next.js with PM2
//                 sh 'bash /usr/local/bin/run-app.sh'
//             }
//         }
//     }

//     post {
//         always {
//             echo 'Pipeline complete'
//         }
//         failure {
//             echo 'Pipeline failed!'
//         }
//     }
// }

// pipeline {
//     agent any

//     environment {
//         NODE_ENV = 'production'
//     }

//     tools {
//         nodejs 'nextjs-jenkins' // Make sure this is configured in Jenkins Tools
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 git 'https://github.com/yazilansari/nextjs-jenkins.git'
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     dockerImage = docker.build("nextjs-app")
//                 }
//             }
//         }

//         stage('Run Next.js Container') {
//             steps {
//                 script {
//                     // Clean up old container if exists
//                     sh 'docker rm -f nextjs-container || true'

//                     // Run the new container on port 3000
//                     dockerImage.run("-d -p 3000:3000 --name nextjs-container")
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             echo 'Pipeline complete'
//         }
//         failure {
//             echo 'Pipeline failed!'
//         }
//     }
// }

// pipeline {
//     agent {
//         docker {
//             image 'docker:20.10'
//             args '-v /var/run/docker.sock:/var/run/docker.sock'
//         }
//     }
//     stages {
//         stage('Checkout') {
//             steps {
//                 git url: 'https://github.com/yazilansari/nextjs-jenkins.git', branch: 'master'
//             }
//         }
//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     dockerImage = docker.build("nextjs-jenkins-app:2")
//                 }
//             }
//         }
//         stage('Deploy') {
//             steps {
//                 script {
//                     sh label: 'Stop and remove existing container', script: '''
//                         /bin/sh -c "docker stop nextjs-jenkins-app || true"
//                         /bin/sh -c "docker rm nextjs-jenkins-app || true"
//                     '''
//                     sh label: 'Run new container', script: '''
//                         /bin/sh -c "docker run -d --name nextjs-jenkins-app -p 3000:3000 nextjs-jenkins-app:2"
//                         /bin/sh -c "docker ps -a"
//                     '''
//                 }
//             }
//         }
//     }
//     post {
//         always {
//             sh label: 'Clean up Docker image', script: '''
//                 /bin/sh -c "docker rmi nextjs-jenkins-app:2 || true"
//             '''
//         }
//     }
// }

pipeline {
    agent {
        docker {
            image 'docker:20.10'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    triggers {
        githubPush()
    }
    stages {
        stage('Webhook Debug') {
            steps {
                echo "Webhook received for branch: ${env.GIT_BRANCH}"
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }
        stage('Checkout') {
            steps {
                git url: 'https://github.com/AhmedPerfumes/Ahmed-Website.git',
                    branch: 'yazil-FE', 
                    credentialsId: 'github-credentials-AMG'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("ahmed-website")
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sh label: 'Stop and remove existing container', script: '''
                        /bin/sh -c "docker stop Ahmed-Website || true"
                        /bin/sh -c "docker rm Ahmed-Website || true"
                    '''
                    sh label: 'Run new container', script: '''
                        /bin/sh -c "docker run -d --name Ahmed-Website -p 3000:3000 ahmed-website"
                        /bin/sh -c "docker ps -a"
                    '''
                }
            }
        }
        stage('Verify') {
            steps {
                sh label: 'Verify container status', script: '''
                    /bin/sh -c "docker inspect Ahmed-Website"
                '''
            }
        }
    }
    post {
        always { 
            echo "Pipeline completed. Triggered by: ${currentBuild.getBuildCauses().collect { it.shortDescription }.join(', ')}"
        }
    }
}