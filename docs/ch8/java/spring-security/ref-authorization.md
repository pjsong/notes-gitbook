# 权限架构

原文<https://docs.spring.io/spring-security/site/docs/current/reference/html/authz-arch.html>

## Authorities

所有的认证实现都存储了`GrantedAuthority`对象的列表. 代表当前的principle的权限。这些列表中的对象被`AuthenticationManager`插入到`Authentication`对象，在`AccessDecisionManager`进行权限决策的时候读取。

`GrantedAuthority`接口只有一个方法`String getAuthority()`

`AccessDecisionManager`通过该方法获得`GrantedAuthority`的字符串表示。如果不能准确表示为字符串，这个对象就是复杂对象，`getAuthority()`必须返回null.

复杂`GrantedAuthority`的例子，比如为不同的客户帐号存储操作列表和权限门槛。这样`AccessDecisionManager`必须特别支持这种实现。

Spring Security有一个具体的`GrantedAuthority`实现, `SimpleGrantedAuthority`.该实现让任何用户指定的字符串转换为一个`GrantedAuthority`.所有的`AuthenticationProvider`都用`SimpleGrantedAuthority`来填装`Authentication`对象。

## 触发预处理

Spring Security用interceptors控制权限，决策由`AccessDecisionManager`作出.

### AccessDecisionManager

`AccessDecisionManager`由`AbstractSecurityInterceptor`调用，包含三个方法：

```java
void decide(Authentication authentication, Object secureObject,Collection<ConfigAttribute> attrs) throws AccessDeniedException;
boolean supports(ConfigAttribute attribute);
boolean supports(Class clazz);
```

`decide`方法被给予了做决策所需要的所有信息。特别是传入`secureObject`让触发的安全对象的参数能检测到。比如，如果触发的安全对象是一个`MethodInvocation`, 那么很容易通过查询`MethodInvocation`得到用户参数。

`supports(ConfigAttribute)`方法在开始的时候，被`AbstractSecurityInterceptor`用来确定是否`AccessDecisionManager`能够处理传入的`ConfigAttribute`.
`supports(Class)`被一个`security interceptor`实现调用，保证`AccessDecisionManager`能支持 `security interceptor`给出的`secure object`的类型。

### 基于voting的`AccessDecisionManager`实现

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

#### RoleVoter

最常用的是`RoleVoter`, 把`configuration attributes`看作`role names`，只要用户有这个角色就通过。

如果有`ConfigAttribute`用`ROLE_`打头，他就会投票. 如果有一个`GrantedAuthority`(通过`getAuthority()`)返回了一个字符串表示，`equal`一个或者多个用`ROLE_`打头的`ConfigAttributes`，它就会通过。否则失败。如果没有`ConfigAttribute`用`ROLE_`打头, voter弃权.

#### AuthenticatedVoter

用来区分匿名，全认证，remember-me认证的三种用户。一些站点允许一些remember me认证下的权限。
当我们用属性`IS_AUTHENTICATED_ANONYMOUSLY`来允许匿名访问，这个属性就是由`AuthenticatedVoter`处理. 
