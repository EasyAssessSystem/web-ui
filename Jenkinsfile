stage 'checkout the source code'
node {
   git url: 'https://github.com/EasyAssessSystem/web-ui.git'
   sh 'git pull origin master'
}

stage 'build the app'
node {
    sh 'npm install'
    sh 'npm run build'
}

stage 'deploy'
node{
   sh "scp -r /root/.jenkins/workspace/web-ui/dist/* root@192.168.0.21:/usr/share/tomcat6/webapps/ROOT"
}
