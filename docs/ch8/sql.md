## 开窗 mysql不支持

```sql
select ancestor, max(length) over () from distributor_rel

explain select * from distributor_rel dr where dr.length=(select max(length) from distributor_rel) 




