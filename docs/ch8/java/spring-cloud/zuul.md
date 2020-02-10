# zuul

微服务实现中, 内部节点不对外暴露, 通过网关的一系列公开服务暴露给客户端


[zuul作用](https://www.packtpub.com/mapt/book/application_development/9781787285835/14/ch05lvl1sec060/zuul-proxy-as-the-api-gateway)

+ client只需要部分service
+ 执行特定的client政策,比如cross-origin access policy
+ 特定的client转换

## [wiki](https://github.com/Netflix/zuul/wiki/Filters)

### filter

* 是核心的功能，处理一些列业务逻辑，执行一系列的任务
* 动态读，编译，运行这些filter.filter之间没有通信，而是共享RequestContext.每个请求都有个唯一的RequestContext， 
* filter当前都用groovy写的，每个filter的源代码写入了zuul server的特定目录中。这些目录通过轮询来获得变更。
* 更新后的filter从磁盘读取，动态编译进服务器，由zuul在后续的请求中触发

#### 入口filter

主要业务逻辑在这里处理，比如认证，动态路由，请求限制，DDos保护，监测

#### endpoint

在前者基础上继续执行请求，ProxyEndPoint负责把请求带给后台的服务器。所以主要是静态的节点，比如 healthcheck， 404，error响应等。

#### outgoing

从后台接受到响应后的处理。比如存储统计数据，添加/删除头，发送时间给实时系统，gzip压缩。

#### Async

如果filter不是做很重的工作，不会阻塞，可以用sync的filter。如`HttpInboundSyncFilter or HttpOutboundSyncFilter.`
否则，你不能阻塞netty的进程，应该使用返回Observable的Async filter。如`HttpInboundFilter or HttpOutboundFilter`


<https://sivalabs.in/2018/03/microservices-part-5-spring-cloud-zuul-proxy-as-api-gateway/>

