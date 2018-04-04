# consul and docker

## from [docker site](https://docs.docker.com/samples/library/consul/)

1. consul cluster中每个主机都运行了agent,通常有3-5个是server模式。server通过一致性consensus协议维护cluster状态的中心视图，并对其他agent的请求做响应。 client通过gossip协议发现其他agent的状态，把对cluster的请求转给server。

2. 主机上的应用只和本地的agent通过http api或者dns interface交互，那些services在本地的agent注册并同步到那些服务器。通过consul最基本的dns服务发现， 查询foo.service.consul的应用获得一个随机提供该服务的主机子集，避免应用使用proxy去定位和均衡负载. 还有些http api比如K/V store, 可用于深度与consul服务发现集成。

3. 在docker， 每个主机上运行一个agent的容器。 基本的HA要配置3个agent是server模式。在docker里要用参数--net=host，因为consul的consensus和gossip协议对延时/丢包都敏感，引入其他的网络类型不合适。

### 用容器做服务发现

有几种办法可以注册容器中的服务。可以手动用本地agent的api，另一种是为每种主机类型做一个docker容器，里边包含consul启动需要的json配置。两种方法都笨，如果新加入容器，或者容器宕机，配置的服务可能失效。



## [官网参考](https://www.consul.io/docs/internals/architecture.html)

### 词汇表

+ [Raft一致性](https://en.wikipedia.org/wiki/Raft_(computer_science))
  + 通过选举的leader获得一致性。服务器或者是leader或者是follower, leader负责向follower的记录复制。定期向follower通知自己的存在。每个follower根据自己的timeout判定leader的心跳是否还存在。这个timeout一旦收到心跳就重置。如果没有收到心跳，follower就吧自己改成候选人状态并开始选举leader.
  + 一致性问题被分解为两个独立子问题。选举问题和记录复制问题。
    + leader失去心跳或者算法开始时，服务器把自己变成candidate,增加term计数器并选自己做leader，请其他server投票。server只能按照先来先服务的原则，只能投票一次。如果这个candidate收到其他服务器过来的term计数器比自己大或者相等，就赞成对方为合法的leader.如果candidate收到多数赞成票，就成为新的leader.否则重选。Raft用随机的选举超时来解决平局问题。因为服务器不会同时变成candidate,一般某个服务器超时，就会赢得选举，在其他服务器变成candidate之前发送心跳。
    + leader负责日志的复制，每个client的请求leader添加到自己的日志下，并转给follower,如果follower不可用，leader会不断尝试，直到所有follower都确认收到，leader认为该请求已提交，follwer得知请求已提交，就写入自己的本地状态机内。如果leader宕机，新的leader为了防止旧leader的某些信息没有复制到导致不一致，要求每个follower复制一份follower的log,找到他们最终相同的记录，并发给follower替换。

+ agent
  + 集群内每个成员都有的后台进程，有client, server或者dev的类型。
  + 能运行http/dns接口，作运行检查，保证服务同步

+ client
  + 把所有的RPC都转给某个server.
  + 唯一的后台工作是参与LAN Gossip pool

+ server
  + 算作Raft的法定人数
  + 维护集群状态
  + 响应RPC查询
  + 与其他datacenter交换WAN Gossip
  + 查询转给leader或者其他datacenter

+ datacenter，一个私有网络环境，高带宽低延时，不跨公网。

+ consensus, 包括选举的一致和复制状态机器的一致。

+ Gossip，节点之间通过UDP方式的随机通信。

+ LAN Gossip, 网络内部或者数据中心内部所有节点有份的gossip pool. 由此，1,client由此不需要配置，可以自动发现服务器地址，2,节点失败检测不在服务器，而是分布式的。3,为重要事件比如选举充当消息层。

+ WAN Gossip，只包括服务器，通常跨公网。

### agent的生命周期

agent开始时不知道集群其他节点，必须通过join命令，或者提供启动自动加入的配置。加入成功后，整个集群将收到这个消息。
不管是网络故障还是宕机，集群无法区分，只能在service catalog中更新这个信息。
节点离开时，集群标注节点离开，该节点所有的服务立即取消注册。与fail不同。
为了防止僵尸节点累积，有一个reaping进程，通常配置为72小时，自动移除。

### DNS接口

用于服务发现的一个主要查询接口。 比如不用http请求， 主机可以用`redis.service.us-east-1.consul`直接查询dns服务器。这个查询自动翻译成在`us-east-1`datacenter提供redis服务的节点。
缺省consul会监听127.0.0.1:8600接口的dns查询

相关的配置选项包括

+ `client_addr`,相当command的`-client参数`，指定consul绑定client interface的地址，包括http和dns服务器，通常是127.0.0.1,用于给主机上的其他进程联络。
+ `ports.dns`, -1为disable, 缺省8600
+ `recursors`, 上游dns地址。节点可能用consul做dns server，但如果记录不在consul域，则向上游查找
+ `domain`, 缺省consul负责所有consul域的查询，此参数修改consul负责查找的域
+ `dns_config` 设置subkey来调优dns查询。

节点查询格式`<node>.node[.datacenter].<domain>`。 如果datacenter没有，则认为与agent的相同。如查询foo节点foo.node.consul

服务查询格式`[tag.]<service>.service[.datacenter].<domain>`比如查找redis服务`redis.service.consul`，查找PostSql`primary.postgresql.service.dc2.consul`

服务查询同时支持A记录或者SRV格式

### [配置](https://www.consul.io/docs/agent/options.html)