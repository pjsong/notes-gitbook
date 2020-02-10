# 日志追踪

[github参考](https://github.com/spring-cloud/spring-cloud-sleuth)

## 术语

Span: 

+ 基本单位. 比如发送和响应一个RPC,都是一个新的Span.
+ 用64位ID唯一标志, span属于另一个64位标志的trace
+ span还包含描述，时间戳，标签，进程(IP)ID
+ Span可以启动和停止，保有自己的时间信息， 一旦自己有创建，就要记得停止。
+ 起始Span启动一个trace，这个span就是root span. 其ID和traceID相同
+ 一棵Span树形成一个Trace

## Annotation

记录存在的某个事件。如果使用`Brave`注解，就不需要为zipkin设置特定的事件了， 比如client谁，server谁，请求来自哪里，走向哪里。

典型的事件

+ `cs`， 客户端请求client sent
+ `sr`,  服务器收到请求server received
+ `ss`,  服务器发送响应 server sent
+ `cr`,  客户端收到请求