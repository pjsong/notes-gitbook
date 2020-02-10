# Rabbitmq

## 基本概念

### [spring.io](https://spring.io/blog/2010/06/14/understanding-amqp-the-protocol-used-by-rabbitmq/)

#### Exchange, QUEUE和Binding

![关系图](http://blog.springsource.com/wp-content/uploads/2010/06/rabbit-basics.png)

+ publisher和consumer通过exchange名称彼此发现, 两者都可以创建exchange名称
+ 绑定过程：第一步,通常consumer创建队列同时attach队列到exchange, 第二步,exchange收到的消息attach到队列
+ 消息结构：Headers由AMQP规范定义, Properties由程序定义. 消息是二进制流。对于绑定有个标准的header叫routing-key,用于把exchange收到的消息attach到队列. 每个队列指定key,用于routing-key的匹配。
  + Exchange类型
    + 精确匹配Direct
    + 通配符匹配Topic, #匹配0+个点号(.)分割的word, * 匹配一个word
    + 忽略key的Fanout, 发送给所有的绑定的queue
    例如， routing-key=NYSE到exchange STOCKS, 队列用#,*,或者NYSE绑定到STOCKS. 如果exchange是Direct, #,*收不到消息.

#### 实现RPC的功用

#### 发布/订阅

#### 任务分发

## [AMQP 协议](https://www.rabbitmq.com/amqp-0-9-1-reference.html)

### 概念

+ 连接：指client建立的与server双方的socket网络连接
+ channel：client用于建立channel与server通信
+ 队列： 存储和转发消息,至少依附一个exchange来收到消息。队列的持久化仅说明支持服务器重启，不代表消息的持久化
+ exchange：可在服务器配置或运行时配置，负责在队列间匹配和分发消息.
  + 必须实现两种类型fanout和direct
  + 可选实现topic和header
  + 必须为每种支持的类型声明实例amq.typeName
  + 必须为每台虚拟主机预声明两个direct实例，一个叫amq.direct,另一个是缺省的exchange,给publish方法使用,同时充当缺省的队列绑定。
  + 除了`Queue.Bind`没有exchange名，不允许客户端访问缺省exchange.
  + `passive`如果队列名存在回复ok，否则抛出错误.如果没有设置这个参数,且队列存在，服务器检查`durable, exclusive, auto-delete, arguments`这些field.如果设置了，则只检查`name`和`no-wait`
  + `exclusive`该队列只能为当前连接使用，连接消失队列消失。
  + `durable`队列支持服务器重启之后仍然存在，不过不代表消息被持久化。
  + `auto-delete`如果所有的队列都不用了，自动删除该exchange
  + `internal`不能给publisher直接用,仅当绑定到其他exchange才行。

#### 持久化

+ `persistent`，`transient`的 messages都可以写入磁盘. 前者在到达时便写入, 后者仅当遇到内存压力才写入。前者也可以在内存中。持久层说的是存储两种类型的机制。

+ 持久层有2个组件，
 * 一个是队列索引负责维护队列中消息的位置，是否交付或者应答。每个队列都有索引。
 * 一个是消息store,为所有的队列共享。消息直接存储在索引或者消息store. store技术上分为persistent和transiant.

## [开始](https://www.rabbitmq.com/getstarted.html)

### hello

```bash
mkdir ~/temp && cd ~/temp && virtualenv . && source bin/activate && pip install pika && mkdir src && python --version
```

发送

```python
import pika
credentials = pika.PlainCredentials('pjsong','oursmediadotcN8')
connection =  pika.BlockingConnection(pika.ConnectionParameters('172.18.0.11',5672,'/',credentials))
channel = connection.channel()
### 要确保queue存在，否则消息被丢弃.此时的queue独立于连接。可以多次调用，不会重复创建。多次调用有个好处是保证存在。
channel.queue_declare(queue='hello')
### 消息不能直接到达queue,要先走exchange, 此时用缺省的exchange, 他能让我们明确指定消息去向哪个队列。这里队列名子就是hello
channel.basic_publish(exchange='',
                      routing_key='hello',
                      body='Hello World!')
print(" [x] Sent 'Hello World!'")
connection.close()
```

接受复杂一些，要注册一个callback函数到队列,此后便进入一个无止境循环，等待数据执行函数。
消费完了，消息就不见了
`no_ack=True`，默认是手动应答消息，用了这个参数就关闭了这个功能。

```python
def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)

channel.basic_consume(callback,
                      queue='hello',
                      no_ack=True)
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
```

### 工作/任务队列

在多个worker之间分发耗时的任务。主题思想是，避免立马开始一个耗时的工作，并等待它结束，而是安排到后面完成。这里任务就是一个消息，后台的worker自动接受消息并开始工作，如果有多个worker,就可以并行完成。

这里我们time.sleep()假装很忙，一个`.`代表1秒。

```python
# new_taks.py
import sys

message = ' '.join(sys.argv[1:]) or "Hello World!"
channel.basic_publish(exchange='',
                      routing_key='hello',
                      body=message)
print(" [x] Sent %r" % message)
```

```python
# worker.py
import time

def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
    time.sleep(body.count(b'.'))
    print(" [x] Done")
```

连续起2个worker`python worker.py`,显示`# => [*] Waiting for messages. To exit press CTRL+C`
起多个任务

```bash
python new_task.py First message.
python new_task.py Second message..
python new_task.py Third message...
python new_task.py Fourth message....
python new_task.py Fifth message.....
```

此时， 两个worker便分担了这些任务。

为了保证worker在完成工作之前挂了，消息不丢失并会转给另外的worker, worker要做消息应答，如果rabbimq没有收到应答worker就挂了(channel关闭，连接断开等)，会把消息重新归队。也因此，不存在消息超时。应答要使用同一个channel.

忘记应答是一个严重的问题，导致消息在client离开时消息被重发。mq也会越来越吃内存，因为要保持没有被应答的消息。

#### 持久话消息

如果mq服务器挂掉，消息就丢了，这时就要让消息和队列都durable.

队列参数建立之后不让改，因此hello之外要新建一个durable的队列`channel.queue_declare(queue='task_queue', durable=True)`， publish消息的时候

```python
channel.basic_publish(exchange='',
                      routing_key="task_queue",
                      body=message,
                      properties=pika.BasicProperties(
                         delivery_mode = 2, # make message persistent
                      ))
```

persistent的消息并不保证不丢失，在接受和保存到磁盘存在一个窗口期，且rabbitmq并不为每个消息执行fsync,可能只是写到了cache

#### 公平分配

如果单数的任务都比较快，偶数任务都比较轻，就会一个忙不过来，一个没事做。rabbitmq只管平均分配，并不管consumer有多少没有应答的message。

设置`prefetch_count=1`专门解决这个问题。就是让rabbitmq一次只给一个消息。
但是，如果worker都忙，队列可能满，这时要增加worker，或者用messageTTL,超过给定时间就让它die，单位毫秒，超过就删除

### 消息给多个consumer， ps模式

构建一个日志系统，一个负责发送日志，接受有两个，一个打印控制台一个写入文件。

mq的消息模型的核心思想，就是producer并不直接发送给queue,他甚至可能不知道消息会不会到达queue。

exchange一边从producer获得消息，一边要转交给queue，怎么转交？ 就有了四种类型。最简单的fanout，就是全部的queue。

```python
channel.exchange_declare(exchange='logs',
                         exchange_type='fanout')
channel.basic_publish(exchange='logs',
                      routing_key='',
                      body=message)
```

#### 临时队列

之前的例子，要给队列命名，让consumer指向它。在日志系统，我们要听到所有的消息，而且只对当前的消息感兴趣。

因此，首先，不管什么时候我们连上去，我们都需要一个空的新队列，这个名字可以让服务器来定`result = channel.queue_declare()`。
其次，consumer一旦断开，队列删除`result = channel.queue_declare(exclusive=True)`

我们有了exchange和队列，这时候需要绑定`channel.queue_bind(exchange='logs', queue=result.method.queue)`

与之前的区别

+ 发送给新生成的exchange而不是默认
+ 队列不是指定而是以来exchange的fanout来确定
+ 如果没有绑定队列，exchange的消息会丢失

### 路由，只听部分消息

继续上面的日志系统，只把重要错误写入文件，所有信息仍打印控制台。
绑定本质上就是队列只对这个exchange的消息有兴趣，绑定可以带`routing-key`参数(注意与publish中的参数`routing-key`区分,这里就叫`binding-key`)，对于fanout`binding-key`被忽略。

这里不能在用fanout了，要用上direct exchange。其后的路由算法就是，哪个queue的routing-key与消息的routing-key匹配，就走向哪个queue.

比如绑定binding-key`orange`到queue1, `black`和`green`到queue2,带有这些routing-key的消息就会被转给对应的queue,其他丢弃。当然，一个binding-key可以绑定多个queue。

在日志系统，把日志严重程度设为binding-key
在发送方

```python
hannel.exchange_declare(exchange='direct_logs',
                         exchange_type='direct')
channel.basic_publish(exchange='direct_logs',
                      routing_key=severity,
                      body=message)
```

在接受方

```python
result = channel.queue_declare(exclusive=True)
queue_name = result.method.queue

for severity in severities:
    channel.queue_bind(exchange='direct_logs',
                       queue=queue_name,
                       routing_key=severity)
```

#### 基于pattern监听消息

在日志系统，除了严重程度，还要看是谁生成这个日志，这是要用topic。

这个时候，routing-key就不能跟direct一样任意设定了，必须用`.`分开词，最长255个字节，binding-key也一样。

和direct一样，匹配消息的routing-key的队列得到消息，但有特殊就是`*`一个词，`#`任意多词。
如果没有这个特殊词，跟direct一样。

### RPC

解决在远程计算机上运行一个功能并等待其结果，就是rpc的场景。

RPC常受到诟病，当程序员不知道这个rpc服务快不快，是不是本地服务，问题就容易产生，调试也困难。对于RPC，要能清楚看出，哪些函数是本地，哪些是远程，还要对PRC服务器挂了有充分准备。否则用异步模式

这里模拟rpc，假设一个client和一个rpc服务器返回fibonacci数
`call`发出rpc请求，并阻塞等待结果

```python
fibonacci_rpc = FibonacciRpcClient()
result = fibonacci_rpc.call(4)
print("fib(4) is %r" % result)
```

回调队列，client发送请求，服务器响应，为了接收响应，client在request中要发送一个`callback`的队列地址，

```python
result = channel.queue_declare(exclusive=True)
callback_queue = result.method.queue

channel.basic_publish(exchange='',
                      routing_key='rpc_queue',
                      properties=pika.BasicProperties(
                            reply_to = callback_queue,
                            ),
                      body=request)
```

对于消息属性常用有4个

+ delivery_mode=2代表持久化消息
+ content_type编码的mime类型，比如json就是application/json
+ reply_to命名一个callback队列
+ correlation_id规划RPC响应

每个请求都建立一个queue不经济，可以一个client一个callback queue.如果这样，就要区分响应是针对哪个请求来的。先对每个请求设定一个correlation_id,在从callback queue接受消息时，通过这个属性来匹配是哪个请求。如果correlation_id不认识，丢掉便是，这不是从我们的client发出的请求。

步骤：

+ client启动并创建匿名的exclusive的callback queue
+ client发送带有reply_to和correlation_id属性的消息，给rpc_queue队列
+ rpc server从该队列拿到请求并返回结果消息到reply_to指定的队列，
+ client从reply_to监听并拿到结果，根据correlation_id,匹配则使用该结果。