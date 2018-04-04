# oath2步骤

## authserver

tut-spring-boot-oauth2
tut-spring-security-and-angular-js

## fb

[网址](developers.facebook.com)

1. 应用从fb获取Token
  `https://graph.facebook.com/oauth/authorize?client_id={app_id}&redirect_uri={app_url}`，如果用户没有登录，则登录，提示用户是否允许应用访问自己的数据，facebook返回到你的应用，带一个code参数: {app_url}?code={code}
2. 应用到fb验证token,需要appSecret
   `https://graph.facebook.com/oauth/access_token?client_id={app_id}&redirect_uri={url}&client_secret={app_secret}&code={code}`
3. fb返回到应用，body中带有access_token, 应用存储默认60分钟，如果增加offline_access权限，不过期。

## 提升权限

默认三项权限：email, public_profile, user_friends
`https://graph.facebook.com/oauth/authorize?client_id={app_id}&redirect_uri={app_url}&scope=publish_stream,offline_access,user_status,read_stream`

Java API
[官网参考](https://developers.facebook.com/docs/apis-and-sdks)

[RestFB](https://github.com/restfb/restfb)

[spring](http://projects.spring.io/spring-social-facebook/)

[spring-social](http://projects.spring.io/spring-social/)

[customize spring-social](http://docs.spring.io/spring-social/docs/1.0.x/reference/html/)connecting.html

## tw

[网址](https://apps.twitter.com/)

## google

[网址](https://developers.google.com/identity/sign-in/web/devconsole-project)

[开始教程](https://developers.google.com/identity/sign-in/web/sign-in)

## github

[教程](https://developer.github.com/v3/oauth/)
[oath](https://developer.github.com/guides/basics-of-authentication/)

## 项目功能

### 开放API登陆。

+ 无CAS，保护内容与公开内容并存

### SSO登陆

+ 单个账户跨应用访问。
