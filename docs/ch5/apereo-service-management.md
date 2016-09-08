
###配置驱动

缺省的配置允许任何服务通过https/imaps来使用cas，通过IPersonAttributeDAO的配置来获取属性。<br>
一个考虑是要不要用webui，如果要用的话，就必须用ServiceRegistryDao来提供持久化，保持重启之前的状态。一般推荐用配置驱动

###定义要素
#####[配置访问策略](https://apereo.github.io/cas/4.2.x/installation/Configuring-Service-Access-Strategy.html)
###### Service配置缺省支持属性
目的是控制服务授权规则。比如：是否允许cas，是否允许SSO，是否必须预先配有principle attribute，能根据访问者的角色，配置不同的attribute，来定义不同的规则。
需要解释的属性如下：

+ ssoEnabled
>   false,不管协议上renew之类的flag，强制用户认证，为统一认证提供支持。

+ requiredAttributes
>  包含principle attribute的map。根据角色定义规则，必须在CAS处理之前能解析，如果没有则忽略。

+ requireAllAttributes
> 缺省true，表示所有的attribute都要有，否则表示至少有一个匹配则可。控制哪一个，多少个attribute name必须存在。

+ caseInsensitive
> 缺省false，匹配attribute value时候是否case敏感。 <em> 注意1， attribute名字是大小写敏感的。 2，如果发布attributes时使用了attribute缓存， 所有required attributes必须要发布上去。[参考](https://apereo.github.io/cas/4.2.x/integration/Attribute-Release.html)</em>

+ evaluationOrder
> 当有多个服务地址表达式(registration)覆盖的是同一个service，先evaluate那个registration

+ attributeReleasePolicy
> 允许发布给应用的属性，以及其他的过滤逻辑，[参考](https://apereo.github.io/cas/4.2.x/integration/Attribute-Release.html).<br>
> 解析出的属性根据cas或者saml协议返回，经历两个阶段：
  1. 建立principle时，通过principleResolver组件，完成属性解析。
  2. 通过服务配置属性发布，发布属性。 

+ attributeReleasePolicy


+ attributeReleasePolicy
> 
######访问策略
+ 不让用cas
<pre>
{
  "@class" : "org.jasig.cas.services.RegexRegisteredService",
  "serviceId" : "testId",
  "name" : "testId",
  "id" : 1,
  "accessStrategy" : {
    "@class" : "org.jasig.cas.services.DefaultRegisteredServiceAccessStrategy",
    "enabled" : false,
    "ssoEnabled" : true
  }
}
</pre>

+ 不让用SSO，每次都要验证
<pre>
{
  "@class" : "org.jasig.cas.services.RegexRegisteredService",
  "serviceId" : "testId",
  "name" : "testId",
  "id" : 1,
  "accessStrategy" : {
    "@class" : "org.jasig.cas.services.DefaultRegisteredServiceAccessStrategy",
    "enabled" : true,
    "ssoEnabled" : false
  }
}
</pre>

+ principle必须有cn属性值为admin，giveName属性值为Administrator
<pre>
{
  "@class" : "org.jasig.cas.services.RegexRegisteredService",
  "serviceId" : "testId",
  "name" : "testId",
  "id" : 1,
  "accessStrategy" : {
    "@class" : "org.jasig.cas.services.DefaultRegisteredServiceAccessStrategy",
    "enabled" : true,
    "ssoEnabled" : true,
    "requiredAttributes" : {
      "@class" : "java.util.HashMap",
      "cn" : [ "java.util.HashSet", [ "admin" ] ],
      "givenName" : [ "java.util.HashSet", [ "Administrator" ] ]
    }
  }
}
</pre>

+ principle必须有cn属性，值为admin,Admin或者TheAdmin;或者有member属性，值为admins，adminGroup或者staff
<pre>
{
  "@class" : "org.jasig.cas.services.RegexRegisteredService",
  "serviceId" : "testId",
  "name" : "testId",
  "id" : 1,
  "accessStrategy" : {
    "@class" : "org.jasig.cas.services.DefaultRegisteredServiceAccessStrategy",
    "enabled" : true,
    "requireAllAttributes" : false,
    "ssoEnabled" : true,
    "requiredAttributes" : {
      "@class" : "java.util.HashMap",
      "cn" : [ "java.util.HashSet", [ "admin, Admin, TheAdmin" ] ],
      "member" : [ "java.util.HashSet", [ "admins, adminGroup, staff" ] ]
    }
  }
}
</pre>


######配置代理认证proxyPolicy
service可以配置是否允许代理认证。如果定义了允许，pgt发放给service。同时定义接受pgt的url。

+ 缺省的配置,拒绝
<pre>{
  "@class" : "org.jasig.cas.services.RegexRegisteredService",
  "serviceId" : "testId",
  "name" : "testId",
  "id" : 1,
  "proxyPolicy" : {
    "@class" : "org.jasig.cas.services.RefuseRegisteredServiceProxyPolicy"
  }
}</pre>

+ 仅允许代理匹配正规表达式的PGT url
<pre>{
  "@class" : "org.jasig.cas.services.RegexRegisteredService",
  "serviceId" : "testId",
  "name" : "testId",
  "id" : 1,
  "proxyPolicy" : {
    "@class" : "org.jasig.cas.services.RegexMatchingRegisteredServiceProxyPolicy",
    "pattern" : "^https?://.*"
  }
}</pre>


######服务定制属性
CAS可以为服务添加任意的属性。这些定制属性看作额外的meta-data,如电话，地址，或者基于服务的扩展使用的属性。
+ 例子
<pre>{
  "@class" : "org.jasig.cas.services.RegexRegisteredService",
  "serviceId" : "^https://.+",
  "name" : "sample service",
  "id" : 100,
  "properties" : {
    "@class" : "java.util.HashMap",
    "email" : {
      "@class" : "org.jasig.cas.services.DefaultRegisteredServiceProperty",
      "values" : [ "java.util.HashSet", [ "person@place.edu", "admin@place.edu" ] ]
    }
  }
}</pre>


######持久化
+ 基于内存的bean
    <pre>&lt;bean id="serviceRegistryDao"
      class="org.jasig.cas.services.InMemoryServiceRegistryDaoImpl"
      p:registeredServices-ref="registeredServicesList" />
&lt;util:list id="registeredServicesList">
    &lt;bean class="org.jasig.cas.services.RegexRegisteredService"
          p:id="1"
          p:name="HTTPS and IMAPS services on example.com"
          p:serviceId="^(https|imaps)://([A-Za-z0-9_-]+\.)*example\.com/.*"
          p:evaluationOrder="0" />
&lt;/util:list>
</pre>

+ 基于Json的JsonServiceRegistryDao,这是缺省的配置方式,。<br>
在application context启动时读取json文件，dao定义文件的路径，递归查找相关的json文件.json问的变更可立即生效。如果把serviceId定义成正规表达式，要注意转义。
  + 定义dao, 位于<em>deployerConfigContext.xml<em> <br>
    `<alias name="jsonServiceRegistryDao" alias="serviceRegistryDao" />`
  + dao查找路径, cas.properties<br>
    `service.registry.config.location=classpath:services`
  + Json文件内容
    <pre>{
    "@class" : "org.jasig.cas.services.RegexRegisteredService",
    "serviceId" : "testId",
    "name" : "testId",
    "id" : 1,
    "evaluationOrder" : 0
    }</pre>

  + json文件名推荐<br>
    `JSON fileName = serviceName + "-" + serviceNumericId + ".json"
`
  + [支持注释的句法](http://hjson.org/), 注意最后一行的逗号
  <pre>{
  /*
    Generic service definition that applies to https/imaps urls 
    that wish to register with CAS for authentication.
  */
  "@class" : "org.jasig.cas.services.RegexRegisteredService",
  "serviceId" : "^(https|imaps)://.*",
  "name" : "HTTPS and IMAPS",
  "id" : 10000001,
}
</pre>

+ 基于mongo的MongoServiceRegistryDao
<pre></pre>

+ 基于ldap的LdapServiceRegistryDao
<pre></pre>

+ 基于jpa的JpaServiceRegistryDaoImpl
<pre></pre>

