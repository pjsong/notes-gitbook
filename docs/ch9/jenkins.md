# Docker 安装 [dockerhub](https://hub.docker.com/r/jenkins/jenkins/)

## Commands

sudo docker network create --subnet 172.18.0.1/24 buildtool

docker run -p 8080:8080 -p 50000:50000 --network buildtool -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts