
###首页例子
[原文](http://docs.spring.io/spring-security-saml/docs/1.0.0.RELEASE/reference/html/chapter-quick-start.html)

+ master有bug，checkout release版本。

###教程
[原文](http://projects.spring.io/spring-security-oauth/docs/tutorial.html)

+ git sample[地址](https://github.com/spring-projects/spring-security-saml)


### 总揽
[原文](https://speakerdeck.com/dsyer/data-modelling-and-identity-management-with-oauth2)

client,关键类`OAuth2ClientContextFileter`,`OAuth2RestTemplate`,`OAuth2ProtectedResource`

做四件事

1. clientId,clientSecret注册到授权服务器
2. 不收集user credential
3. 用authorization code 从授权服务器获取token
4. 访问资源服务器 

注册数据：clientId，clientSecret, RedirectURI, Authorized grant type.

资源服务器,关键类`OAuth2AuthenticationProcessingFilter`,`Resource`,`ResourceServerTokenService`(解析token) 做三件事，

1. 从request解出token
2. 根据scope,audience,user_account(id,role...etc),client_info(id,role,etc.)决定是否可以访问
3. token权限不够，拒绝。

授权服务器做4件事, 1，2两个endporint,`AuthorizationServerTokenService`， 规范覆盖2,3

1. 认证client `/token`
2. 认证user `/authorize`
3. user授权页面, 发送authorization code给client，重定向到client
4. 发放token 

授权服务器根据请求scope决定是否发放token给client和user。
通常提供用户信息的endpoint如：https://api.github.com/user, https://graph.facebook.com/me, https://uaa.run.pivotal.io/userinfo

`ConsumerTokenService`发放/撤销token

###开发指南
[原文](http://projects.spring.io/spring-security-oauth/docs/oauth2.html)
###组件
######provider实现
+ provider划分为授权服务和资源服务，可以划分为两个应用，也可以多个资源服务一个授权服务。
+ 请求token由mvc controller处理，请求资源有filter处理
+ 主要的endpoint
  + `/oauth/authorize`授权请求处理,处理类`AuthorizationEndpoint`
  + `/oauth/token`token请求处理,处理类`TokenEndpoint`
  + 根据token， 为请求加载认证, 处理类`OAuth2AuthenticationProcessingFilter`
+ 所有的oauth功能都用SpringOauth的@Configuration适配器

######授权服务器配置

配置服务器，要考虑client获取token要用的许可类型。服务器的配置就是提供client detail服务，token服务

+ `@EnableAuthorizationServer`和实现`AuthorizationServerConfigurer`的@Bean一起配置授权机制。
+ 以下不同的配置器被传给AuthorizationServerConfigurer
  + `ClientDetailsServiceConfigurer`, 定义如题，`AuthorizationServerConfigurer`的一个回调。[jdbcDetailService](https://github.com/spring-projects/spring-security-oauth/blob/master/spring-security-oauth2/src/test/resources/schema.sql)的参考数据模型
  + `AuthorizationServerSecurityConfigurer`,定义token endpoint上的security约束。
  + `AuthorizationServerEndpointsConfigurer`,定义授权，token endpoint，token service。
  + 授权码：client把用户导到server登陆并授权后，获得授权code。 再把用户带上授权code从server导向client,

Token管理

+ 接口` AuthorizationServerTokenServices`两个操作
  + 创建时存储接口，供接受token的resource参考
  + 装入创建它所使用的authentication
 
 缺省实现` DefaultTokenServices`通过随机数创建token，用TokenStore持久化。也刷新token
  
+ 持久化
  + `InMemoryTokenStore`适合单个服务器
  + `JdbcTokenStore`,classpath要增加springjdbc
  + `JsonWebToken`,`JWT`
  
优点是不用后台存储，所有的许可都放到token里。缺点是不好撤销，因此许可时效短，用刷新token来撤销。另一个缺点是token size大。<br>严格说不持久化数据，不是store，但在token值和认证间的翻译角色上，在`DefaultTokenServices`是一样的。

+ 许可类型
  `AuthorizationServerEndpointsConfigurer`配置`AuthorizationEndpoint`支持的许类型。缺省只是除密码外的所有许可类型。
  + `authenticationManager`注入可以开启密码许可
  + `userDetailsService`注入或通过`GlobalAuthenticationManagerConfigurer`全局配置，新的token许可将检查userDetail，确保账户活跃。
  + `authorizationCodeServices`，auth code 许可
  + `implicitGrantService`管理隐含许可下的状态
  + `tokenGranter`全权控制许可，忽略上述所有的属性

+ 配置Endpoint url
  + `AuthorizationServerEndpointsConfigurer`的`pathMapping()`方法取2个参数：缺省url，路径。
  + `/oauth/authorize`授权，由security保护，确保用户访问之前已认证。
  + `/oauth/token`
  + `/oauth/confirm_access`用户许可
  + `/oauth/error`授权服务器提交错误
  + `/oauth/check_token`资源服务器解码token
  + `/oauth/token_key`jwt token暴露public_key用于验证
  
+ UI定制
  + 大部分授权服务器endpoint给机器用，但有些资源需要界面比如`GET/oauth/confirm_access` 和响应`/oauth/error`.框架中有默认。
  + 如果要定制，为这些endpoint提供@RequestMappings的controller，在`/oauth/confirm_access` end point,会绑定`AuthorizationRequest`,携带了获取用户同意所需要的数据，可以参考`WhitelabelApprovalEndpoint`缺省实现，copy过来。
  + 用户post同意/拒绝到`/oauth/authorize`,请求参数传给`AuthorizationEndpoint`中的`UserApprovalHandler`.
  + 缺省`UserApprovalHandler`看`AuthorizationServerEndpointsConfigurer`是否提供了`ApprovalStore`, 是则为`ApprovalStoreUserApprovalHandler`,否则为`TokenStoreUserApprovalHandler`
  + 标准approveHandler接受`TokenStoreUserApprovalHandler`看`user_oauth_approval`为true/flase,`ApprovalStoreUserApprovalHandler`看每个`scope.*`参数key为true，false。至少有一个scope成功许可则成功。
  + 用户提供的表单加入csrf，spring security缺省要求参数_csrf

+ 强制ssl
+ 定制error处理
  在endpoint用标准的`@ExceptionHandler`mvc功能，
+ 映射user_role到scope
  限制token的scope，不但看分配给用的scope，还看用户自己的权限。`AuthorizationEndpoint`中的`DefaultOAuth2RequestFactory`可以设置`checkUserScopes=true`来permitted的scope是匹配用户role的scope

######资源服务器配置
为那些token保护的资源提供服务。

在一个`@Config`类上，用`@EnableResourceServer`来开启认证filter `OAuth2AuthenticationProcessingFilter`提供保护，用`ResourceServerConfigurer`来配置功能

#####客户端配置
任务是访问其他服务器oath2保护的资源。

######保护资源配置

+ `OAuth2ProtectedResourceDetails`定义保护资源,包含6个属性
  + id：资源id
  + clientId
  + clientSecret
  + accessTokenUri：provider提供token的uri
  + scope
  + clientAuthenticationScheme。 client用来访问access token endpoint的认证schema. 有"http_basic" 和 "form"
+ 不同的许可类型也有不同的`OAuth2ProtectedResourceDetails`实现。"client_credentials" 许可类型用`ClientCredentialsResource`. 如果许可类型需要用户授权，还需要一个属性`userAuthorizationUri`

######client配置
`@EnableOAuth2Client`做两件事：
+ 创建`oauth2ClientContextFilter`存储当前请求/上下文。如果请求需要认证，管理redirect uri
+ 创建`AccessTokenRequest`,