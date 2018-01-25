# pac4j

## 说明[原文](http://www.pac4j.org/authenticatewithfacebooktwittergooglein5minutes.html)

现代的站点通过本地的表单来认证用户，也同时通过第三方服务。pac4j提供一个简单的接口，来针对流行的第三方进行认证。
pac4j组成部分：

+ 一组实现第三方不同协议和逻辑的模块。开发人员只需选择对应的协议和第三方。pac4j-core, pac4j-oauth, pac4j-openid
+ 针对不同jvm框架的库。简单j2ee应用的j2e-pac4j, spring的spring-security-pac4j
+ demo

## spring security

+ 加入依赖

```xml
<dependency>
  <groupId>org.pac4j</groupId>
  <artifactId>spring-security-pac4j</artifactId>
  <version>1.2.2</version>
</dependency>
<dependency>
  <groupId>org.pac4j</groupId>
  <artifactId>pac4j-oauth</artifactId>
  <version>1.5.0</version>
</dependency>
```

+ 加入客户端bean到context

```xml
<bean id="facebookClient" class="org.pac4j.oauth.client.FacebookClient">
  <property name="key" value="fbKey" />
  <property name="secret" value="fbSecret" />
</bean>
<bean id="twitterClient" class="org.pac4j.oauth.client.TwitterClient">
  <property name="key" value="twKey" />
  <property name="secret" value="twSecret" />
</bean>
<bean id="googleClient" class="org.pac4j.oauth.client.Google2Client">
  <property name="key" value="gooKey" />
  <property name="secret" value="gooSecret" />
</bean>
<bean id="clients" class="org.pac4j.core.client.Clients">
  <property name="callbackUrl" value="http://localhost:8080/callback" />
  <property name="clients">
    <list>
        <ref bean="facebookClient" />
        <ref bean="twitterClient" />
        <ref bean="googleClient" />
    </list>
  </property>
</bean>
```

+ 为fb配置http

```xml
<security:http entry-point-ref="facebookEntryPoint">
  <security:custom-filter after="CAS_FILTER" ref="clientFilter" />
  <security:intercept-url pattern="/facebook/**"     access="IS_AUTHENTICATED_FULLY" />
</security:http>
<bean id="facebookEntryPoint" class="org.pac4j.springframework.security.web.ClientAuthenticationEntryPoint">
  <property name="client" ref="facebookClient" />
</bean>
```

+ 加入pac4j的provider和filter

```xml
<bean id="clientFilter" class="org.pac4j.springframework.security.web.ClientAuthenticationFilter">
  <constructor-arg value="/callback"/>
  <property name="clients" ref="clients" />
  <property name="authenticationManager" ref="authenticationManager" />
</bean>
<bean id="clientProvider" class="org.pac4j.springframework.security.authentication.ClientAuthenticationProvider">
  <property name="clients" ref="clients" />
</bean>
```