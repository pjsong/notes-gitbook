# 第一大组件 Authentication
主要是authentication manager提供了一堆authentication handler来控制。

## authentication manager
对给定的每一个credential，authentication manager的事情包括

+ 遍历所有的handler
+ 如果handler支持就authenticate这个credential
+ 如果成功，尝试解析出principle
  + 检查该handler是否有配置resolver
  + 有则解析，没有，就用authentication handler解析出的principle
+ 检查是或否满足security policy
+ 满足则立即返回，否则continue
+ 所有的credential都尝试了，在此检查security policy，如果不满足抛出authentication failed异常。

有一个隐含的security policy: 至少有一个handler成功authenticate了一个credential。

## authentication handler
支持很多种handler和schema。缺省的就是static authentication manager。

## principle resolution
把credential中的信息转换为security principle.后者包含更多的属性信息如显示名称，组织名称等。

一个cas principle包含一个唯一标识。authentication handler 提供了一个缺省的简单机制：比如LdapAuthenticationHandler组件支持从ldap查询获取attributes和设置principleID.

有时候，需要认证用一种方式，获取principle用一种方式。这就使Principle Resolver组件的作用。常用的场景就是X.509认证。

CAS用Person Directory来principle解析服务。配置PersonDirectoryPrincipleResolver的关键是IPersonAttributeDao对象
[文档](https://github.com/apereo/person-directory)提供了两个例子

PrincipalResolver vs. AuthenticationHandler
AuthenticationHandler如果有提供充足信息，应优先使用。

## principle transformation
配置处理username/password这类credential的hanler在执行认证之前转换userid

## Long term authentication/ Remember Me

## Login throttling
限制登陆失败的次数。

## SSO Session cookie
TGC (Ticket-granting cookie), 在建立SSO会话的时候CAS设置，维护client的状态。当cookie有效，client作为credential替代展示给cas。

