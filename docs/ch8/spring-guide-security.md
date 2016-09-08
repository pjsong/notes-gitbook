# sb-security

##项目
#### [github sample](https://github.com/spring-guides/gs-securing-web)
+ [插件Spring Boot Maven plugin](http://docs.spring.io/spring-boot/docs/current/reference/html/build-tool-plugins-maven-plugin.html)
为maven环境提供sb支持。

`java -Xdebug -Xrunjdwp:transport=dt_socket,server=y,address=8000,suspend=y -jar target/xxxx.jar`

##文章
#### pengzz.cn[参考](http://www.pengzz.cn/2016/06/spring-security.html)

####github[原文参考](https://github.com/spring-guides/top-spring-security-architecture)
######认证
+ 认证只有一个接口的一个方法：`AuthenticationManager:authenticate`,这个方法三个返回
  + null:不能决定
  + AuthenticationException：principle无效，runtimeException.
  + `Authentication`

+ 该接口最常用的实现`ProviderManager`,代理给`AuthenticationProvider`实例链。AuthenticationProvider像AuthenticationManager,多一个方法来查询是否支持认证类型。这些方法的参数都是Authentication.这个查询只会检查传入authenticate方法里面的参数。
+ 如果某个ProviderManager的代理AuthenticationProvider不能识别返回null，就跳过。
+ 被保护资源可以分成落个逻辑组，每个逻辑组使用独立的AuthenticationManager,经常每个都是ProviderManager,共享一个parent.
+ 
![图片](https://github.com/spring-guides/top-spring-security-architecture/raw/master/images/authentication.png)

######定制AuthenticationManager
+ `AuthenticationManagerBuilder`用于在应用中快速设置AuthenticationManager.
+ 方法中使用`@Autowired`构建全局AuthenticationManager, 使用`@Override`构建局部ApplicationManager. 在sb应用中可以把全局的AuthenticationManager `Autowired`到其他bean，
+ 缺省sb提供一个全局AuthenticationManager,如果要配置一个AuthenticationManager的构建，经常做到资源本地，不用担心缺省的全局。

######授权
+ 中心策略是`AccessDecisionManager`,有三个实现都委托给`DecisionVoter`链。
+ DecisionVoter考虑一个Authentication和一个Object(ConfigAttributes装饰).Object可以是一个url资源，一个java方法。 `ConfigAttributes`包含一些访问所需要权限的元数据。
+ ConfigAttributes接口只有一个方法，返回一个字符串。字符串根据资源所有者的意图，表达谁能够访问的规则。典型的返回有`ROLE_ADMIN `, `ROLE_AUDIT`, 通常也有特定格式如ROLE_打头，或者其他需要计算的表达式。
+ 基本上使用缺省的AccessDecisionManager实现`AffirmativeBased `.同意立马返回，之前遇到拒绝忽略。
+ 定制一般在voter中，增加voter，或者修改当前的voter处理方式。
+ 用SpEL来表示的ConfigAttribute使用较普遍， 如`isFullyAuthenticated() && hasRole('FOO')`。 DecisionVoter支持这种表示.

######web security
UI/http后台这一层的spring security基于servlet filter。

+ 客户端请求发送给容器，根据请求地址，容器决定一个有序的filter chain，和最多一个servlet来处理。filter可以自行去掉后面的filter来自己处理，也可以中途修改request/response再传给下一个filter。
+ filter的顺序控制有两种机制，一是filter类型的@Bean带上@Order注解，或者implements Order.还有一种自身是FilterRegistrationBean的一部分，api来指定order。
+ spring security在chain中作为一个单独的filter安装`DelegatingFilterProxy`，在sb中就是一个ApplicationContext中的@Bean，作用到每一个请求。
+ DelegatingFilterProxy代理给内部的一个`filterChainProxy`的bean，名字固定叫做`springSecurityFilterChain`,每一个filter都实现了servlet规范的filter接口，能截断下一个filter。
+ 可以有多个filter chain交给spring security，容器完全不管。spring security管理一组filter chain，把请求分配给第一个匹配成功的filter chain。这种方式下只有一个chain来处理一个请求。
![](https://github.com/spring-guides/top-spring-security-architecture/raw/master/images/security-filters-dispatch.png)

+ 在干净的vanilla应用中，基本上有6个filter chain, 前面5个是关于静态资源如/css/*, /images/*,/error等，最后一个匹配所有/**， 包含了认证，授权，异常处理，会话处理，写header等，这里面有11个filter，一般情况下不用关心什么时候用了哪个filter。

+ spring security内部的filter对容器透明很重要。在sb应用中，filter类型的bean都会自动注册到容器。如果想增加一个定制filter到security chain，就不能做成@Bean或者打包进FilterRegistrationBean,他们不会在容器注册。

######创建/定制filter chain
+ 缺省的filter chain(匹配/**)预先定义了一个order， `SecurityProperties.BASIC_AUTH_ORDER`, 可以用`security.basic.enabled=false`来关闭，或者把它作为一个备用，建立一个低order的规则。
<pre>
@Configuration
@Order(SecurityProperties.BASIC_AUTH_ORDER - 10)
public class ApplicationConfigurerAdapter extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.antMatcher("/foo/**")
     ...;
  }
}
</pre>

+ 应用中，不同的资源有完全不同的规则。带UI和backing api的，可能支持基于cookie的认证，转向login页面；基于token的认证，返回401。每一个资源都有自己的WebSecurityConfigurerAdapter, 唯一的order，以及request matcher.如果匹配规则都成功，order低的filterchain胜出。

###### Dispatch和授权中的请求匹配
一个security filter chain(就是WebSecurityConfigAdapter)一旦匹配上，其他的就不能再匹配了。在chain内部可以在使用request matcher对授权有更细粒度的控制.
<pre>
@Configuration
@Order(SecurityProperties.BASIC_AUTH_ORDER - 10)
public class ApplicationConfigurerAdapter extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.antMatcher("/foo/**")
      .authorizeRequests()
        .antMatchers("/foo/bar").hasRole("BAR")
        .antMatchers("/foo/spam").hasRole("SPAM")
        .anyRequest().isAuthenticated();
  }
}
</pre>
这个里面，antMatcher是两种处理，前者是匹配整个filter chain用的，后面是确定用什么授权规则用的。


######合并security规则/actuator规则
+ 当增加一个actuator到security应用中时，应用会增加一个filter chain,仅仅作用到actuator的endpoints.该chain有order为`anagementServerProperties.BASIC_AUTH_ORDER`,比缺省security chain低5。

+ 要为actuator增加security，就要增加一个security chain， order比actuator低，如果要用缺省的security chain, 就把自己的chain放到actuator之后，缺省security chain之前。

######方法上加security
+ 应用顶级加上注解
<pre>
@SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SampleSecureApplication {
}
</pre>
+ 方法上加注解
<pre>
@Service
public class MyService {
  @Secured("ROLE_USER")
  public String secure() {
    return "Hello Security";
  }

}
</pre>
这种类型的bean将被代理，调用者要经过security chain, 失败则返回accessDenied。

+ 其他注解`@PreAuthorize`,`@PostAuthorize`也提供在方法上强制认证的功能。

######线程问题
+ spring security是绑定线程的，主要就是securityContext,中间可能还一个Authentication,可以通过`SecurityContextHolder`的静态方法访问securityContext.
<pre>
SecurityContext context = SecurityContextHolder.getContext();
Authentication authentication = context.getAuthentication();
assert(authentication.isAuthenticated);
</pre>

+ 要得到当前的用户信息，可以在方法中放参数。
<pre>
@RequestMapping("/foo")
public String foo(@AuthenticationPrincipal User user) {
  ... // do stuff with user
}
</pre>
这个注解会从securityContext中拔出Authentication并调用它的getPrinciple()获取参数。另外一种做法是
<pre>
@RequestMapping("/foo")
public String foo(Principal principal) {
  Authentication authentication = (Authentication) principal;
  User = (User) authentication.getPrincipal();
  ... // do stuff with user
}
</pre>