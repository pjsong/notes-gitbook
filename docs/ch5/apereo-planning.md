## [CAS协议](https://github.com/apereo/cas/blob/master/cas-server-documentation/protocol/CAS-Protocol-Specification.md)

## 架构
![架构](https://apereo.github.io/cas/development/images/cas_architecture.png)

##### 服务器
+ 通过发放,验证tickets, 来认证用户，授权服务访问。

+ 当用户成功登陆，服务器发放TGT(ticket-granting ticket )，此时创建一个SSO会话。

+ 当用户用TGT作Token, 通过浏览器重定向到服务时，发放ST(service ticket)给服务。

+ 接下来ST在CAS服务器处得到验证。

##### 客户端应用
+ 客户端通过多种支持的协议与服务端通信。概念上大体类似，不过特性不同如：CAS支持代理认证，SAML支持单点登出。
常见协议：CAS， SAML， OPENID CONNECT, OPENID, OAUTH,每个协议多个版本。

##### 服务器组件
+ WEB，主要是mvc, webflow, 同时使用了springboot, 

+ [Ticketing](https://apereo.github.io/cas/development/installation/Configuring-Ticketing-Components.html)

+ [Authentication](https://apereo.github.io/cas/development/installation/Configuring-Authentication-Components.html)



##### 玩家登陆游戏的[验证时序](https://blog.g4me.co.uk/2014/09/21/security-setup-cas-introduction/) 
1. 第一次登陆
  * 1.1. 玩家登陆游戏服务器登陆地址 `http://auth.mygame.com`
  * 1.2. 游戏服务器302到 `https://cas.g4me.co.uk/cas/login.html?service=http%3A%2F%2Fauth.mygame.com%2F`, 
  * 1.3. 浏览器 GET 该地址
  * 1.4. 玩家没有SSO会话，cas转到登陆页`https://cas.g4me.co.uk/cas/login.html?` 返回200
  * 1.5. 玩家post。 
  * 1.6. 成功cas创建SSO session，CASTGC cookie。这个cookie包含TGT，也就是SSO session的key。<pre>Set-Cookie: CASTGC=TGT-12345678
302: http://auth.mygame.com/?ticket=ST-12345678</pre>
  * 1.7. 浏览器302到`http://auth.mygame.com/?ticket=ST-12345678`，带上ticket参数。
  * 1.8. 游戏服务器`get https://cas.g4me.co.uk/serviceValidate?service=http%3A%2F%2Fauth.mygame.com%2F&ticket=ST-12345678`来验证ST(Service ticket) 。
  * 1.9. cas返回200和一段xml，xml包含成功标志，认证的主题，已配置好的一些可选属性。
  * 1.10. 游戏服务器设置session cookie(JSESSIONID=ABC12345678), 
  * 1.11. 浏览器再次forward到`https://auth.mygame.com`,不带ticket参数，避免在浏览器中显示。
  * 1.12. 游戏服务器校验session cookie, 成功则302到`http://www.mygame.com/home`

2. 第二次登陆同个应用
  * 2.1. get ` on http://auth.mygame.com `,JSESSIONID仍然有效。
  * 2.2. 服务器校验JSESSIONID,302到`http://www.mygame.com/home`

3. 第一次登陆另外一个应用
  * 3.1. 玩家 `GET: http://forum.mygame.com`
  * 3.2. 论坛服务器302到` https://cas.g4me.co.uk/cas/login.html?service=http%3A%2F%2Fforum.mygame.com%2F`
  * 3.3 浏览器 `GET https://cas.g4me.co.uk/cas/login.html?service=http%3A%2F%2Fforum.mygame.com%2F`
  * 3.4. cas校验TGT，无需登录，浏览器 `GET https://forum.mygame.com/?ticket=ST-12345678`
  * 论坛服务器通过 `GET https://cas.g4me.co.uk/serviceValidate?service=http%3A%2F%2Fforum.mygame.com%2F&ticket=ST-12345678`校验ST(Service Ticket)
  * ......后面与1.9开始相同。

## 安装必须

+ Java >=1.8
+ Servlet container supporting servlet specification >=3.1
+ Apache Maven >=3.3
+ Familiarity with the Spring Framework
+ Internet connectivity

## 安全考量

+ 服务应用和cas均https通信。
+ 部署驱动的安全特性
  + 强制验证。许多客户端/协议都支持强制认证,CAS协议通过renew参数支持。强制认证一般基于服务来配置，但service manager支持作为中心安全策略来配置。强制认证可以和multi-factor认证一起使用来实现特定服务的访问控制。
  + 被动认证。不需要认证，匿名许可，通过gateway来支持。
  + 代理认证。当服务不能直接域用户交互，代替用户认证的替代方案。 不过存在风险，接受proxy ticket的服务也负责校验proxy chain(为到达ticket validation服务，用户认证请求被代理的一组服务).一般推荐不需要的时候关闭这个功能。
  + Credential缓存/重提交。clearpass扩展提供这个机制。
  + 服务管理。提供特定服务的配置控制。比如
    + 1. Authorized services
    + 2. Forced authentication
    + 3. Attribute release
    + 4. Proxy authentication control
    + 5. Theme control
    + 6. Service authorization control
    + 7. Multi-factor service access policy

## 服务管理
+ 特定服务的配置控件controll。 比如服务授权，强制认证，Attribute发布，Theme控制，代理认证控制。
+ 由一个service registry,包含一个或多个registered services,每个service指定某一个controll控制。
+ service registry可由web ui配置，但推荐使用静态配置文件配置。

缺省的配置允许任何服务通过https/imaps来使用cas，通过IPersonAttributeDAO的配置来获取属性。

一个考虑是要不要用webui，如果要用的话，就要用ServiceRegistryDao来提供持久化，保持重启之前的状态。一般推荐用配置驱动。[进入章节](ch5/apereo-service-management.md)

