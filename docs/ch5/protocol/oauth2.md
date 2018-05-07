# Oauth2 

## 协议

[协议原版https://tools.ietf.org/html/rfc6749](https://tools.ietf.org/html/rfc6749)
[ppt slideshare.net](https://www.slideshare.net/OrkhanGassymov/secured-rest-microservices-with-spring-cloud)



### 引入

张三(owner)在微信(authorization, resource server)存储一张照片，想在百度(client)展示出来，这时，需要提供给百度自己的微信帐号。引出了如下问题：

+ 百度要存储张三的微信帐号
+ 微信服务器要支持密码认证，加上密码认证本身不安全
+ 百度过度的获得了访问微信上用户资源
+ 张三给百度的这个权限不可撤销，除非自己改微信密码。
+ 对百度的妥协导致张三的密码和密码所保护的资源安全打折

OAuth通过引入一个授权层，把百度和张三分离来解决这个问题。百度要访问这张照片，要使用与张三不同的credentials。百度要用access token(包含了scope, lifetime等),由authorization服务器在张三允许后发放。

#### 角色

  总共四个角色：

+ resource owner 允许访问收保护资源的对象，比如张三。
+ resource server 资源存放服务器，通过accesstoken来是否决定接受请求并响应。
+ client 基于resource owner的授权，发出访问资源请求的服务器应用.
+ authorization server 认证resource owner,获得授权之后，发放token给client

授权服务器和资源存放服务器可以是一个应用， 也可以是单个授权服务器，多个资源存放服务器。

协议本身不涉及
+ 怎么认证resource owner
+ 怎么校验token
+ token怎么组织



#### 协议工作流

简单说来三部曲： `client`向`resource owner`要`grant`，用`grant`向`server`要`token`，用`token`向`resource server`要资源

+ client向resource owner请求授权。可以直接向resource owner请求,也可以间接通过授权服务器作为中介。
+ client获得代表授权的credential，。协议有四种授权类型，也可以用扩展的类型。 获得的授权类型取决于client请求授权的方法和认证服务器支持的授权类型。
+ client向授权服务器请求token, 并展示授权credential.
+ 授权服务器检查认证后发放token
+ client用token认证并请求保护资源
+ 资源服务器校验token并提供资源

步骤1,2推荐的方法，是间接通过授权服务器来向resource owner请求授权。

+ AccessToken含有直接访问资源所需要的信息, 有效期短
+ RefreshToken含有获取新token所需要的信息，有效期相对长
+ 为避免校验请求，使用JWTToken，用key检查其签名就行了。
+ Token包含Client信息，User信息


#### Grant type授权类型

##### Authorization Code授权码

该授权类型间接通过授权服务器来获得。

+ client把resource owner指向授权服务器. 授权服务器要求resource owner登录，并允许client访问resource, 
+ 授权服务器带上授权码把resource owner再指向client,
+ client接着要token,服务器送出2个token

 这是social app常用的方式。过程中client不能获得resource owner的credential。授权服务器返回token不通过浏览器方式，因此不会向外部暴露token。

##### Implicit（非明确授权）

+ 该授权主要用于浏览器用js实现的client应用,是一个简化的授权码。
+ 在这种方式下，在resource owner授权之后，直接发放token，而不是授权码。

这是SPA常用的方式。
授权服务器不认证client。有时通过发放access token给client的redirection URI来甄别client。此时token可能暴露给浏览器，或者resource owner.
这种方式提高了client的响应效率，但是有安全上的弱点。特别是可以用授权码方式的时候。

##### Resource Owner Password Credentials用户名密码授权

+ resource owner向client用户名密码登录
+ client用这个用户名/密码向auth server请求token

这种方式仅当resource owner和client有充分信任的时候才可以用。比如，client是一个设备操作系统的一部分或者高权限应用，且没有其他的授权类型可以用。
尽管这种方式下client直接访问resource owner的credential,resource owner的credential也只是用于一次请求来交换access token.去掉了client需要存储resource owner credential的必要，随时可以用credential来获得access token或者refresh token。

##### Client Credentials client身份

授权范围是由client控制的资源。也就是client同时充当了resource owner.或者基于先前与授权服务器安排好了的资源。
这是机器与机器之间的授权。

##### 选择grant type的逻辑

来自参考二的一张ppt图PageNo：41

```javascript
GrantType getGrantType(){
  if(accessTokenOwner == 'machine') return 'ClientCredentials'
  else if(accessTokenOwner == 'resourceOwner'){
    if(clientType == 'webapp' || (clientType='nativeApp' && thirdPartyClient)) return 'AuthorizationCodeGrant';
    if(clientType =='nativeApp' || clientType='userAgentBasedApp') && firstPartyClient)
    return 'PasswordGrant';
    if(clientType=='userAgentBasedApp' && thirdPartyClient){
      return 'ImplicitGrant'
    }
  };
}


#### Access Token

+ 由resource owner授权，资源服务器和授权服务器来执行。
+ 可能是一个用于获取授权信息的标志符，也可以自包含授权信息。
它让token的发放比授权更严格，资源服务器不用考虑认证方法。
token可以有许多格式和结构。比如[Bearer Token RFC6750](https://tools.ietf.org/html/rfc6750).

#### Refresh Token

当token失效或者过期，由授权服务器发放给client来获得access token.如果授权服务器支持refresh token，在发放access token的同时发放。代表resource owner对client的授权，与access token的区别是refresh token只访问授权服务器。

### Client注册

初始化协议之前，client先向授权服务器注册，注册的方式基本上是用户和一个html注册表单交互，不在协议的范围。
注册不需要client和授权服务器直接交互。如果授权服务器支持，注册可以通过其他方式建立信任，获得client属性。
注册时，开发人员需要指定client type,client redirection uri, 授权服务器指定的其他信息比如应用名字，站点地址。

#### client type

基于向授权服务器安全认证自己的能力，分为confidential和public。前者能保证自身credential的安全，比如web应用中webserver能保存自身的credential和接收的token。 后者不能，比如浏览器和本地应用。

#### Client Identifier

 授权服务器给client一个公开的，代表client提供的注册信息的标志符, 授权服务器应该指定标志符长度，标志符对授权服务器唯一。

### Client 认证

如果是confidential的client, 两者就建立一个满足授权服务器安全要求的client认证方法。confidential client一般发放许多credential比如密码，公钥/私钥对等。
授权服务器也可以为public的client建立一个认证方法，但是该方法不能用来认证client.
client每个认证请求都只能用一个认证方法。

### scope

由授权服务器提供，client请求时，可以带上顺序无关，空格分割的参数，授权服务器收到请求，基于resource owner许可或者自身的政策，可以全部或者部分忽略这些值。授权服务器响应时，必须带上此参数告知得到的许可。

### 获取授权

#### code许可方式

##### code许可方式请求

`GET /authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1  Host: server.example.com`

必填字段`response_type=code`，`client_id`
可选字段`redirect_uri`，`scope`
推荐字段`state维护请求和回调之间的状态，防止csrf`.

##### code许可方式响应

`HTTP/1.1 302 Found  Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA   &state=xyz`

+ code，推荐最多10分钟有效防止泄漏，client只能用一次，如果授权服务器多次收到，应该撤销所有发放的相关token. code与client_id和redirect_uri绑定。
+ state, 原值返回

##### code许可方式错误响应

`HTTP/1.1 302 Found  Location: https://client.example.com/cb?error=access_denied&state=xyz`

+ `invalid_request`请求缺参数
+ `unauthorized_client`client未被授权请求授权码
+ `access_denied`拒绝访问
+ `unsupported_response_type`授权服务器不支持授权码
+ `invalid_scope`scope无效，未知或者格式错误
+ `server_error`因为500内部服务器错误不能通过redirect返回
+ `temporarily_unavailable`因为503不能通过redirect返回

#### token请求

`POST /token HTTP/1.1    Host: server.example.com     Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW     Content-Type: application/x-www-form-urlencoded`

`grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb`

必填字段`grant_type=authorization_code`，`code`，`redirect_uri`如果授权请求包含该字段，`client_id`如果没有向授权服务器认证。非安全相关，防止client接受其他client的授权码。

如果client有credential, 则必须向授权服务器认证。

#### token请求响应

```text
     HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8
     Cache-Control: no-store
     Pragma: no-cache

     {
       "access_token":"2YotnFZFEjr1zCsicMWpAA",
       "token_type":"example",
       "expires_in":3600,
       "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
       "example_parameter":"example_value"
     }
```

### 非明确许可

不支持refresh token，是一个基于redirection的流程，client要能通过redirection接受授权服务器过来的请求，接收token。
没有client认证，依赖resource owner和注册redirection.

### resource owner密码许可

resource owner充分信任client， 让client获取用户名/密码。用来把http basic或者digest认证变成oauth的token认证。

#### 密码许可请求

`POST /token HTTP/1.1     Host: server.example.com     Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW     Content-Type: application/x-www-form-urlencoded     grant_type=password&username=johndoe&password=A3ddj3w`

+ 必需字段：`grant_type=password`，`username`，`password`
+ 可选，`scope`

#### 密码许可响应

```text
    HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8
     Cache-Control: no-store
     Pragma: no-cache

     {
       "access_token":"2YotnFZFEjr1zCsicMWpAA",
       "token_type":"example",
       "expires_in":3600,
       "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
       "example_parameter":"example_value"
     }
```

### Client credential 许可

client提供client credential给授权服务器获得token

#### client credential 请求

```text
POST /token HTTP/1.1
     Host: server.example.com
     Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
     Content-Type: application/x-www-form-urlencoded

     grant_type=client_credentials
```

#### client credential 响应

```text
     HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8
     Cache-Control: no-store
     Pragma: no-cache

     {
       "access_token":"2YotnFZFEjr1zCsicMWpAA",
       "token_type":"example",
       "expires_in":3600,
       "example_parameter":"example_value"
     }
```

#### 参数

+ `grant_type=client_credentials`必填
+ `scope`选填

### 访问受保护资源

#### token类型

client用token向resource server认证的方法依赖token类型。一般涉及用http `Authorization`请求头。
比如 Bearer类型

```text
     GET /resource/1 HTTP/1.1
     Host: example.com
     Authorization: Bearer mF_9.B5f-4.1JqM
```

Mac类型

```text
     GET /resource/1 HTTP/1.1
     Host: example.com
     Authorization: MAC id="h480djs93hd8",
                        nonce="274312:dj83hs9s",
                        mac="kDZvddkndxvhGRXZhvuDjEWhGeE="
```

## 资源

[https://oauth.net/2/](https://oauth.net/2/)

https://github.com/making/demo-oauth2-login
https://github.com/making/oauth2-sso-demo
http://projects.spring.io/spring-security-oauth/docs/oauth2.html
http://www.baeldung.com/rest-api-spring-oauth2-angularjs
https://github.com/eugenp/tutorials/tree/master/spring-security-sso
http://www.baeldung.com/security-spring
http://www.baeldung.com/
http://www.baeldung.com/sso-spring-security-oauth2