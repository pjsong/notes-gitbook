#Eclipse下调试

## 使用remote debug场景
+ 本地调试没问题，但远程服务器上就是有问题。
+ java服务器程序一般都在linux上运行，但开发环境都是windows+eclipse, 
+ java项目有些平台依赖包，如linux某个模块，

## 怎样使用remote debug
使用远程服务调试，要配置`Remote Java Application`的启动。这个启动因为不在远程，因此只是怎么连接到服务器的内容，没有程序参数，虚拟机参数之类的东西。

##一般调试手段
+ java 环境直接用junit
+ 用mvn插件.
  + 直接debug as-> debug configuration中运行mvn的goal
+ 用service wrapper
  + debug模式启动server
+ 远程模式
  + 在service wrapper的服务器上启动加上配置(**要放到配置开头处**)
  `-Xdebug `<br>
  <del>`-agentlib=`</del><br>
  `	-Xrunjdwp:`<br>
  ` transport=dt_socket,server=y,address=8000,suspend=n`，再在项目上配置端口运行。
  + 不用wrapper, 用IDE外开启terminal，配置tomcat，运行实例。 Gradle项目cas用gretty插件。gradle方式[参考](ch3/build-gradle.md)
  
    

+ 参数说明
  + `-Xdebug`开启调试模式

  + `-Xrunjdwp`使用jdwp(java debug wire protocal)发布调试信息,开启服务器socket端口8998

  + `suspend`java进程是否等待，直到远程连接到调试端口。如果为`n`, 也能调试服务器启动进程

  + `server`开启socket端口并监听调试请求。如果为`n`, 应用程序主动连接到调试器，并作为客户端运行。

  + `-jar myapp.jar` 启动myapp.jar

+ 

###2. eclipse下的配置
可以参考 [eclipse step by step](http://help.eclipse.org/mars/index.jsp?topic=%2Forg.eclipse.jdt.doc.user%2Ftasks%2Ftask-remotejava_launch_config.htm)



