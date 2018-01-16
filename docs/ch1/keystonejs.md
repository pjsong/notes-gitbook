# keystone

## 安装步骤

[参考](http://keystonejs.com/getting-started/)

1.`npm config set proxy http://x.x.x.x:y`
2.`npm config set https_proxy https://x.x.x.x:y`
3.`sudo npm i -g generator-keystone yo --registry https://registry.npmjs.org`
4.`yo keystone`, 如果遇到问题,`npm config set registry https://registry.npmjs.org`
5.docker运行mongo
  1.`docker create -v /mongo-data --name mongodata mongo /bin/true`
  2.`docker run -d --volumes-from mongodata --name mongo-keystone mongo`
  3.`docker run -d --volumes-from mongodata --name mongo-general-db mongo`
  4.开发环境，把端口/服务暴露给主机
  5.`docker run -d -p 27017:27017 -p 28017:28017 --volumes-from mongodata --name mongo-keystone --restart unless-stopped mongo mongod --rest --httpinterface`
  6.`docker exec -it mongo-keystone mongo`进入shell，mongo后面可以跟数据库名。[mongo of dockerhub](https://hub.docker.com/_/mongo/)
6.`node keystone`

## 问题

### [jade警告的问题](https://github.com/keystonejs/keystone/issues/2610)：

npm i --save pug, 然后再keystone.init中设置view engine

### [Cannot find module 'unicode/category/So](https://github.com/dodo/node-slug/issues/58) 

+ `sudo apt-get install unicode-data` 
+ `npm install unicode`

## 项目

[参考](https://leanpub.com/keystonejs/read)

### 用dotenv加载环境配置数据

+ 应用收到请求时，该文件中的变量加载到process.env全局对象。
+ 把keystoneJs部署生产环境时，在文件中设置`NODE_ENV=production`,使keystonejs的许多功能如template cache等生效
+ 代码访问用 `var madrillApiKey = process.env.MANDRILL_API_KEY;`
+ 该文件不推荐版本控制。

### 项目结构

+ models，项目用到的数据模型
+ public，应用的静态内容，图片，css，js，font
+ routes，
  + index.js初始化routes(相当于servlet)和已关联的views。routes负责响应http各类操作，包括http协议，url pattern, template三部分。
  + middleware.js.相当于servlet中的filter，在routes前后触发。
  + api，暴露rest接口的控制器。
+ views，负责routes的响应，结合model提交template。相当于java mvc中的controller。
+ template.提交给routes的html模板。
+ layouts包含一些主页面内容如header，footer

### 创建list/model

+ list/model： model是Javascript对象，属于Keystone.List的一个实例, models文件夹中每一个model，keystonejs都会创建一个collection。attribute代表field。 model创建后，keystone有api用Mongoose.js来查询数据库。
+ 类似于关系数据库中的表
+ [参考](http://keystonejs.com/docs/database/#fieldtypes).
+ 编辑modules目录下文件Ticket.js后，重启node keystone.
  + 错误：Cannot find module '../build/Release/bson'。原因：找不到bson的native c++插件，于是采用js实现。不影响功能，可以去掉这个打印。
  + 错误：ReferenceError: Datetime is not defined. 页面上代码的Datetime掉了Types., 加上去就好了。
+ 可以看到mongo中collections多了一个叫Ticket的list/model。接下来用内置的模型管理接口来创建管理站点。
+ 创建管理账号。update framework用于数据初始化，转换数据，执行脚本。generator的账户就是用它来创建的。代码文件在项目根目录updates/0.0.1-admin.js。
+ 第一次使用空数据库的时候，该脚本自动创建admin账号。每次启动时执行一次，但不会应用两次，因此只要执行过keystone， 编辑该文件不会影响账号使用。但是我们可以通过admin站点来更改。
+ 打开`http://127.0.0.1:3000/keystone/signin`, 登录进去看到2个list。进入user可以修改邮箱和密码。
+ 在/keystone.js文件中查找`keystone.set('nav'`, 添加菜单。
+ model中的Ticket.register方法把list注册到keystone并完成配置。创建一个title为first ticket，会返回一个24位唯一object id,可以编辑保存删除。
+ 列表页添加显示字段。在Ticket.js中增加行`Ticket.defaultColumns = 'title|20%, status|15%, createdBy, assignedTo, createdAt'`;defaultColumns默认只显示ID，还有别的选项如`Ticket.defaultSort = '-createdAt';`。 还可以在ui上增加显示列。
+ 查找。默认查找autokey中from字段，在定义autokey的下面还可以加上`searchFields: 'description',`, 如果只有一条记录则进入直接进入编辑界面
+ 使用filter可以使用多个条件来过滤结果。

## 创建路由

路由负责把url映射到js函数。存储在/routes/index.js,在其中添加以下代码

```javascript
  app.get('/tickets', function(req, res){
     res.send('We will show a list of tickets here');
  });
```

或者带参数

```javascript
app.get('/tickets/:ticketslug', function(req, res){
    res.send('We will show a ticket that has a slug : ' + req.params.ticketslug);
});
```

## model的url

以上的url不是模型的一部分，为了解决每次都要通过参数手动绑定url的问题，我们为Ticket对象用url虚拟函数构建了一个标准url，就是在Ticket.js中,register之前添加代码

```javascript
Ticket.schema.virtual('url').get(function() {
  return '/tickets/'+this.slug;
});
```

schema指向mongoose的schema，这个函数在数据库中不会持久化。

## 创建view

keystone中的view是一个附加在keystone.View对象上的js函数，位置在/routes/views.
新建文件夹tickets里面放singleticket.js和ticketlist.js.
注意Ticket model中slug有唯一约束，这样保证给定title的slug只有一个。

## 为view创建模板

+ 在default.jade中添加`link(href="/style/inctickeet.css" rel="stylesheet")`,作为全局css.
+ 完成ticketlist.jade文件， route中添加`app.get('/tickets', routes.views.tickets.ticketlist)`

## 填补css文件

<http://stackoverflow.com/questions/13824918/how-to-style-my-unordered-list-like-a-table>
<http://stackoverflow.com/questions/13824918/how-to-style-my-unordered-list-like-a-table>

```javascript
ul[class="ticket-meta"]{

}
```

## css 选择器

<https://www.w3.org/community/webed/wiki/Advanced_CSS_selectors>

html转jade

+ <http://html2jade.aaron-powell.com/>

jade转html

+ <http://fiddlesalad.com/jade/>
