

## 参考1

怎样把credential变成token，并添加filter，在访问时校验token

<https://aboullaite.me/spring-boot-token-authentication-using-jwt/>
<https://github.com/aboullaite/spring-boot-jwt>

怎样保证rest-service安全

第一个想法就是发送basic HTTP auth头。这种方式问题是，service每次都要检查这些credentials.包括哈希密码，且这些credential要保持在内存中。

这就引出了Token系统。登陆之后，系统返回token，client然后在每次请求的authorization头里边带上token, 服务对每个请求，在服务器端查找其context,这个context可以存储在db，redis，或者内存。这样的问题是，每个rest方法，都要去查找数据库或者内存。

然后引出了JWT。JWT不但对用户唯一，且包含你所需要的全部信息claims。最基本的claim是subject(userID)，但可以扩展出用户角色和访问权限。比如role:['user','admin'].claim可以从token中直接拿到。

token纯文本，client很方便添加一个claim。同时JWT或者是加密，或者是签名。常用的方式是签名。JWT签名的位叫JWS。如果token仅仅包含你想要client能够读到的信息，就用签名。此时内容包含签名，但没有加密。

另一方式是JWE。token的内容进行加密，只有server可以创建和解密。这就意味着client读不到也改变不了这个内容。
