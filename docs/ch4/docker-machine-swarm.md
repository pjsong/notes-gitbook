# Docker-Machine

## 作用

+ 在mac和windows安装docker
+ 提供/管理多个docker远程主机
+ 提供swarm集群

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

### [创建本地虚拟主机](https://docs.docker.com/machine/get-started/)

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

## [配置云主机](https://docs.docker.com/machine/get-started-cloud/)

许多云平台都有驱动插件， 因此你可以用Machine来配置云主机。用machine来配置的话，你就用docker-engine创建一个云主机。

首先要安装运行machine, 同时用云提供商创建一个帐号。

然后提供该供应商帐号验证， 安全密钥，配置选项作为标记给machine，对每个特定的驱动，这些标记都是唯一的。比如通过`--digitalocean-access-token`传一个token给digital ocean。

### [Generic驱动](https://docs.docker.com/machine/drivers/generic/#example)

如果没有直接支持的主机驱动， 或者想引入一个现有的主机给machine来管理， 则generic比较合适，它使用现有主机通过ssh创建machine。

```bash
docker-machine create \
  --driver generic \
  --generic-ip-address=203.0.113.81 \
  --generic-ssh-key ~/.ssh/id_rsa \
  --generic-ssh-user ubuntu \
  --generic-ssh-port 5722 \
  vm
```

--generic-engine-port: Port to use for Docker Daemon (Note: This flag will not work with boot2docker).
--generic-ip-address: required IP Address of host.
--generic-ssh-key: Path to the SSH user private key.
--generic-ssh-user: SSH username used to connect.
--generic-ssh-port: Port to use for SSH.

### [无驱动引入已有主机](https://docs.docker.com/machine/get-started-cloud/#3rd-party-driver-plugins)

通过传入daemon-url来添加已有的docker主机。

`$ docker-machine create --driver none --url=tcp://50.134.234.20:2376 custombox
`

<http://dongkui.leanote.com/post/Machine>
<https://www.tuicool.com/articles/Qv26FjU>
<https://andyyoung01.github.io/2017/04/30/%E5%B0%86%E4%B8%BB%E6%9C%BA%E7%BA%B3%E5%85%A5Docker-Machine%E7%9A%84%E7%AE%A1%E7%90%86/>
<http://www.cnblogs.com/sparkdev/p/7066789.html>
<https://www.upcloud.com/support/get-started-docker-machine/>