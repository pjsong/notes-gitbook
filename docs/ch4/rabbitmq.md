# Rabbitmq

##基本概念
###[spring.io](https://spring.io/blog/2010/06/14/understanding-amqp-the-protocol-used-by-rabbitmq/)
####Exchange, QUEUE和Binding
![关系图](http://blog.springsource.com/wp-content/uploads/2010/06/rabbit-basics.png)

  + publisher和consumer通过exchange名称彼此发现, 两者都可以创建exchange名称
  + 绑定过程：第一步,通常consumer创建队列同时attach队列到exchange, 第二步,exchange收到的消息attach到队列
  + 消息结构：Headers由AMQP规范定义, Properties由程序定义. 消息是二进制流。对于绑定有个标准的header叫routing-key,用于把exchange收到的消息attach到队列. 每个队列指定key,用于routing-key的匹配。
  + Exchange类型
    + 精确匹配Direct
    + 通配符匹配Topic, #匹配0+个点号(.)分割的word, * 匹配一个word
    + 忽略key的Fanout, 发送给所有的绑定的queue
    例如， routing-key=NYSE到exchange STOCKS, 队列用#,*,或者NYSE绑定到STOCKS. 如果exchange是Direct, #,*收不到消息.

####实现RPC的功用
####发布/订阅
####任务分发       
