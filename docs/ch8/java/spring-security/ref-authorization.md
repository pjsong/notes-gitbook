# 权限架构

## 认证

### [细节www.dewafer.com](http://www.dewafer.com/2016/10/01/dive-into-spring-security/)

![流程图](http://www.dewafer.com/img/Spring_Security%20Authentication_Process_for_Web_Application.png)

官文<https://docs.spring.io/spring-security/site/docs/current/reference/htmlsingle/#what-is-authentication-in-spring-security>

输入用户名密码之后，装入一个Authentication接口的实例`UsernamePasswordAuthenticationToken`让`AuthenticationManager`去校验，校验成功返回一个真正的`Authentication`实例`SecurityContextHolder.getContext().setAuthentication(…​)`.

```java
    try {
        Authentication request = new UsernamePasswordAuthenticationToken(name, password);
        Authentication result = am.authenticate(request);
        SecurityContextHolder.getContext().setAuthentication(result);
        break;
    } catch(AuthenticationException e) {
        System.out.println("Authentication failed: " + e.getMessage());
    }
```

+ `SecurityContextHolder`默认使用ThreadLocal 策略来存储认证信息

获取用户信息的流程`SecurityContext->Authentication->UserDetails`

```java
Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
if (principal instanceof UserDetails) {
String username = ((UserDetails)principal).getUsername();
} else {
String username = principal.toString();
}
```

+ `Authentication`包含`userDetails`和`principle`

```java
package org.springframework.security.core;// <1>
public interface Authentication extends Principal, Serializable { // <1>
    Collection<? extends GrantedAuthority> getAuthorities(); // <2>
    Object getCredentials();// <2>
    Object getDetails();// <2>
    Object getPrincipal();// <2>
    boolean isAuthenticated();// <2>
    void setAuthenticated(boolean var1) throws IllegalArgumentException;
}
```

+ `UserDetailsService`只规定了一个loadUserByUsername方法,负责加载用户信息。常见的实现类有JdbcDaoImpl，InMemoryUserDetailsManager

```java
@Bean
public UserDetailsService userDetailsService() throws Exception {
    // ensure the passwords are encoded properly
    UserBuilder users = User.withDefaultPasswordEncoder();
    InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
    manager.createUser(users.username("user").password("password").roles("USER").build());
    manager.createUser(users.username("admin").password("password").roles("USER","ADMIN").build());
    return manager;
}
@Autowired
private DataSource dataSource;
@Autowired
public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
    UserBuilder users = User.withDefaultPasswordEncoder();
    auth
        .jdbcAuthentication()
            .dataSource(dataSource)
            .withDefaultSchema()
            .withUser(users.username("user").password("password").roles("USER"))
            .withUser(users.username("admin").password("password").roles("USER","ADMIN"));
}
```

+ `Authentication`是通过`Authentication`对象和`AuthenticationManager`以及`AuthenticationProvider`互相合作来实现的。而授权则是通过`GrantedAuthority`、`AccessDecisionManager`和`AccessDecisionVoter`等互相合作来实现的。
+ `AuthenticationManager`是接口，做事的是`providerManager`,后者又逐个遍历`AuthenticationProvider`,每个`AuthenticationProvider`要不抛异常，要不返回`Authentication`，看谁能返回。校验认证请求一般就是装入`UserDetails`并对比密码，比如`daoAuthenticationProvider`.装入的`UserDetails`和`GrantedAuthority`用来构建`Authentication`,并存入`SecurityContext`.

+ 定制`userDetailService`. [baeldung](http://www.baeldung.com/spring-security-authentication-with-a-database)

```java
@Autowired
private MyUserDetailsService userDetailsService;
@Override
protected void configure(AuthenticationManagerBuilder auth)
  throws Exception {
    auth.authenticationProvider(authenticationProvider());
}
@Bean
public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider
      = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(encoder());
    return authProvider;
}
@Bean
public PasswordEncoder encoder() {
    return new BCryptPasswordEncoder(11);
}
```

## 官方参考

原文<https://docs.spring.io/spring-security/site/docs/current/reference/html/authz-arch.html>

### Authorities

关键实现是接口`AccessDecisionManager`的`decide`方法，通过代表principle的`Authentication` 和受保护对象`secure object`，以及应用到受保护对象上的一个`security metadata attributes`list来做。

#### Security 和 AOP Advice

AOP的around这种advice很有用，他可以决定是否执行方法，是否修改响应，是否抛出异常。
Spring Security就用around advice. 对于`method invocations`，用标准的AOP做了一个around advice 。对web用标准的Filter实现了一个around advice.

#### `Secure Objects` 和 `AbstractSecurityInterceptor`

`secure object`一种是`method invocation`,一种是`web request`, 每种类型都有自己的interceptor类, 继承自`AbstractSecurityInterceptor`. 等到`AbstractSecurityInterceptor` 被调用, 如果认证是成功的`SecurityContextHolder`就将包含了Authentication.

`AbstractSecurityInterceptor`的工作流程如下：

+ 查找请求的`configuration attributes`
+ 把`secure object`和当前的`Authentication`和`configuration attributes`交给AccessDecisionManager来决定授权。
+ 看看是否修改`Authentication`
+ 若授权通过，让`secure object`继续
+ 如果有配置则执行`AfterInvocationManager`

#### 术语

+ `Configuration Attributes`
  + 就是一个用`ConfigAttribute`接口表示的字符串，可以简单就是一个角色名，也可以复杂，就看`AccessDecisionManager`的实现。
  + 主要使用者是`AbstractSecurityInterceptor`，该对象用`SecurityMetadataSource` 查找受保护对象的属性.
  + 来源于受保护方法上的注解，或者url比如`<intercept-url pattern='/secure/**' access='ROLE_A,ROLE_B'/>`
  + 实践中，缺省`AccessDecisionManager`的配置下，只要`GrantedAuthority`能匹配上一个就能成功，但严格说来，这些attributes要依赖`AccessDecisionManager`的实现.
  + `ROLE_`前缀只是一个标记，表示这些attributes是role，由`RoleVoter`来处理。他只有在使用voter-based的`AccessDecisionManager`时才有关系。
+ `AOP`
  + 四种类型
    + `before，after，around, after-returning, after-throwing`

所有的认证实现都存储了`GrantedAuthority`对象的列表. 代表当前的principle的权限。这些列表中的对象被`AuthenticationManager`插入到`Authentication`对象，在`AccessDecisionManager`进行权限决策的时候读取。

`GrantedAuthority`接口只有一个方法`String getAuthority()`

`AccessDecisionManager`通过该方法获得`GrantedAuthority`的字符串表示。如果不能准确表示为字符串，这个对象就是复杂对象，`getAuthority()`必须返回null.

复杂`GrantedAuthority`的例子，比如为不同的客户帐号存储操作列表和权限门槛。这样`AccessDecisionManager`必须特别支持这种实现。

Spring Security有一个具体的`GrantedAuthority`实现, `SimpleGrantedAuthority`.该实现让任何用户指定的字符串转换为一个`GrantedAuthority`.所有的`AuthenticationProvider`都用`SimpleGrantedAuthority`来填装`Authentication`对象。

### 触发预处理

Spring Security用interceptors控制权限，决策由`AccessDecisionManager`作出.

#### AccessDecisionManager

`AccessDecisionManager`由`AbstractSecurityInterceptor`调用，包含三个方法：

```java
void decide(Authentication authentication, Object secureObject,Collection<ConfigAttribute> attrs) throws AccessDeniedException;
boolean supports(ConfigAttribute attribute);
boolean supports(Class clazz);
```

`decide`方法被给予了做决策所需要的所有信息。特别是传入`secureObject`让触发的安全对象的参数能检测到。比如，如果触发的安全对象是一个`MethodInvocation`, 那么很容易通过查询`MethodInvocation`得到用户参数。

`supports(ConfigAttribute)`方法在开始的时候，被`AbstractSecurityInterceptor`用来确定是否`AccessDecisionManager`能够处理传入的`ConfigAttribute`.
`supports(Class)`被一个`security interceptor`实现调用，保证`AccessDecisionManager`能支持 `security interceptor`给出的`secure object`的类型。

#### 基于voting的`AccessDecisionManager`实现

用户能实现自己的AccessDecisionManager`完成授权控制。

![Figure 25.1. Voting Decision Manager](https://docs.spring.io/spring-security/site/docs/current/reference/html/images/access-decision-voting.png)

一系列的`AccessDecisionVoter`在一个决策中被问询。 `AccessDecisionManager`基于对投票的评估，决定是否抛出`AccessDeniedException`异常.

`AccessDecisionVoter`三个方法:

```java
int vote(Authentication authentication, Object object, Collection<ConfigAttribute> attrs);
boolean supports(ConfigAttribute attribute);
boolean supports(Class clazz);
```

`vote`返回整型，三个静态字段。`ACCESS_ABSTAIN`, `ACCESS_DENIED`，`ACCESS_GRANTED`.

有三个具体的`AccessDecisionManager`实现来唱票。

+ `ConsensusBased` 忽略弃权，多数通过
+ `AffirmativeBased` 忽略弃权，一人同意通过。
+ `UnanimousBased`忽略弃权，一致同意。

##### RoleVoter

最常用的是`RoleVoter`, 把`configuration attributes`看作`role names`，只要用户有这个角色就通过。

如果有`ConfigAttribute`用`ROLE_`打头，他就会投票. 如果有一个`GrantedAuthority`(通过`getAuthority()`)返回了一个字符串表示，`equal`一个或者多个用`ROLE_`打头的`ConfigAttributes`，它就会通过。否则失败。如果没有`ConfigAttribute`用`ROLE_`打头, voter弃权.

##### AuthenticatedVoter

区分匿名，全认证，remember-me认证的三种用户。一些站点允许一些remember me认证下的权限。
当我们用属性`IS_AUTHENTICATED_ANONYMOUSLY`来允许匿名访问，这个属性就是由`AuthenticatedVoter`处理.

##### 实现[baeldung](http://www.baeldung.com/spring-security-custom-voter)

缺省实现

```java
@Override
protected void configure(final HttpSecurity http) throws Exception {
    .antMatchers("/").hasAnyAuthority("ROLE_USER")
}
```

定制实现

```java
public class MinuteBasedVoter implements AccessDecisionVoter {
    @Override
    public int vote(
    Authentication authentication, Object object, Collection<ConfigAttribute> collection) {
        return authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .filter(r -> "ROLE_USER".equals(r)
            && LocalDateTime.now().getMinute() % 2 != 0)
        .findAny()
        .map(s -> ACCESS_DENIED)
        .orElseGet(() -> ACCESS_ABSTAIN);
    }
    @Override
    public boolean supports(ConfigAttribute attribute) {
        return true;
    }
    @Override
    public boolean supports(Class clazz) {
        return true;
    }
}
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
    .anyRequest()
    .authenticated()
    .accessDecisionManager(accessDecisionManager());
}
@Bean
public AccessDecisionManager accessDecisionManager() {
    List<AccessDecisionVoter<? extends Object>> decisionVoters 
      = Arrays.asList(
        new WebExpressionVoter(),
        new RoleVoter(),
        new AuthenticatedVoter(),
        new MinuteBasedVoter());
    return new UnanimousBased(decisionVoters);
}
```