# Docker安装

######web path pattern
+ 精确匹配 `/aa/b.html`
+ 扩展名匹配 `/*.png`
+ 路径匹配 `/`打头，`/*`结尾
+ 缺省匹配 `/`


######从host加载文件
<pre>
FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/conf.d/example_ssl.conf
COPY html /usr/share/nginx/html
COPY conf /etc/nginx
</pre>

`docker exec -it 7b93xx bash`进入容器

<pre>
`docker build -t nginx_conf_html .`
`docker run --name nginx_conf_html -p 80:80 -p 443:443 -d nginx_conf_html`
`docker run –-name mynginx -p 80:80 -p 443:443 -v /var/www:/usr/share/nginx/html:ro -v /var/nginx/conf:/etc/nginx:ro -d nginx`
</pre>

######启动
`docker run –name nginx-default -p 80:80 -p 443:443 -d nginx`

######备份
<pre>
docker cp nginx-default:/etc/nginx/nginx.conf ./conf/nginx.conf
docker cp nginx-default:/etc/nginx/conf.d ./
cp ./conf/nginx.conf ./conf/nginx.conf.backup.
</pre>

#配置
#####SSL配置
[原文](http://nginx.org/en/docs/http/configuring_https_servers.html)

######代码
总共也就4行
<pre>server {
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.crt;
    ssl_certificate_key www.example.com.key;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ...
}</pre>
其中，证书/私钥可以放到同一个文件。只要保证服务器进程有权限能访问。protocols/ciphers都是缺省值，不用写。

#######优化
握手过程最耗cpu，worker进程要比cpu的core要多。为针对用户减少操作，1，打开keepalive, 用一个连接处理多次请求。2，重用ssl会话参数，避免平行/顺序到来的连接建立握手。SSL会话缓存被works共享，SSL session cache来配置，1M的缓存能放4000个session。ssl session timeout可以配置时间，缺省5秒。
<pre>http {
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    server {
        listen              443 ssl;
        server_name         www.example.com;
        keepalive_timeout   70;

        ssl_certificate     www.example.com.crt;
        ssl_certificate_key www.example.com.key;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        ...
</pre>

######证书链
有些浏览器支持自签名的证书，有些有问题。这是因为，有一个针对特定浏览器发行的知名、可信的授权证书基础，发行方使用了非证书基础中的立即证书来签名服务器证书。
这时，授权方提供一bundle的证书链，链里的证书连接到已签名的服务器证书。在合并文件服务器证书要出现在证书链之前。
`$ cat www.example.com.crt bundle.crt > www.example.com.chained.crt`
使用证书
<pre>server {
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.chained.crt;</pre>
要确保服务器发送整个证书链，可以用openssl检查
`$ openssl s_client -connect www.godaddy.com:443`

######单个http/https服务器
能同时处理两种请求
<pre>server {
    listen              80;
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.crt;
    ssl_certificate_key www.example.com.key;
    ...
}</pre>
有了listen, 因此现在不用使用ssl directive了。

#####多个https server在同一个ip上监听
注意证书不同，端口一样。
<pre>server {
    listen          443 ssl;
    server_name     www.example.com;
    ssl_certificate www.example.com.crt;
    ...
}

server {
    listen          443 ssl;
    server_name     www.example.org;
    ssl_certificate www.example.org.crt;
    ...
}
</pre>
这时使用缺省证书。解决方法参考原文。
######项目配置
[原文](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04)

+ `sudo mkdir /etc/nginx/ssl`
+ `sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt`
  + openssl:管理/创建证书/key的工具
  + req：用什么证书签名请求(CSR,), X.509是一个SSL/TLS接受的，管理其key/cert的public key infrastructure.我们要创建一个X.509证书.
  + -x509: 用自签名证书而不是创建证书签名请求。
  + -nodes: 跳过passphass步骤。我们需要nginx每次起来都能自动读取证书，无需干预
  + -days： 有效期
  + -newkey： 还同时生成key，用于签名证书
  + -keyout：创建的private key 文件放哪儿
  + -out: 创建的证书放哪儿

接下来对话框输入，注意CommonName, 域名。本地用localhost，没有域名用ip。跟server配置的server_name一致

#####proxy配置
  <pre>
location /ssb/ {
  root  /PATH/TO/YOUR/WEB/APPLICATION;
  proxy_pass        http://localhost:8080/;
  proxy_set_header  X-Real-IP $remote_addr;
  proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header  Host $http_host;
}
</pre>
注意path都是`/`打头，`/`结尾的

#####springboot配置
<pre><yaml>server:
  use-forward-headers: "true"
</yaml></pre>


[原文](https://www.digitalocean.com/community/tutorials/understanding-the-nginx-configuration-file-structure-and-configuration-contexts)
#####路径
`/etc/nginx/nginx.conf`,如果不是，就是`/usr/local/nginx/conf/nginx.conf`或者`/usr/local/etc/nginx/nginx.conf`

1. nginx由`{context}`的树型机构组成。
2. context有自己的directive，directive具有继承特性，为子context的缺省值。子context可以重载这些值。directive不能用错context.
3. [结构](http://nginx.org/en/docs/beginners_guide.html), nginx由directive控制的模块组成。directive分为简单directive和块directive。简单directive有name parameter;这样的结构，块directive由`{}`作为parameter，也就是context。
4. 如果Directive不在任何块中，他就属于global/main context,`events` , `http` 在main context, `server` 在 http,  `location` 在 server.
5. #注释
6. nginx的文件保存不同的位置，这就需要编辑配置文件设置两个location. 
7. 一般配置文件包含多个server块，由他们监听的端口和服务器名字区分。一旦nginx确定哪个服务器来处理请求，就检查请求头里面的URI和配置的location参数。比如<pre>`location / {
    root /data/www;
}`</pre>指定`/`前缀，映射到本地/data/www/。如果多个location都能匹配，nginx选择最长的前缀。上面的例子只有在所有的匹配都失败才会找他。
8. `nginx -s reload`重新装入nginx
9. `/usr/local/nginx/logs`或者`/usr/local/nginx/logs`路径下日志查看`error.log`,`access.log`

##简单代理配置
1. 把图片之外的请求给代理服务器。两个服务器定义在一个nginx实例上。
2. 首先增加一个server
<pre>server {
    listen 8080;
    root /data/up1;
    location / {
    }
}</pre>之前的server没有listen是因为缺省使用标准端口80。这个server监听8080并把所有的请求都映射到本地文件的/data/up1目录。这个地方使用root是让所有的location继承。
3. 接下来改成代理服务器配置。
<pre>server {
    location / {
        proxy_pass http://localhost:8080;
    }
    location /images/ {
        root /data;
    }
}</pre>
接着修改第二个location<pre>`location ~\.(gif|jpg|png)$ {
    root /data/images;
}`</pre>正则表达式匹配所有的.gif|jpg|png文件， ~是正规表达式中的开始符。

##配置说明
[原文](https://www.nginx.com/resources/wiki/start/topics/examples/javaservers/)

##另开
[haproxy](http://cbonte.github.io/haproxy-dconv/intro-1.7.html)
