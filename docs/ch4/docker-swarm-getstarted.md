# [Docker-SWARM-Getstarted](https://docs.docker.com/engine/swarm/swarm-tutorial/)

## 条件

+ 三台联网主机
+ 1.12以上docker-engine版本
+ manager主机包含固定ip。

swarm中的所有节点都通过ip来访问manger.
以下命令可用于获取ip。 `docker-machine ls` 或者 `docker-machine ip <machine-name>`

+ 主机之间端口开放

  + TCP port 2377集群管理通信端口
  + TCP and UDP port 7946 节点之间通信接口
  + UDP port 4789覆盖网络通信端口

## 创建swarm

+ ssh进入你想运行manager节点的主机 `ssh `