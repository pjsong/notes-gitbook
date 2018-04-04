# zookeeper

## 部署

可靠性基于如下假设，只有少数机器会宕机。所有已经部署的机器都能正常工作。
3台机器能接受1台failure, 5台机器接受2台failure,所以一般用奇数台机器。

要避免机器failure同一个开关比如电路等，因为这样会导致一次开关失败多台机器failure.

集群服务器之间不能跨数据中心。腾讯非私有网络的服务器经测试不能组成集群。但可以在一台物理主机上的docker network上做。

## [springboot](https://cloud.spring.io/spring-cloud-static/spring-cloud-zookeeper/1.1.1.RELEASE/)

### 用作服务发现

zookeeper的java库，Curator, 通过service discovery extension,提供了服务注册/发现的功能

+ 引入`org.springframework.boot:spring-boot-starter-web`， `org.springframework.cloud:spring-cloud-starter-zookeeper-discovery`自动启动Ribbon使用`ZookeeperServerList`
+ `@EnableDiscoveryClient`把app自我注册变成zookeeper的服务，也是查询其他服务的客户端
+ 如果zookeeper不在localhost, 在application.yml放入属性`spring.cloud.zookeeper.connect-string: localhost.2181`
+ 如果使用zookeeper的分布式配置， 以上配置放入bootstrap.yml
+ 缺省的服务名`${spring.application.name}`，实例id`Spring Context ID`和端口`${server.port}`，
+ 支持客户端有`Feign`， `Spring RestTemplate`使用服务逻辑名，还能用`DiscoveryClient`,`DiscoveryClient`API提供了发现不具体的netflix的客户端。
+ 提供了服务注册编程接口

Netflix提供了不关注具体DiscoveryClient实现(Feign, Turbine, Ribbon, Zuul等)的工具，

Eureka支持注册的服务实例`OUT_OF_SERVICE`之后不再作为活动的实例返回。但是Curator的服务发现不支持，

### zookeeper依赖

用属性的形式提供应用的依赖。通过依赖，可以知道注册的其他应用，以及要调用哪一个。
通过Dependency Watcher还可以知道这些依赖的状态以及怎么处理它们。
`spring.cloud.zookeeper.dependency.enabled=false`可以关闭属性依赖功能

#### 依赖的格式

+ `Alias`  因为Ribbon(要求URL中必须有application id)，因此每个依赖都要有一个别名。在DiscoveryClient应该用别名，而不是ServiceId。
+ `Path`  依赖在zookeeper注册的路径。因为Ribbon在URL操作，zookeeper要把alias映射成路径
+ `loadBalancerType` 调用依赖使用哪种负载均衡策略。三种，一旦选中，一直不变;随机;轮询
+ `contentTypeTemplate`和`version`。你一定不希望每次请求都用content-type头来设置api的版本，调用一个新版本也不想到处找版本号。此时version就是一个ContentTypeTemplate的占位符。
+ `headers` 调用依赖要用到的一些缺省header,
+ `required` 如果应用启动，依赖必须在运行，设为true。设为true之后如果依赖不在运行，注册失败。

### 用于分布式配置

配置在`bootstrap`阶段装入，存储在`/config`名称空间，

#### 属性定制

+ `enable` zookeeper config生效
+ `root` 配置值的base namespace
+ `defaultContext` 给所有应用使用的名字
+ `profileSeparator` 用于给带有profile的property source中分隔profile名字