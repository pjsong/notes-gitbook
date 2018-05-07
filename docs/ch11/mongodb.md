# MongoDB

[手册](docs.mangodb.com/manual/)
[docker build](docs.docker.com/engine/examples/mongodb/#building-the-mongodb-docker-image)

## 1， 运行MongoDB

### 开始

#### Docker 运行[参考](hub.docker.com/_/mongo/)

```bash
    sudo docker run --name vendor-mongo --network omd-network --ip 172.18.0.150 -d -p 27017:27017 --restart=unless-stopped mongo --replSet vendor-mongo-set mongo --port 27017 --host 172.18.0.150

    sudo docker exec -it vendor-mongo mongo admin
    db.createUser({user:'user', pwd: 'pwd', roles:[{role: "userAdminAnyDatabase", db: "admin"}]})

    sudo docker run -it --rm --link vendor-mongo:mongo mongo mongo -u user -p pwd --authenticationDatabase admin vendor-mongo/some-db
```

#### Disable THP(Transparent Huge Page)

```bash
    FROM MONGO
RUN sed -r 's/GRUB_CMDLINE_LINUX_DEFAULT="[A-Za-Z0-9_=]*/& transparent_hugepage=never/' /etc/default/grub
```

#### 安装robomongo

windows 下连接主机

##### linux [参考](askubuntu.com/question/739297/how-to-install-robomongo-ubuntu-system-please-let-me-know/781793)

```bash
    tar -zxfv robomongo-xxxx.tar.gz
    cd robotmongo-xxxx && ./robomongo
```

#### #指令[参考](www.tutorialspoint.com/mongodb)

```bash
    db.help();  db.stats(); use dbname; db; show dbs; db.dropDatabase();
    db.getUsers();
    db.createCollection("collectionName", {capped: true, autoIndexId:true, size:6142800, max: 10000})
    show collections; db.collectionName.drop(); db.collectionName.insert([{"name":"value"},{"name":"anotherValue"}])
    db.collectionName.find({"name", "value"}).pretty();
    db.collectionName.find({$and:[{"name1":"value1","name2":"value2"}]}).pretty()
    db.collectionName.find({"numField": {$gt:10}, $or: [{"name":"value1"}, {"name2":"value2"}]}})
    db.collectionName.update({'name':'value'}, {$set:{'name': 'value1'}})
    db.collectionName.update({'name':'value'}, {$set:{'name': 'value1'}}, {multi:true})

    db.collectionName.remove({'name': 'value'},1)  #just one, the first record
    db.collectionName.find({}, {'name':1, _id:0}).limit(10).skip(10).sort('name':1)
    #projection, show name and hide id, only 10 displayed, skip 10 documents, name ascending order, descending use -1
    db.collectionName.ensureIndex({'name':1}) #create index in ascending order, descending order use -1
```

##### Auth

```bash
    use admin;
    db.createUser({user:"usrname", pwd: "pwd", roles: [{role:"userAdminAnyDatabase", db: "admin"}]})
```

### 维护

导入数据

```bash
mongoimport --db test --collection restaurants --drop --file ~/downloads/primer-dataset.json
```

### 生产环境

#### [复制集](https://docs.mongodb.com/manual/replication/)

维护同一数据集的一组Mongod进程. 提供冗余和HA，是生产部署的基本。
有些情况下，复制能增加读能力，因为客户端可以发送读指令给不同的server。维护不同数据中心的数据拷贝，可以为分布式提高本地特性和可用性。也可以维护多个专用的拷贝，比如灾难维护，报表，备份等。

#### MongoDB的复制集

+ 多个数据节点和一个可选的仲裁节点。
+ 只有一个数据节点被认为是主节点，其他是次节点。 主节点接受所有的写请求，一个复制集只有primary主能用{w:"majority}确认写结果. 尽管有时其他实例可能瞬间认定自己也是主节点。
+ 主节点记录数据变更到操作日志比如oplog。从节点复制oplog。主节点不可用时，会触发选举，一个合格的从节点变自己为主节点。
+ 从节点可以进行特定配置：
  + 选举中避免成为候选人
  + 隐藏自己，让应用读不到，便于运行那些需要独立于业务的应用
  + 从某个错误前开始运行快照，比如某次误删了数据。
+ 可以在复制集中额外加入一个仲裁者arbiter实例，arbiter主要通过心跳和选举请求的响应，维护复制集中的quorum法定人数。 因为没有数据存储，很适合提供法定人数的功能，如果复制集有偶数个成员，添加一个arbiter一张选票，就可以方便选举中产生多数，不做主节点。不要在primary或者secondary的主机上同时运行arbitor.
+ 异步复制，从节点从主节点异步执行oplog,整个set照常工作。
+ 自动恢复，如果主节点10s之后没有与从节点通信，一个secondary会发起选举选取自己做primary，首先发起并赢得选举的secondary成为primary.一次恢复在一分钟内完成，比如， 10-30秒内确认primary有问题了，一个secondary发起选举并得到结果，也需要10-30s。
+ [write concern](https://docs.mongodb.com/manual/reference/write-concern/)说的是，对于Mongodb向单个mongod或者复制集或者分片集群发送写请求时，要求的响应级别。包含`{w:value, j:boolean, wtimeout: number}`
  + w:要求请求写操作已经传播到指定mondod实例数量，或者某个标签的实例。
  + j:要求写操作根据`w`的值已经进入磁盘journal.本身不保证因为primary的fail-over发生的回滚。
  + wtimeout: write-concern的时间限制，写操作若没有按时返回会发生错误，即使已经成功。在wtimeout之前mongodb不会撤销成功的数据更改。wtimeout=0就是不设置timeout。不指定wtimeout，且拿不到write-concern的级别，读操作永久阻塞
+ 读，缺省时client从primary读，可以设定[read preference](https://docs.mongodb.com/manual/core/read-preference/)来读secondary,从secondary读取的结果可能没有及时更新。
  + read concern level. client可以看到写持久化之前的结果，不管write-concern, 其他使用`local`。`available`的read-concern可以在写操作返回之前看到写操作。也就是脏读。
    + local: primary上的默认读级别。sencondary上没有指定`level`但指定了`afterClusterTime`.数据可能回滚
    + available: secondary上如果`level`和`afterClusterTime`都没有指定的默认级别。对于没有分片的collection和Local是一样的，3.6新加入的。
    + majority: 数据已经经过确认写入复制集。
    + linearizable：写级别为majority的操作都已经成功，并响应完成，只能在primary上应用。
  + 脏读和单个文档。
    + 写操作是原子的，就是说，不会读入只更新了一部分的文档。
    + 对于单个mongod实例，读写操作集是serializable, 对于replica-set,如果不出现回滚，操作集是serializable.
  + 脏读和多个文档。
    单个文档是原子的，但整体操作不是原子的。没有对多文档写操作的隔离，mongodb表现如下
    + Non-point-in-time操作。假定读操作t1时读取一些文档，写操作在之后t2时更新了某个文档，读操作能看到更新后的版本。因此看不到point-in-time的快照。
    + Non-serializable操作。假定t1时读取d1,写操作在之后的t3更新了d1, 这样导致了读写依赖：如果要操作serializable, 读就要先于写发生，如果同时假定该写操作在t2更新了d2,读在接下来的t4又读d2,就导致了写读依赖，要求读在写之后发生，这就导致循环依赖，使得serializable不可能实现。

#### 原子和事务

+ 写单个文档是原子的，即使是更新嵌入的多个文档。
+ 写多个文档时，只有单个是原子的，整体没有原子性。
  + 使用嵌入文档能保证写的原子性，如果需要多个写操作的事务，可以用两阶段提交。尽管2阶段提交能保证语义上的一致性和原子性，但应用可能返回一些中间结果。

##### [两阶段提交](https://docs.mongodb.com/manual/tutorial/perform-two-phase-commits/)

简单概括：事务`findAndModify`方法获取并设为pending状态--->两边账户更新余额和pending事务id--->更新事务设为applied--->两边帐号删除pending事务id--->更新transaction状态为done.
转账操作举例，两个collection，一个accounts，一个transactions。account放入两个账户，初始化事务记录。

```bash
db.accounts.insert(
   [
     { _id: "A", balance: 1000, pendingTransactions: [] },
     { _id: "B", balance: 1000, pendingTransactions: [] }
   ]
)
transactions.insert(
    { _id: 1, source: "A", destination: "B", value: 100, state: "initial", lastModified: new Date() }
)
```

+ 获取要开始的事务 `var t = db.transactions.findOne( { state: "initial" } )`
+ 更新事务状态为`pending`

```bash
db.transactions.update(
    { _id: t._id, state: "initial" },
    {
      $set: { state: "pending" },
      $currentDate: { lastModified: true }
    }
)
```

+ 两边账户应用事务

```bash
db.accounts.update(
   { _id: t.source, pendingTransactions: { $ne: t._id } },
   { $inc: { balance: -t.value }, $push: { pendingTransactions: t._id } }
)
db.accounts.update(
   { _id: t.destination, pendingTransactions: { $ne: t._id } },
   { $inc: { balance: t.value }, $push: { pendingTransactions: t._id } }
)
```

+ 更新事务状态为`applied`

```bash
db.transactions.update(
   { _id: t._id, state: "pending" },
   {
     $set: { state: "applied" },
     $currentDate: { lastModified: true }
   }
)
```

+ 更新两边帐号的代办事务列表

```bash
db.accounts.update(
   { _id: t.source, pendingTransactions: t._id },
   { $pull: { pendingTransactions: t._id } }
)
db.accounts.update(
   { _id: t.destination, pendingTransactions: t._id },
   { $pull: { pendingTransactions: t._id } }
)
```

+ 更新事务状态为done

```bash
db.transactions.update(
   { _id: t._id, state: "applied" },
   {
     $set: { state: "done" },
     $currentDate: { lastModified: true }
   }
)
```

###### 错误恢复

要达到一致状态所需的时间，要看应用回复每个事务需要的时间。下面的举例使用lastModified日期作为标准看是否需要恢复。如果pending或者applied状态已经达到30分钟，就开始回滚。

回滚pending: transaction设置状态`canceling`--->撤销两边账户的更新--->transaction设置状态canceled

```bash
var dateThreshold = new Date();
dateThreshold.setMinutes(dateThreshold.getMinutes() - 30);
var t = db.transactions.findOne( { state: "pending", lastModified: { $lt: dateThreshold } } );
db.transactions.update(
   { _id: t._id, state: "pending" },
   {
     $set: { state: "canceling" },
     $currentDate: { lastModified: true }
   }
)
db.accounts.update(
   { _id: t.destination, pendingTransactions: t._id },
   {
     $inc: { balance: -t.value },
     $pull: { pendingTransactions: t._id }
   }
)
db.accounts.update(
   { _id: t.source, pendingTransactions: t._id },
   {
     $inc: { balance: t.value},
     $pull: { pendingTransactions: t._id }
   }
)
db.transactions.update(
   { _id: t._id, state: "canceling" },
   {
     $set: { state: "cancelled" },
     $currentDate: { lastModified: true }
   }
)
```

回滚applied。 此时不要回滚事务，应该结束事务并发起一个新的相反的事务。

```bash
var dateThreshold = new Date();
dateThreshold.setMinutes(dateThreshold.getMinutes() - 30);
var t = db.transactions.findOne( { state: "applied", lastModified: { $lt: dateThreshold } } );
```

为了保证只有一个会话获得要处理的事务，需要使用`findAndModify`方法。

```bash
t = db.transactions.findAndModify(
       {
         query: { state: "initial", application: { $exists: false } },
         update:
           {
             $set: { state: "pending", application: "App1" },
             $currentDate: { lastModified: true }
           },
         new: true
       }
    )
```

实际情况要比这个复杂， 比如帐号加减之前，要看余额等。写入时，要注意使用了正确的写级别。

##### 并发控制

一种是在一个或者多个字段建立唯一索引，另一个方法，在写操作的查询时使用字段并findAndModify，比如两阶段提交使用了state字段.

##### 游标快照

游标快照可能一个文档多次返回。游标返回文档时，还可能正在发生其他操作。如果该操作转移文档到其他地方，或者修改了查询使用的索引字段，游标就会多次返回同一个文档。
如果表有不会被修改的字段，那么该字段就可用唯一索引，这样查询不会多次返回同一个文档。可以使用hint来显式强制查询使用该索引。

## [指令集](https://docs.mongodb.com/manual/reference/sql-comparison/)

```javascript
//隐含创建account `db.createCollection("people")`;
db.account.insertOne( {user_id: "abc123", age: 55, status: "A" } );
//添加字段
db.people.updateMany(
    { },
    { $set: { join_date: new Date() } }
)
//删除字段
db.people.updateMany(
    { },
    { $unset: { "join_date": "" } }
)
//创建索引
db.people.createIndex( { user_id: 1 } )
//创建组合索引
db.people.createIndex( { user_id: 1, age: -1 } )
//插入
db.people.insertOne(
   { user_id: "bcd001", age: 45, status: "A" }
)

db.account.find();
db.account.find({},user_id:1, _id:0);
db.account.find({status: "A"});
db.account.find({status: "A"}, {user_id:1, _id:0});
db.account.find({status: {$ne: "A"});
db.account.find({$or: [{status: {$ne: "A"}, {age: 50}]})
db.account.find({age: {$lt: 50}});
db.account.find({age: {$gt: 25, $lte: 50}})
db.account.find({user_id: /bc/}); OR {user_id: {$regex:/bc/}}
db.account.find({user_id: /^bc/}); or {user_id: {$regex: /^bc/}}
db.account.find({status:"A"}).sort({user_id: 1});
db.account.count() OR db.account.find.count()
db.account.count({user_id: {$exists: true}}).count()
db.account.count({age: {$gt: 20}}) OR db.account.find({age: {$gt: 20)}).count()
db.account.distinct("status")
db.account.findOne() OR db.account.find().limit(1)
db.account.find().limit(5).skip(10)
db.account.find().explain()

db.account.updateMany({age: {$gt: 20}}, {$set: {status: "C"}});
db.account.updateMany({status: "A"}, {$inc: {age: 3}});

db.account.deleteMany({status:"D"});
db.account.deleteMany({});

//在两个字段创建text索引
db.stores.createIndex( { name: "text", description: "text" } )
//查找所有含有 java或者coffee或者shop的文档
db.stores.find( { $text: { $search: "java coffee shop" } } )
//查找所有包含Java或者coffee shop，精准匹配用双引号包起来
db.stores.find( { $text: { $search: "java \"coffee shop\"" } } )
//包含java或者shop但没有coffee
db.stores.find( { $text: { $search: "java shop -coffee" } } )
//对搜索结果作相关性打分并排序
db.stores.find(
   { $text: { $search: "java coffee shop" } },
   { score: { $meta: "textScore" } }
).sort( { score: { $meta: "textScore" } } )
```

## 聚合[Aggregation](https://docs.mongodb.com/manual/aggregation/)

聚合是对结果进行一定的计算后返回。有三种方式来做聚合计算。

+ pipline `db.orders.aggregate([{$match: {status:"A"}}, {$group: {_id: "$cust_id", total: {$sum: "$amount"}}}])`
+ mapReduce
+ 单目的Aggregation操作 `db.orders.distinct("cust_id")`

## [建模](https://docs.mongodb.com/manual/core/data-modeling-introduction/)

数据建模的主要挑战是应用的需求和数据库引擎性能之间的平衡，以及数据获取的模式。设计模型要考虑这些数据有怎样的业务操作，以及数据内在的结构。

mongodb建模的关键，是文档的结构，和应用怎样表现文档之间的关系。表现关系有两种方式： 嵌入或者引用。

## 分片[sharding](https://docs.mongodb.com/manual/sharding/)

有两个方法来解决系统的数据增长。 水平和垂直扩展。
垂直扩展是增加单个服务器的能力，垂直扩展在实际中能力有限。
水平扩展，是把数据和压力分到多个服务器，用添加服务器的方法提高整体能力。

### 分片集群

一个分片集群有三个组件

+ 片：每个片包含一个数据子集.每个片都可作为复制集来部署
+ Mongos：mongos充当查询路由，在应用和分片集群之间充当接口
+ 配置服务器: 配置服务器存储集群的元数据和配置设置。配置服务器必须按复制集配置

mongodb在collection的级别为数据分片。把collection数据分布到各个片上。

#### 分片key

+ 由一个不可变更的字段，或者每个文档都存在的字段构成。
+ 分片Key一旦确定，分片之后不可改变，一个collection只能有一个shardKey.
+ 要对非空collection分片，collection必须要有一个用shardkey开始的索引。对于空的collection, mongodb可以自己创建一个。
+ 对shardkey的选择对性能有影响，也影响集群可以使用的分片策略。
+ [详细](https://docs.mongodb.com/manual/core/sharding-shard-key/)


