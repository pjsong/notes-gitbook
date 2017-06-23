[手册](docs.mangodb.com/manual/)
[docker build](docs.docker.com/engine/examples/mongodb/#building-the-mongodb-docker-image)

## 1， 运行MongoDB
###开始
#####Docker 运行[参考](hub.docker.com/_/mongo/)

    sudo docker run --name vendor-mongo --network omd-network --ip 172.18.0.150 -d -p 27017:27017 --restart=unless-stopped mongo --replSet vendor-mongo-set
    sudo docker exec -it vendor-mongo mongo admin
    db.createUser({user:'user', pwd: 'pwd', roles:[{role: "userAdminAnyDatabase", db: "admin"}]})
    mongo --port 27017 --host 172.18.0.150
    
######Disable THP(Transparent Huge Page)
    FROM MONGO
~~RUN sed -r 's/GRUB_CMDLINE_LINUX_DEFAULT="[A-Za-Z0-9_=]*/& transparent_hugepage=never/' /etc/default/grub~~
    
#####安装robomongo    
windows 下连接主机
#####linux [参考](askubuntu.com/question/739297/how-to-install-robomongo-ubuntu-system-please-let-me-know/781793)
    tar -zxfv robomongo-xxxx.tar.gz
    cd robotmongo-xxxx && ./robomongo
    
#####指令[参考](www.tutorialspoint.com/mongodb)
    
    db.help();  db.stats(); use dbname; db; show dbs; db.dropDatabase(); 
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
    
#####Auth
    use admin
    db.createUser({user:"pjsong", pwd: "pjsong3101", roles: [{role:"userAdminAnyDatabase", db: "admin"}]})