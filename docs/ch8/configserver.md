# 配置服务器config-server
---
[说明参考](http://www.pengzz.cn/2016/06/springboot-config-server.html)
[github official](https://github.com/spring-cloud-samples/configserver.git)
[原文参考](http://cloud.spring.io/spring-cloud-config/spring-cloud-config.html)

不管客户端服务器，配置都是spring中Environment和propertySource概念的抽象。让我们从开发部署等各个环境中管理配置。缺省的存储使用git，因此也支持配置实用版本。当然其他的存储也能支持。

##Quick start
1. `mvn spring-boot:run`
2. `curl localhost:8888/foo/development`缺省clone配置`spring.cloud.config.server.git.uri`


##Client Config
+ update pom
+ add bootstrap.yml, `localhost:8080/env`将因此成为高优先级属性

##Server Config
+ `application.properties`编辑
<pre>server.port: 8888
spring.cloud.config.server.git.uri: file://${user.home}/config-repo</pre>

### `Environment Repository`环境库
+ 服务Environment对象，三个参数`{application}/{profile}/{label}`,也就是`{spring.application.name from client}/{spring.profiles.active from client}/{versioned from server like commit id, branch name or tag}`

+ 客户端如果这样配置bootstrap.yml
<pre><yaml>
spring:
  application:
    name: foo
  profiles:
    active: dev,mysql
</yaml></pre>
如果库基于文件，服务器会先创建application.yml(client共享的),和foo.yml(优先)，如果库里面有指向spring 的yaml文件，根据profile里面的顺序获取。如果还指定了profile，那就优先于缺省顺序。

优先使用ssh协议clone到本地。

如果label中有`/`，用`_`代替
 