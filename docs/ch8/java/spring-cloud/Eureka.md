# [Eureka](https://github.com/Netflix/eureka/wiki/Eureka-at-a-glance)

+ 基于rest服务的服务器
+ 为负载均衡提供服务定位，提供failover
+ 服务器来了又走，负载均衡需要同时能注册/卸载服务器

## CS通信

+ 注册，client在30s后的第一次心跳,因此应用启动后30s才会出现在registry
+ renewal，每30s一次，如果90s`eureka.instance.leaseExpirationDurationInSeconds`服务器没有收到心跳，移除服务
+ client获取并缓存本地注册信息。30s更新一次，
+ client 关闭时发送cancel移除实例
+ client发送命令在server和其他client有大约2分钟延时。
+ Ribbion从client拿信息，也有一个自己的缓存30s刷新一次`ribbon.ServerListRefreshInterval`，避免每次请求都调一次client

## server

+ 服务器的响应cache每30s`eureka.server.responseCacheUpdateIntervalMs`更新一次，刚注册的服务不会马上出现在`/eureka/apps`，不过Dashboard不同与restApi, 不用cache,如果知道instancdId, 直接用`/eureka/apps/<appName>/<instanceId>`，也能绕过cache.

## 点对点通信

[参考](https://blog.asarkar.org/technical/netflix-eureka/)

+ client首先在本zone查找server,找不到再去别的zone.
+ 服务器一旦开始接受信息，就把自己知道的信息复制给其他结点
+ server一开始，便从其他节点获取实例注册信息。尝试5次`eureka.server.numberRegistrySyncRetries`， 如果不能，则5分钟`eureka.server.getWaitTimeInMsWhenSyncEmpty`之内不让client获取信息。
+ 如果能成功得到所有的实例便设置renewal threshold(85% within 15min),如果低于这个值，就会激活新的模式，此时server不会移除实例，以保护自己的注册信息。这就是self-preservation模式。
  + 比如一台服务器，两个实例，每个30s发送一次renewal,则总共每分钟发送4次renewal,这个4再加上一个默认数1(设置key为`eureka.instance.registry.expectedNumberOfRenewsPerMin`)，就是5,再乘以`因子eureka.server.renewalPercentThreshold缺省0.85`，然后向上round取整，还是5,如果15分钟(eureka.server.renewalThresholdUpdateIntervalMs)内少于5次心跳，则进入self-preservation模式。
  + 不建议修改client心跳频率`eureka.client.instanceInfoReplicationIntervalSeconds`，要改就改`eureka.server.renewalPercentThreshold`
  + 此模式的道理是：比如AB两个实例，通信良好，但是B跟server的通信不行，此时server不能踢掉B，否则A就拿不到B的注册信息了。
  + 在这种模式下，client要设置timeout并及时转向另外的服务器。

+ 集群部署时，会过滤同一主机上的url,防止把自己做成自己的peer,因为他们判断peer不检查端口。 peer检测只在`eureka.client.serviceUrl.defaultZone`的hostname不一样才行。可以编辑/etc/hosts文件来做
+ region和zone。AWS特有的概念。region指一个地理区域，是独立的。每个region有多个位置叫Availability zone，但是在一个region内部的zone享有告诉内部链接。zones可以在多个region复制存在![图片](https://blog.asarkar.org/assets/images/aws-regions.png)

### 网络故障可能导致的问题

+ 节点之间的复制心跳失败，进入selfPreservation模式
+ 注册发生在一台机器上，有些client收到新注册有些收不到。
