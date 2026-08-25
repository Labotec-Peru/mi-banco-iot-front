pipeline {
    agent any

    environment {
        PROJECT_NAME     = 'tesla-ascensores-web'
        BUILD_DIR        = 'dist' 
        DOCKER_IMAGE     = "tesla-ascensores-web"
        NETWORK          = "home-net"
        SERVER_USER      = "root"
        SERVER_HOST      = "5.189.180.249"
        SERVER_PORT      = "22"
        SSH_CREDENTIAL_ID  = 'puyu-iot'
        HTTP_PORT       = "5080"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Construyendo la imagen Docker para el front-end..."
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }
        
        stage('Deploy to Server') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: "${SSH_CREDENTIAL_ID}", keyFileVariable: 'SSH_KEY')]) {
                        sh "ssh-keyscan -p ${SERVER_PORT} ${SERVER_HOST} >> ~/.ssh/known_hosts"
                        sh "docker save ${DOCKER_IMAGE} -o ${PROJECT_NAME}.tar"
                        sh "scp -i $SSH_KEY -P ${SERVER_PORT} ${PROJECT_NAME}.tar ${SERVER_USER}@${SERVER_HOST}:/tmp/"
                        sh """
                        ssh -i $SSH_KEY -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} '
                            docker load -i /tmp/${PROJECT_NAME}.tar
                            docker stop ${PROJECT_NAME} || true
                            docker rm ${PROJECT_NAME} || true
                            docker run -d --restart always --network ${NETWORK} --name ${PROJECT_NAME} -p ${HTTP_PORT}:80 ${DOCKER_IMAGE}
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        success { echo "✅ Deploy completado" }
        failure { echo "❌ Error en el pipeline" }
    }
}
