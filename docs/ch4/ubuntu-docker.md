# docker下常用软件安装

## docker指令

[参考pengzz.cn博客](http://www.pengzz.cn/2016/06/docker-build.html)<br>
[参考oursmedia.net博客](http://oursmedia.net/wordpress/index.php/2016/06/03/docker-cheatsheet/)
[admin](https://docs.docker.com/engine/admin)

## docker 更新

[ref](https://docs.docker.com/cs-engine/upgrade/)
$ sudo apt-get update && sudo apt-get upgrade docker-engine

## run -p option

docker run -p hostPort:containerPort

## [网络](https://docs.docker.com/engine/userguide/networking/)

### 网络类型

docker安装时会创建三个网络`docker network ls`， 

命令有 `ls create inspect rm connect disconnect`

+ bridge

缺省情况Docker daemon链接容器到bridge也就是docker0网络。

+ none

容器没有网络接口。

+ host

容器内网络配置与host相同

除了bridge， 这些网络基本不需交互。 
虽然缺省的docker0 bridge网络可以用--link或者端口mapping实现容器连接。但还是建议定义自己的桥接网络。

一个容器可以链接到多个网络，容器之间只能在一个网络内连接。

+ 创建桥接网络。

  + 与缺省类似，有功能新增，去掉了旧功能。`docker network create --driver bridge --subnet 192.168.0.0/16 isolated_nw`
  + link不再有效，通过expose暴露端口给外部网络。
  + 容器运行时通过 --network=isolated_nw添加到网络。
+ overlay
  + 支持大点规模的网络。docker engine要工作在swarm模式下， 或者有外部key-value store支持。
+ 定制网络插件，与docker daemon并行运行

Docker Daemon为每一个链接到自定义网络的容器来运行内置的dns服务器，如果这个服务解析失败，则使用容器自己的外部dns服务器配置
在有Docker network之前，使用--link CONTAINER-NAME:ALIAS来实现容器互连(通过名字而不仅仅ip链接)。有了network之后，可以通过名字来发现容器， 这时link功能仍然有用，但是和默认桥接docker0有些区别了。

`docker run -itd --name=container2 busybox`

`docker network connect isolated_nw container2`
不论运行状态容器都可以加入到网络，不过inspect只显示正在运行的容器。
`docker run --network=isolated_nw --ip=172.25.3.3 -itd --name=container3 busybox`

缺省桥接网络的link功能：

+ 名字解析
+ 为链接的目标容器提供alias
+ 安全的容器间连接
+ 环境变量注入

user-defined network的link功能

+ 自动dns名字解析
+ 自动隔离的安全环境
+ 动态关联到一个/多个网络
+ --link为容器提供alias

`docker run --network=isolated_nw -itd --name=container4 --link container5:c5 busybox`
执行这个命令式, c5还没有创建。这就是link在两个环境下的区别。缺省桥接是静态，用户网络是动态，甚至支持ip变化。相似一点是，default bridge --link的alias仅在容器内部有效,同时只相对于该容器所在的网络存在。

`$ docker network disconnect isolated_nw container5`

network-alias 是容器为网络提供服务的参数。比如一个容器在不同的网络有不同的network-alias
`docker run --network=isolated_nw -itd --name=container6 --network-alias app busybox`

`docker network connect --alias scoped-app local_alias container6`

多个容器可以共享一个network alias, 在网络中如果一个失败，则会使用另外一个。
`$ docker run --network=isolated_nw -itd --name=container6 --network-alias app busybox`

`$ docker run --network=isolated_nw -itd --name=container7 --network-alias app busybox`

`$ docker attach container4`

`ping -w 4 app`

## 数据卷

### 数据卷是容器内，绕过了UnionFS文件系统(docker使用的基于版本文件系统)一个特别设计的目录。

创建数据圈容器：
为节省磁盘空间，使用与容器同样的layer。比如要运行training/postgres容器

1.`docker create -v /dbdata --name dbstore training/postgres /bin/true`
2.`docker run -d --volumes-from dbstore --name db1 training/postgres`
3.`docker run -d --volumes-from dbstore --name db2 training/postgres`

参考

1.[http://www.pengzz.cn/2016/06/docker-build.html](http://www.pengzz.cn/2016/06/docker-build.html)
2.[https://docs.docker.com/engine/tutorials/dockervolumes/](https://docs.docker.com/engine/tutorials/dockervolumes/)

## mysql

[参考pengzz](http://www.pengzz.cn/2016/06/mysqldatavolumndocker.html)

+ docker run --name cas-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d --restart unless-stopped mysql:latest 
+ docker exec –it 02061ddf0a3d1b2806a1ee6e354f4064d9d2ff4d84d8c96c0273c8883917a92f bash
+ $ docker logs some-mysql
+ docker inspect some-mysql
+ docker run --link cas-mysql:mysql --rm mysql sh -c 'exec mysql -h "ip.from.inspect.withquote OR container-name" -P "3306" -uroot -p' 

## mongodb

[参考docker](https://hub.docker.com/_/mongo/)<br>
[参考github](https://github.com/docker-library/mongo)

+ $ docker run --name some-mongo -d mongo
+ $ docker run --name some-app --link some-mongo:mongo -d application-that-uses-mongo
+ $ docker run -it --link some-mongo:mongo --rm mongo sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/test"'
+ $ docker run --name some-mongo -d mongo --auth
+ $ docker exec -it some-mongo mongo admin<pre>
+ `db.createUser({ user: 'jsmith', pwd: 'some-initial-password', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });`</pre>
+ $ docker run -it --rm --link some-mongo:mongo mongo mongo -u jsmith -p some-initial-password --authenticationDatabase admin some-mongo/some-db
`> db.getName();`
<pre>
db.updateUser(
   "&lt;username>",
   {
     customData : { <any information> },
     roles : [
               { role: "root", db: "&lt;database>" } | "&lt;role>",
               ...
             ],
     pwd: "&lt;cleartext password>"
    },
    writeConcern: { &lt;write concern> }
)
</pre>

+ `show dbs`,  `use dbname`, `show collections`

## nexus

https://github.com/sonatype/docker-nexus3

+ docker run -d --name nexus-data sonatype/nexus3 echo "data-only container for Nexus"
+ docker run -d -p 8091:8081 --name nexus --volumes-from nexus-data sonatype/nexus3

[https://docs.npmjs.com/cli/config](https://docs.npmjs.com/cli/config)

npm config set registry http://localhost:8091/repository/npmjs

## Docker

[https://docs.docker.com/engine/reference/commandline/volume_ls/](https://docs.docker.com/engine/reference/commandline/volume_ls/)

+ docker volume ls -f dangling=true
+ docker volume rm $(docker volume ls -qf dangling=true)
