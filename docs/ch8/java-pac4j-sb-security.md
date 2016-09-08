# pac4j

###说明[原文](http://www.pac4j.org/authenticatewithfacebooktwittergooglein5minutes.html)
现代的站点通过本地的表单来认证用户，也同时通过第三方服务。pac4j提供一个简单的接口，来针对流行的第三方进行认证。
<br>pac4j组成部分：

+ 一组实现第三方不同协议和逻辑的模块。开发人员只需选择对应的协议和第三方。pac4j-core, pac4j-oauth, pac4j-openid
+ 针对不同jvm框架的库。简单j2ee应用的j2e-pac4j, spring的spring-security-pac4j
+ demo

---
## spring security 
* 加入依赖
<pre>
&lt;dependency>
  &lt;groupId>org.pac4j</groupId>
  &lt;artifactId>spring-security-pac4j</artifactId>
  &lt;version>1.2.2</version>
&lt;/dependency>
&lt;dependency>
  &lt;groupId>org.pac4j</groupId>
  &lt;artifactId>pac4j-oauth</artifactId>
  &lt;version>1.5.0</version>
&lt;/dependency>
</pre>


* 加入客户端bean到context
<pre>
&lt;bean id="facebookClient" class="org.pac4j.oauth.client.FacebookClient">
  &lt;property name="key" value="fbKey" />
  &lt;property name="secret" value="fbSecret" />
&lt;/bean>
&lt;bean id="twitterClient" class="org.pac4j.oauth.client.TwitterClient">
  &lt;property name="key" value="twKey" />
  &lt;property name="secret" value="twSecret" />
&lt;/bean>
&lt;bean id="googleClient" class="org.pac4j.oauth.client.Google2Client">
  &lt;property name="key" value="gooKey" />
  &lt;property name="secret" value="gooSecret" />
&lt;/bean>
&lt;bean id="clients" class="org.pac4j.core.client.Clients">
  &lt;property name="callbackUrl" value="http://localhost:8080/callback" />
  &lt;property name="clients">
    &lt;list>
        &lt;ref bean="facebookClient" />
        &lt;ref bean="twitterClient" />
        &lt;ref bean="googleClient" />
    &lt;/list>
  &lt;/property>
&lt;/bean>
</pre>

* 为fb配置http
<pre>
&lt;security:http entry-point-ref="facebookEntryPoint">
  &lt;security:custom-filter after="CAS_FILTER" ref="clientFilter" />
  &lt;security:intercept-url pattern="/facebook/**"     access="IS_AUTHENTICATED_FULLY" />
&lt;/security:http>
&lt;bean id="facebookEntryPoint" class="org.pac4j.springframework.security.web.ClientAuthenticationEntryPoint">
  &lt;property name="client" ref="facebookClient" />
&lt;/bean>
</pre>

* 加入pac4j的provider和filter
<pre>
&lt;bean id="clientFilter" class="org.pac4j.springframework.security.web.ClientAuthenticationFilter">
  &lt;constructor-arg value="/callback"/>
  &lt;property name="clients" ref="clients" />
  &lt;property name="authenticationManager" ref="authenticationManager" />
&lt;/bean>
&lt;bean id="clientProvider" class="org.pac4j.springframework.security.authentication.ClientAuthenticationProvider">
  &lt;property name="clients" ref="clients" />
&lt;/bean>
</pre>

