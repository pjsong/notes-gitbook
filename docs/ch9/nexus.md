# Nexus 工具使用

## 1， 运行nexus

`sudo docker run -d --hostname nexus3 -v nexus-data:/nexus-data --name nexus3  --restart unless-stopped sonatype/nexus3`

## 2， 安装反向代理

主要目的是让nexus运行在80和443，适应docker等要求https的库

## docker-compose

具体配置见本人dockerfiles项目， nexus3部分

### 生成Dockers bundle

### 自动启动

```bash
crontab -e
@reboot /better/enter/fullpath/here/docker-compose -f /usr/bin/myapp/docker-compose.yml -p myapp start
```

## 3，去调docker client https限制的配置

默认的--insecure-registry参数在systemd系统中不起作用。要让在systemd系统中起作用，步骤如下：[原文参考](http://developmentalmadness.com/2016/03/09/docker-configure-insecure-registry-for-systemd/)

+ 首先在nexus下建立一个docker host库， 并选中http，写上端口8082

+ 切换到root, 添加目录和文件 `/etc/systemd/system/docker.service.d/docker.conf`

```bash
[Service]
ExecStart=
ExecStart=/usr/bin/docker daemon -H fd:// $DOCKER_OPTS
EnvironmentFile=/etc/default/docker
```

+ 修改/etc/default/docker文件

```bash
DOCKER_OPTS="--insecure-registry 172.17.0.2:8082"
```

+ 运行命令让修改生效

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

+ 登陆可以成功

```bash
sudo docker login -u admin -p admin123 172.17.0.2:8082
```

## 管理images

### 给image打tag

`sudo docker tag mysql:latest 172.17.0.2:8082/mysql_omd:latest`

之后便会生成这个命名的image

### 把这个tag的image push到服务器

`sudo docker push 172.17.0.2:8082/mysql_omd:latest`

之后能在nexus -> browse -> components中发现这个image

### pull这个image

首先登陆

`sudo docker login -u admin -p admin123 172.17.0.2:8082
sudo docker pull 172.17.0.2:8082/mysql_omd:latest`