# consul and docker
## from [docker site](https://docs.docker.com/samples/library/consul/)
###
1. consul cluster中每个主机都运行了agent,通常有3-5个是server模式。server通过一致性consensus协议维护cluster状态的中心视图，并对其他agent的请求做响应。 client通过gossip协议发现其他agent的状态，把对cluster的请求转给server。

2. 主机上的应用只和本地的agent通过http api或者dns interface交互，那些services在本地的agent注册并同步到那些server。
通过consul最基本的dns服务发现， 查询foo.service.consul的应用获得一个随机提供该服务的主机子集，避免应用使用proxy去定位和均衡负载. 还有些http api比如K/V store, 可用于深度与consul服务发现集成。

3. 在docker， 每个主机上运行一个agent的容器。 基本的HA要配置3个agent是server模式。在docker里要用参数 --net=host因为consul的consensus和gossip协议对延时/丢包都敏感，引入其他的网络类型不合适。

