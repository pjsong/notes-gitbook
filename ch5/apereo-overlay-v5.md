# 安装apereo-cas-overlay
[官方参考](https://apereo.github.io/cas/development/installation/Maven-Overlay-Installation.html)

## 原文翻译

###### CAS的安装本质上是面向源代码过程。并且推荐用war overlay的方式来组织配置。war-overlay的输出就是一个可以部署到servlet container的war包。

+ gradle [github](https://github.com/apereo/cas-gradle-overlay-template)
+ maven [github](https://github.com/apereo/cas-overlay-template)

普遍在overlay通过实现了CAS API的第三方组件来定制行为。或者是依赖方式，或者java源文件。

CAS使用spring webflow来驱动登陆的过程，`login-webflow.xml`文件有关于这个flow的直观描述。在spring xml配置中除了组件，就是这个最普遍了。

###### spring 的配置模式有两种，可以同时使用。

+ xml方式。 `deployerConfigContext.xml`是overlay配置cas环境基本要碰到的。·
+ groovy方式。 cas的应用context能够装入`deployerConfigContext.groovy`. 一些高级使用场景，CAS bean可以用groovy脚本动态定义。同时这样的定义还能在`deployerConfigContext.xml`中定义。这定义直接从groovy脚本读取，且改动被监视。

###### 项目结构
<pre>
├── src
│   ├── main
│   │   ├── java
│   │   │   └── edu
│   │   │       └── vt
│   │   │           └── middleware
│   │   │               └── cas
│   │   │                   ├── audit
│   │   │                   │   ├── CompactSlf4jAuditTrailManager.java
│   │   │                   ├── authentication
│   │   │                   │   └── principal
│   │   │                   │       └── UsernamePasswordCredentialsToPrincipalResolver.java
│   │   │                   ├── services
│   │   │                   │   └── JsonServiceRegistryDao.java
│   │   │                   ├── util
│   │   │                   │   └── X509Helper.java
│   │   │                   └── web
│   │   │                       ├── HelpController.java
│   │   │                       ├── flow
│   │   │                       │   ├── AbstractForgottenCredentialAction.java
│   │   │                       └── util
│   │   │                           ├── ProtocolParameterAuthority.java
</pre>


###### 依赖管理
+ 每个cas的发布都有自己的依赖，更新cas会自动更新这些依赖。
+ 要项目继承这些依赖，设置parent如下
>
    <parent>
    <groupId>org.apereo.cas</groupId>
    <artifactId>cas-server-support-bom</artifactId>
    <version>${cas.version}</version>
    </parent>

+ 5.0版本
>  
    <artifactId>cas-bom</artifactId>

 如果不想用`cas-server-support-bom`作为parent，可以先放上自己的依赖，再用`scope=import`依赖`cas-server-support-bom`
<pre> 
&lt;dependencyManagement>
&lt;dependencies>
         &lt;dependency>
            &lt;groupId>org.group&lt;/groupId>
            &lt;artifactId>artifact-name&lt;/artifactId>
            &lt;version>X.Y.Z&lt;/version>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.apereo.cas&lt;/groupId>
            &lt;artifactId>cas-server-support-bom&lt;/artifactId>
            &lt;version>${cas.version}&lt;/version>
            &lt;type>pom&lt;/type>
            &lt;scope>import&lt;/scope>
        &lt;/dependency>
    &lt;/dependencies>
&lt;/dependencyManagement>
</pre>


######gradle方式
[参考](https://plugins.gradle.org/plugin/io.spring.dependency-management)


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
###步骤
+ 将etc目录拷贝到根目录`/etc/cas/config`
+ mvn package打包成war
+ 运行调试
`java -Xdebug -Xrunjdwp:transport=dt_socket,address=5000,server=y,suspend=n -jar target/cas.war` 

> 问题1. 找不到thekeystore文件
> 把thekeystore拷贝到/etc/cas目录下。
> keystore文件新生成参考指令:
> <pre> keytool -genkey -alias casKeystore -keysize 2048 -keyalg RSA -keystore /etc/cas/thekeystore
</pre>
> 查看keystore里面的entry
> <pre>keytool -list -keystore /etc/cas/thekeystore
</pre>
> 具体查看某个entry
> <pre>keytool -list -v -alias casKeystore -keystore /etc/cas/thekeystore</pre>
> 删除entry
> <pre>keytool -delete -alias casKeystore -keystore /etc/cas/thekeystore</pre>
> 改密码
> <pre>keytool -keypasswd -alias casKeystore -keystore /etc/cas/thekeystore</pre>
> 创建申请服务器证书需要的证书签名请求CSR
> <pre>keytool -certreq -keyalg RSA -alias casKeystore -file certreq.txt -keystore /etc/cas/thekeystore</pre>
> 导出证书给客户端安装
> <pre>keytool -export -alias casKeystore -keystore /etc/cas/thekeystore -file d:\mycerts.cer -storepass changeit</pre>
> 客户端导入
> <pre>keytool -import -trustcacerts -alias casKeystore -keystore "%JAVA_HOME%/JRE/LIB/SECURITY/CACERTS" -file d:\mycerts.cer -storepass changeit</pre>
> 检查导入是否成功
> <pre>keytool -list -alias casKeystore -keystore "%JAVA_HOME%/JRE/LIB/SECURITY/CACERTS" -storepass changeit</pre>

> 问题2，密码校验失败
> 默认war在tomcat中运行，需要配置tomcat的ssl，但这个配置在web-app server，使用[overlay](http://maven.apache.org/plugins/maven-war-plugin/overlays.html)插件实现。 overlay的作用是在多个webapp中共享资源。通常一个war项目的依赖在WEB-INF/lib，除非他本身overlay了这个war项目。
> 在overlay项目src/main/resources/application.properties添加相应内容
> <pre>
> server.context-path=/cas
server.port=8443
server.ssl.key-store=file:/etc/cas/thekeystore
server.ssl.key-store-password=changeit
server.ssl.key-password=changeit
> </pre>


+ 运行调试问题，[参考](https://github.com/apereo/cas/issues/1899)
<pre>
Failed to process @EventListener annotation on bean with name 'servicesManager'; nested exception is java.lang.IllegalStateException
</pre>
用了JRebel有， 
+ 直接运行 
+ 访问https://localhost:8443
+ 