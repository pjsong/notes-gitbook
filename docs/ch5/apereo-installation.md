# 安装apereo-cas-overlay
[官方参考](https://apereo.github.io/cas/development/installation/Maven-Overlay-Installation.html)
---
## 1. 安装
### 1.1.1. 安装4.2.2
请参考[博客](http://www.pengzz.cn/2016/06/apereo-cas-branch-422_23.html)

### 1.1.2 安装 5.0
####原则
+ 保证官方template独立
+ 敏感信息进入private库，依赖方式使用官方template

####方法
+ 当overlay出现新的版本，private库开相应的分支

####使用vagrant
+ vagrant init并编辑.Vagrant文件
+ mkdir project，并在project内clone项目,  
>  `git clone --branch https://github.com/apereo/cas-overlay-template.git`

+ vagrant up并ssh进去安装java.

<pre>sudo apt-get install python-software-properties
 sudo apt-get install software-properties-common
 sudo add-apt-repository ppa:webupd8team/java
 sudo apt-get update
 sudo apt-get install oracle-java8-installer
</pre>

+ guest里面安装git `sudo apt-get install git` 因为两边的换行字符不一致，guest里面需要git来reset 一下。
+ 增加虚拟机内存，cpu
<pre>  
config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 2
  end
</pre>
再reload

+ 如果修改了Vagrant文件,退出guest机器并运行`vagrant reload --provison` 再ssh进去
+ 原始的cas路径下没有thekeystore文件，用指令[查看以前的keystore文件](https://www.sslshopper.com/article-most-common-java-keytool-keystore-commands.html) `keytool -list -v -keystore thekeystore`

reload之后可以直接ssh


--------
###警告信息
+ `Secret key for signing is not defined. CAS will attempt to auto-ge nerate the signing key`
> [参考](https://apereo.github.io/cas/development/installation/Configuring-SSO-Session-Cookie.html)。 当CAS建立一个会话，就会设置一个ticket-granting cookie，这个cookie维护client的登陆状态，当会话有效，client就把cookie作为主要的Credentials给CAS。参考[CAS协议](https://apereo.github.io/cas/development/protocol/CAS-Protocol.html)

> cookie值与活跃的ticket-granting ticket，远程请求的ip，以及agent关联。最后的cookie值然后加密并签名。

> 这些key必须根据你的具体环境重新生成。每个key是个根据用来加密/签名的算法定义好的长度的JSON Web Token。
> 
> 如果key不是部署生成，CAS会自动生成key，并输出每个key的结果。部署人必须拷贝生成的key到application.properties里面,用来加密和签名。
[配置参考](https://apereo.github.io/cas/development/installation/Configuration-Properties.html)
如果要手动生成key,使用[工具](https://github.com/mitreid-connect/json-web-key-generator)

> 如果不要cookie加密, `cas.tgc.cipherEnabled=false`, 但仍然会log warn信息，并生成两个key
> 
> 如果需要，
> <pre>cas.tgc.signingKey = lHgAE9T3x513RWfmIazONfbgsuWTCCD3GWc7uQ2hjGQD L9zwr_DXp_7Q4Bm5--nbcAi--ZRUstk0k45zSQUKIw
cas.tgc.encryptionKey = inwWKvabPbPJsyzL
</pre>




---
### spring配置
`spring-configuration`目录下的文件控制cas各种属性。
`cas-servlet.xml 和 deployerConfigContext.xml`也是在overlay中用于配置环境设置。<br>overlay中使用同样的路径和名字，maven能覆盖缺省的xml。服务器能够装入一定模式的配置文件来覆盖缺省，这些文件可以放在`/WEB-INF/`下，以`cas-servlet-*.xml`命名。这里面定义的bean能覆盖缺省实现。

### Docker 
`docker pull apereo/cas:v[A.B.C]`
[github](https://github.com/apereo/cas/tree/dockerized-caswebapp)