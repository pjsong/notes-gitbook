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
