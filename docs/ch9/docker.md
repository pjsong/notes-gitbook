# Docker

## cmd vs entrypoint

+ cmd为容器提供缺省命令，entrypoint把容器变成一个可执行的容器。
+ docker有缺省的entrypoint`/bin/bash -c`, 但不提供缺省的cmd。`docker run -it ubuntu bash`命令中， cmd是`bash`，使用的就是缺省的entrypoint
+ `docker run -i -t ubuntu`中ubuntu提供了缺省的cmd`bash`

## env vs arg

+ arg为构建提供变量`--build-arg <varname>=<value>`
+ env为运行提供配置, 等价于`export var=yyy`的bash命令，比如`docker run -e var=yyy`

  ```Dockerfile
     ARG var
     ENV var=${var}
  ```

## [命令速记](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes)

+ `system prune`清理所有的dangling资源, 删除停止的容器，没有容器用的卷，没有容器的网络，没有容器的镜像。
+ `system prune -a`甚至去掉没有使用的镜像
+ `images -a`列出image, `rmi Image Image`删除image,
+ dangling image是那些没有关联任何image的层，列出`docker images -f dangling=true`，删除`docker images purge`
+ `docker images -a | grep "pattern" | awk '{print $3}' | xargs docker rmi`组合命令
+ 删除所有image `docker rmi $(docker images -a -q)` -q参数是只传Image ID给rmi
+ 列出/删除退出的容器`docker ps -a -f status=exited`，`docker rm $(docker ps -a -f status=exited -q)`
+ `docker ps -a -f status=exited -f status=created`列出已经退出/创建的容器
+ 停止/删除所有容器`docker stop $(docker ps -a -q)`，`docker rm $(docker ps -a -q)`
+ 列出/删除卷`docker volume ls -f dangling=true`， `docker volume prune`
+ 删除容器带上卷`docker rm -v container_name`