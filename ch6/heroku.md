## heroku

[文档中心](https://devcenter.heroku.com/articles/getting-started-with-java#set-up)

##安装/配置
###安装toolbelt
+ unix
先安装Ruby `sudo apt-get install ruby`
再安装toolbelt `wget -O- https://toolbelt.heroku.com/install-ubuntu.sh | sh`
###配置代理
+ unix 
<pre>
$ export HTTP_PROXY=http://proxy.server.com:portnumber
or
$ export HTTPS_PROXY=https://proxy.server.com:portnumber
</pre>
+ windows
<pre>
> set HTTP_PROXY=http://proxy.server.com:portnumber
or
> set HTTPS_PROXY=https://proxy.server.com:portnumber
</pre>

### 使用命令行
1. `git clone https://github.com/heroku/java-getting-started.git`并进入该目录
2. `heroku create appName` ，创建app， 同时会一个remote git, 与本地git同步
3. `git push heroku master`进行部署
4. `heroku ps:scale web=1`确认实例运行
5. `heroku open` 直接打开站点
6. `heroku logs --tail`查看日志
7. 定义Procfile.该文件在项目根目录，直接指定启动程序要运行的命令。
  + `web: java -jar target/helloworld.jar`,进程类型: 运行该进程需要的命令。 
  + 进程类型重要，因为附加在heroku的http routing stack，部署后要接收web traffic的。
  + 可以包含多个进程类型，比如后台的worker进程，处理任务队列
8. dyno
  + `heroku ps`现在app在dyno(运行Procfile中指令的容器)上运行， 用ps检查有多少个dyno在运行. 
  + `heroku ps -a appName` 免费dyno在半小时无活动后休眠，每个账号每个月550小时。信用卡验证后，总体增加450个小时。
  + `heroku ps:scale web=0` 关闭dyno
  + `heroku ps:scale web=2` 打开2个dyno(多于1个要验证)
9.  sytem.properties指定jvm版本`java.runtime.version=1.8`
10.  本地运行herku。<br>
    `mvn clean install`<br>`heroku local web`<br>`http://localhost:5000`<br>
    heroku local通过Procfile确定运行什么命令。
11. 程序使用第三方服务Provision add-ons.

