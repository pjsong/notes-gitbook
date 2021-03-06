# 参考页面

+ application.properties [参考](http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html)
+ samples[github]((https://github.com/spring-projects/spring-boot/tree/master/spring-boot-samples))
+ social
  + https://github.com/spring-projects/spring-social-samples
  + https://github.com/spring-projects/spring-social-facebook
  + https://github.com/spring-guides/gs-accessing-facebook

## 依赖管理starter[starter]

Dependency management 对于复杂项目很关键。手动去管理非常困难， starter就是解决这个问题。starter的Pom是一些可以在应用中直接引入的依赖描述。

+ starter项目的package是默认的jar形式
+ starter项目从`spring-boot-starters`继承，不包含cloud部分。

## 静态mvc管理

[让springboot充当tomcat的角色提供静态内容][静态mvc管理1]

+ 只要有`@Controller`注解类存在，都将触发`WebMvcAutoConfiguration`设置整个mvc栈和Tomcat实例
+ 静态内容目录`/META-INF/resources/`,`/resources/`,`/static/`,`/public/`

[静态mvc管理1]:https://spring.io/blog/2013/12/19/serving-static-web-content-with-spring-boot
[starter]:http://www.baeldung.com/spring-boot-starters