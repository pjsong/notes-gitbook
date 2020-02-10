# Mysql指令

## 内存模型

+ 一个连接2.7M
+ 实例170M

## [表分区官方指南](https://dev.mysql.com/doc/refman/5.6/en/alter-table-partition-operations.html)

~~查看分区支持 `show variables like '%partition%` 已过期~~不显示变量，也能支持分区。

### 表分区的限制

1. 一个表最多只能有1024个分区,5.6后的版本支持8192
2. MySQL5.1中，分区表达式必须是整数，或者返回整数的表达式。在MySQL5.5中提供了非整数表达式分区的支持。
3. 如果分区字段中有主键或者唯一索引的列，那么多有主键列和唯一索引列都必须包含进来。
4. 分区表中无法使用外键约束
5. MySQL的分区适用于一个表的所有数据和索引，不能只对表数据分区而不对索引分区，也不能只对索引分区而不对表分区，也不能只对表的一部分数据分区。
6. range分区要预先准备好，否则插入失败，为此使用maxvalue `alter table t add partition(partition p2 values less than maxvalue);`

### [测试分区](http://www.ywnds.com/?p=7226)

通过my.cnf查看到数据存储目录，对于innodb引擎，每张表包含两个文件：表结构的frm文件，数据和索引的idb文件。
对于range类型每个分区都是按顺序定义的，从最低到最高。

+ 查看表有多少分区

```sql
select * from INFORMATION_SCHEMA.partitions where table_schema='test' and table_name = 'emp';
```

+ drop table去掉所有分区

```sql
create table foo_range (
id int not null auto_increment,
created DATETIME,
primary key (id, created)
) engine = innodb partition by range (TO_DAYS(created))(
PARTITION foo_1 VALUES LESS THAN (TO_DAYS('2016-10-18')),
PARTITION foo_2 VALUES LESS THAN (TO_DAYS('2017-01-01'))
);
//新增一个分区
ALTER TABLE foo_range ADD PARTITION(
PARTITION foo_3 VALUES LESS THAN (TO_DAYS('2017-10-18'))
);
//插入数据
insert into `foo_range` (`id`, `created`) values (1, '2016-10-17'),(2, '2016-10-20'),(3, '2016-1-25');
//查询
explain partitions select * from foo_range where created = '2016-10-20';
```

### 操作

+ 删除数据和分区 `alter table $tableName drop partition p1`
+ 删除所有分区，但保留数据 `alter table $tableName remove partitioning`
+ 添加分区 `alter table add partition(partition p2 values less than (4000))`


## 管理用户<https://dev.mysql.com/doc/refman/5.7/en/create-user.html>

`create user 'abc@%' identified by passwd`
`GRANT ALL PRIVILEGES ON *.* TO 'UserName'@'%' IDENTIFIED BY 'passwd' WITH GRANT OPTION;`
`FLUSH PRIVILEGES;`

## InnoDB行存储<https://dev.mysql.com/doc/refman/5.7/en/innodb-row-format-overview.html>

* 单个磁盘页的行数越多，查询和索引的查找越快，buffer池所需要的cache越少，IO也用的更少。
* 表中的数据分割成页，页组织在一个B树索引中。表数据和二级索引都用这种结构。
* 代表整张表的B树索引就是索引簇，根据主键列来组织。
* 索引数据的节点，clustered index包含了所有的列；secondaryindex包含了索引列和主键。
* 可变长度的列如`BLOB`，`VARCHAR`, 如果太长，将存储在另外分配的overflow页。这种列叫off-page页。

`SHOW TABLE STATUS IN Test1\G`
`SELECT NAME, ROW_FORMAT FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test1/t1';`
显示行结构, 为表保留的物理空间

* redundant格式，可与旧版本兼容
* compact格式，比redundant减少20%存储空间，有些操作增加cpu的消耗。如果工作中的效率取决于缓存的命中率或者磁盘的速度，那么compact就会更快，否则可能更慢
* dynamic格式。和compact格式一样，对于变长字段，使用off-page，其clusterindex只存储一个20字节长的指针指向overflow page. 它保留了存储整行数据到index node的优点，但是避免了把长字段塞入B树节点。基于这样一个思想：存储一个长字段的一部分到off-page,不如全部存储到off-page.

## mysql 内存配置
<https://www.percona.com/blog/2016/05/03/best-practices-for-configuring-optimal-mysql-memory-usage/>
<https://www.percona.com/blog/2018/06/28/what-to-do-when-mysql-runs-out-of-memory-troubleshooting-guide/>

缺省安装的内存使用配置很少。

* 避免mysql引起操作系统使用swap。 `vmstat`可以查看`si`,`so`. 如果有些没用的程序，用了swap文件，清除掉。
* mysql内存复杂，有全局buffer，连接buffer, 以及存储过程中内存的分配。
* 可以保留设置全局buffer和连接buffer, ` innodb_buffer_pool_size =  innodb_buffer_pool_chunk_size * innodb_buffer_pool_instances 的整数倍`。 如果不是整数倍，则调整为整数倍<https://dev.mysql.com/doc/refman/5.7/en/innodb-buffer-pool-resize.html>

## 主从配置

<http://dbadiaries.com/how-to-set-up-mysql-replication/>

## 索引与查询

<http://blog.jobbole.com/86594/>

* 优化explain中的rows
* 最左匹配, 范围谓词在索引中放到最后；索引区分度要高，不要参与运算，多做扩展索引。

<https://blog.csdn.net/qingsong3333/article/details/78012537>
Clustered Index：
每一个InnoDB表都有一个特殊的索引，叫做clustered index，通常来讲，clustered index和primary key是同一个意思，InnoDB选择clustered index原则如下：

-如果表上定义了primary key，则使用primary key作为clustered index
-如果没有定义primary key,选择第一个非空的UNIQUE索引作为clustered index。所以，如果表只有一个非空的UNIQUE索引，那么InnoDB就把它当作主健了。
-如果即没有primary key,也没有合适的UNIQUE索引，InnoDB内部产生一个隐藏列，这个列包含了每一行的row ID, row ID随着新行的插入而单调增加。然后在这个隐藏列上建立索引作为clustered index。

Secondary Index：
除了Clustered Index之外的索引都是Secondary Index，每一个Secondary Index的记录中除了索引列的值之外，还包含主健值。通过二级索引查询首先查到是主键值，然后InnoDB再根据查到的主键值通过主键/聚簇索引找到相应的数据块。

<https://www.jianshu.com/p/f38f2387a20e>索引的类型
<https://zhuanlan.zhihu.com/p/40820574>
<https://stackoverflow.com/questions/8213235/mysql-covering-vs-composite-vs-column-index>


## 最大化内存使用

<https://serverfault.com/questions/42789/how-to-increase-memory-usage-in-mysql-server-to-improve-speed>

server-system-variable mysql
<https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html>

* `show status`看看open_tables, 
* `key_buffer_size`
* `sort_buffer, read_buffer`
* `innodb_buffer_pool_size `

<http://www.oicto.com/mysql-db-raid/>

<https://www.zhihu.com/question/68568916>

<https://www.cnblogs.com/demon89/p/mysql_optimization.html>


## articles

### limits of mysql

<https://www.gridgain.com/resources/blog/5-limitations-mysql-big-data>

1， 大型系统中，RAM中的缓存数据很大，每秒应对百万级的请求，Mysqlm没有很强的基于内存的搜索引擎。面对高访问量的数据表现出速度上的延迟。
通常使用Memcached或者Redis用做热点数据的缓存，来消除sql解析和事物上的压力。同时使用线程池，当然线程池只对并发的查询有帮助。

 2，
 大容量数据的处理。mysql开始作为单节点来设计，没有现代数据中心的概念。如今的大型mysql安装必须依赖分片，或者把数据分布到多个节点实例上来实现。但是分片带来一定的复杂度，如果数据必须跨越多个实例，分片的优势就没有了。
如果使用分片，有一些其他的工具如youtube的Vitess,ProxySQL,等方案。

3， volatile data

4， 大容量数据的复杂查询，Mysql的支持不好。优化器一个线程执行一个查询，不能使用多核，或者跨越多个节点的分布式查询。

大规模的数据处理，使用外部的方案来实现，比如Hadoop,或者Spark.用于数据分析方案。

5， 全文搜索

可以处理一些基本的文本搜索，但因为不具备并行处理能力，当数据量增大，搜索变慢。
不使用模糊查询，限制使用范围查询。
如果数据量确实很大，使用Elasticsearch, Apache Solr来进行全文搜索。


两个趋势：

大规模数据处理出现两个主要的趋势：
1， 全内存计算和缓存。这个概念有了40年，现在它作为实时数据处理的方案，已经逐渐成为了标准的操作流程。内存运算时速度的关键。以后磁盘只是用作历史的备份，全内存存储的应用解决方案可能不久便能流行。

2，内存价格下降。
数据的实时处理和分析，需要大量内存。现在一个T的内存价格只需要2万美元，企业可以轻松负担。

### mysql big data storage

<https://www.quora.com/Which-database-should-we-use-for-big-data-storage-MySQL-Apache-Solr>

存储不是问题，对于查询要做好索引。


## best practise

<http://bigdata-madesimple.com/top-10-best-practices-in-mysql/>

正确的数据类型：Datetime， char(1), YYYY-MM-DD, 索引上不要用函数，慎用order by,select *, 读为主，用myisam, 写为主，用innodb. 用exists检查是否存在

## 10 essencial performance tips

<https://www.infoworld.com/article/3210905/sql/10-essential-performance-tips-for-mysql.html>

索引的作用：让找到一组相邻行，而不是单个行；读取时直接排序避免sort；直接从索引拿到数据，不用找表。

### server config for performance

<https://www.percona.com/blog/2018/07/03/linux-os-tuning-for-mysql-database-performance/>
<https://www.databasejournal.com/features/mysql/mysql-tuning-for-large-datasets.html>
