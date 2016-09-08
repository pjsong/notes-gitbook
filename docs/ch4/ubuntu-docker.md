# docker下常用软件安装

## docker指令

[参考pengzz.cn博客](http://www.pengzz.cn/2016/06/docker-build.html)<br>
[参考oursmedia.net博客](http://oursmedia.net/wordpress/index.php/2016/06/03/docker-cheatsheet/)

---
## docker 更新
[ref](https://docs.docker.com/cs-engine/upgrade/)
$ sudo apt-get update && sudo apt-get upgrade docker-engine

## mysql
[参考pengzz](http://www.pengzz.cn/2016/06/mysqldatavolumndocker.html)

+ docker run --name cas-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d --restart unless-stopped mysql:latest 
+ docker exec –it 02061ddf0a3d1b2806a1ee6e354f4064d9d2ff4d84d8c96c0273c8883917a92f bash
+ $ docker logs some-mysql
+ docker inspect some-mysql
+ docker run --link cas-mysql:mysql --rm mysql sh -c 'exec mysql -h "ip.from.inspect.withquote OR container-name" -P "3306" -uroot -p' 

---
## mongodb
[参考docker](https://hub.docker.com/_/mongo/)<br>
[参考github](https://github.com/docker-library/mongo)

+ $ docker run --name some-mongo -d mongo
+ $ docker run --name some-app --link some-mongo:mongo -d application-that-uses-mongo
+ $ docker run -it --link some-mongo:mongo --rm mongo sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/test"'
+ $ docker run --name some-mongo -d mongo --auth
+ $ docker exec -it some-mongo mongo admin<pre>
+ `db.createUser({ user: 'jsmith', pwd: 'some-initial-password', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });`</pre>
+ $ docker run -it --rm --link some-mongo:mongo mongo mongo -u jsmith -p some-initial-password --authenticationDatabase admin some-mongo/some-db
`> db.getName();`
<pre>
db.updateUser(
   "&lt;username>",
   {
     customData : { <any information> },
     roles : [
               { role: "root", db: "&lt;database>" } | "&lt;role>",
               ...
             ],
     pwd: "&lt;cleartext password>"
    },
    writeConcern: { &lt;write concern> }
)
</pre>
+ `show dbs`,  `use dbname`, `show collections`