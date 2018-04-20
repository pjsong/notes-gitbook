# cloud config

## ref

[spring.io](https://cloud.spring.io/spring-cloud-config/)
[bitbucket private code](https://bitbucket.org/jeson_peng/configserver/)
[spring cloud sample](https://github.com/spring-cloud-samples/configserver.git)
[Spring-Cloud-Config-Server-Spring-Cloud-Bus-RabbitMQ-and-Git](Refreshable-Configuration-using-Spring-Cloud-Config-Server-Spring-Cloud-Bus-RabbitMQ-and-Git)

## [spring cloud bus](http://cloud.spring.io/spring-cloud-static/spring-cloud.html#_spring_cloud_bus)

cloudbus负责分布式系统中的节点连接到一个message broker，然后发送状态变更，指令广播。
关键思想是，bus就像scale out后，springboot的一个分布式的actuator,还能用作app之间的通信。唯一的实现就是用AMQP作传输层。

## client

