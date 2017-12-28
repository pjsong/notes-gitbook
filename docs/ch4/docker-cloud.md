# [Docker-Cloud](https://docs.docker.com/docker-cloud/)

## 作用

+ 为容器应用镜像提供包括构建/测试便利的注册服务。
+ 为主机管理/安装提供工具
+ 从镜像创建应用的自动化部署


Docker Cloud provides a hosted registry service with build and testing facilities for Dockerized application images; tools to help you set up and manage host infrastructure; and application lifecycle features to automate deploying (and redeploying) services created from images.

## 概念

一个用于在虚拟主机安装docker，管理主机的工具。
其命令，可以启动，查看，停止，重启一个管理的主机，升级docker客户端和daemon，配置一个可以连接主机的客户端。
把docker-machine cli指向一个正在运行，你想管理的主机，然后直接用docker命令操作。比如`docker-machine env default`指向名叫default的主机，根据指示设置好env，然后直接运行docker命令。

## 和docker-engine的区别

当人们说Docker一般是说Engine. Engine是个CS应用，由Daemon，和一个指定与daemon交互的rest api，以及一个cli客户端(通过包装rest api)组成。

Docker Machine是一个提供和管理docker主机的工具。一般你在本地系统安装docker-machine, docker-machine有自己的cli, 以及docker的cli。 你可以用machine来安装Engine.

## 安装

### linux下命令

```bash
curl -L https://github.com/docker/machine/releases/download/v0.13.0/docker-machine-`uname -s`-`uname -m` >/tmp/docker-machine &&
chmod +x /tmp/docker-machine &&
sudo cp /tmp/docker-machine /usr/local/bin/docker-machine
```

### 安装检查

```bash
docker-machine version
docker-machine ls
```

### [创建](https://docs.docker.com/machine/get-started/)

`docker-machine create --driver virtualbox default`
该命令下载一个轻量的带docker daemon的linux发布(boot2docker)。

### 告诉docker怎样连接到新的host

```bash
docker-machine env default
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://172.16.62.130:2376"
export DOCKER_CERT_PATH="/Users/<yourusername>/.docker/machine/machines/default"
export DOCKER_MACHINE_NAME="default"
 # Run this command to configure your shell:
 # eval "$(docker-machine env default)"
```

清除shell变量 `docker-machine env -u`，根据提示 `eval $(docker-machine env -u)`,之后
`env | grep DOCKER`将没有输出

连接shell到新的主机 `eval "$(docker-machine env default)"`。此命令设置docker要读到的环境变量，关系到tls设定，每次开启新的shell或者重启机器，都需要做一次。

## docker-machine命令体验/运行容器

```bash
docker-machine ip default
docker run busybox echo hello world
docker run -d -p 8000:80 nginx
```