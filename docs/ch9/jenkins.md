# jenkins

## Docker 安装 [dockerhub](https://hub.docker.com/r/jenkins/jenkins/)

### Commands

最好创建一个数据卷，便于保存插件和配置

```bash
sudo docker network create --subnet 172.18.0.1/24 buildtool

docker run -p 8080:8080 -p 50000:50000 --network buildtool -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```

以上在host上创建了一个数据卷， 如果用绑定加载的方式，要保证主机上的文件在容器内的用户仍然可访问，run的时候用参数 `-u otheruser`