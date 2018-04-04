# [微服务模式](http://microservices.io/patterns/ui/client-side-ui-composition.html)

微服务架构的目标就是通过持续交付/部署来加速开发。简化测试，组件独立部署，开发人员形成自治小组。

## 服务注册

+ service registration 用client-side discovery或者server-side discovery为请求定位到服务的实例
+ client-side discovery 服务需要相互调用，在单应用系统中，是通过语言级别的方法或者进程调用实现的，传统的分布式中，服务地址也是固定的，但微服务应用中，服务运行在虚拟/容器环境，有多个实例在运行且位置是动态变化的。客户端需要实现一个机制，能够向一个动态的，临时性的服务实例发送请求。方案是client通过查询service registry来定位服务实例。
+ 微服务架构 服务端应用要求能支持不同的客户端，比如手机，桌面浏览器，手机浏览器，同时也与其他应用比如webservice等，它通过处理业务逻辑来处理请求。
+ 微服务架构把程序结构打散为松耦合的服务，服务通过同步http或者异步AMQP来通信，独立部署，每个服务有自己的数据库，服务之间的数据同步通过saga模式维护。
+ 一个产生价值的业务能力，就定义为一个服务。
+ saga模式 微服务有自己的数据库，事务分布在不同的服务上，不能通过跨库来实现。对于跨服务的事务可以用saga模式。saga是一个本地事务的sequence,每个本地事务更新本地数据库并发送消息给sage触发下一个事务。本地事务失败，则saga触发补偿事务来回滚之前的事务。

## [参考2](https://martinfowler.com/articles/microservices.html)

from<http://callistaenterprise.se/blogg/teknik/2015/03/25/an-operations-model-for-microservices/>