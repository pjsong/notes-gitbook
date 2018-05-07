# Docker-Command

## [daemon](https://docs.docker.com/v1.11/engine/reference/commandline/daemon/#daemon-configuration-file)

## 选项

### socket

daemon能通过三种Socket监听远程API请求：unix,tcp,fd.

缺省情况下， 用root权限或者docker组成员权限， 在/var/run/docker.socket创建一个IPC socket.

如果要远程访问daemon,需要打开tcp socket，缺省安装直接访问daemon,没有加密和认证,最好用https加密socket或者前边放一个安全代理。

可以用`-H tcp://0.0.0.0:2375`监听所有的网络接口，或者特定的IP网络端口`-H tcp://192.168.59.103:2375`. 一般用2375端口做不加密通信， 2376做加密通信。

如果用https加密socket，注意只支持TLS1.0以上。在基于Systemd的系统， 可以通过Systemd socket activation与daemon通信，用`docker daemon -H fd://`。也可以制定单个socket如`docker daemon -H fd://3`. 如果指定的socket激活文件没找到，Docker将退出。在Docker source tree可以找到用docker和systemd做systemd socket activation例子。

可以配置docker daemon同时监听多个socket， 如
`docker daemon -H unix:///var/run/docker.sock -H tcp://192.168.59.106 -H tcp://10.10.10.2`同时监听缺省的unix socket, 和主机上2个特定的ip。

Docker client会根据Docker_HOST环境变量来为client设置-H标记
`docker -H tcp://0.0.0.0:2375 ps` 或者 `export DOCKER_HOST="tcp://0.0.0.0:2375";docker ps`等价。

设置DOCKER_TLS_VERIFY环境变量为非空串，与设置`--tlsverify` 等价.
`docker --tlsverify ps`和`export DOCKER_TLS_VERIFY=1;docker ps`一样的。

Docker client 会参考 HTTP_PROXY, HTTPS_PROXY, NO_PROXY等环境变量。 HTTPS_PROXY 优先于HTTP_PROXY.

