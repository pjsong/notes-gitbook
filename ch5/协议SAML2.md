## SAML2
[参考](https://en.wikipedia.org/wiki/SAML_2.0)

+ Assertion围绕一个Subject, 由statement组成，规范定义的三种Statement: `Authentication`,`Attribute`,`Authorization decision`
+ 重要的Assertion类型`bearer`用于sso，如一下idp(identity provider)发送给sp(service provider)的Assertion:<pre><saml:Assertion
   xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
   xmlns:xs="http://www.w3.org/2001/XMLSchema"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   ID="b07b804c-7c29-ea16-7300-4f3d6f7928ac"
   Version="2.0"
   IssueInstant="2004-12-05T09:22:05">
   <saml:Issuer>https://idp.example.org/SAML2</saml:Issuer>
   <ds:Signature
     xmlns:ds="http://www.w3.org/2000/09/xmldsig#">...</ds:Signature>
   <saml:Subject>
     <saml:NameID
       Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">
       3f7b3dcf-1674-4ecd-92c8-1544f346baf8
     </saml:NameID>
     <saml:SubjectConfirmation
       Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
       <saml:SubjectConfirmationData
         InResponseTo="aaf23196-1773-2113-474a-fe114412ab72"
         Recipient="https://sp.example.com/SAML2/SSO/POST"
         NotOnOrAfter="2004-12-05T09:27:05"/>
     </saml:SubjectConfirmation>
   </saml:Subject>
   <saml:Conditions
     NotBefore="2004-12-05T09:17:05"
     NotOnOrAfter="2004-12-05T09:27:05">
     <saml:AudienceRestriction>
       <saml:Audience>https://sp.example.com/SAML2</saml:Audience>
     </saml:AudienceRestriction>
   </saml:Conditions>
   <saml:AuthnStatement
     AuthnInstant="2004-12-05T09:22:00"
     SessionIndex="b07b804c-7c29-ea16-7300-4f3d6f7928ac">
     <saml:AuthnContext>
       <saml:AuthnContextClassRef>
         urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
      </saml:AuthnContextClassRef>
     </saml:AuthnContext>
   </saml:AuthnStatement>
   <saml:AttributeStatement>
     <saml:Attribute
       xmlns:x500="urn:oasis:names:tc:SAML:2.0:profiles:attribute:X500"
       x500:Encoding="LDAP"
       NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"
       Name="urn:oid:1.3.6.1.4.1.5923.1.1.1.1"
       FriendlyName="eduPersonAffiliation">
       <saml:AttributeValue
         xsi:type="xs:string">member</saml:AttributeValue>
       <saml:AttributeValue
         xsi:type="xs:string">staff</saml:AttributeValue>
     </saml:Attribute>
   </saml:AttributeStatement>
 </saml:Assertion></pre>
其中，五个关键元素

  + `<saml:Issuer>` idp的id
  + `<ds:Signature>` Assertion签名
  + `<saml:Subject>` 已认证的principle
  + `<saml:Conditions>` Assertion生效的条件
  + `<saml:AuthnStatement>` idp认证动作描述
  + `<saml:AttributeStatement>` principle关联的多值属性

assertion封装的信息：Assertion `(b07b804c-7c29-ea16-7300-4f3d6f7928ac)` 在时间`2004-12-05T09:22:05Z` 由idp`(https://idp.example.org/SAML2)` 针对subject `(3f7b3dcf-1674-4ecd-92c8-1544f346baf8)` 独家发放给sp`(https://sp.example.com/SAML2)`.

authentication封装的信息： `<saml:Subject>`中指定的principle在时间`2004-12-05T09:22:00` 通过ssl传输密码方式被认证。

attribute封装信息：`<saml:Subject>`中指定的principle是学院的staff member。

##协议
#####AuRP(Authentication Request Protocal)
SAML1.1中SSO Profile由idp发起，2.0中，由sp发送认证请求发起。ARP成为SAML2.0的新功能。
当principle(sp)希望获得包含authentication statement的assertion，发送请求<pre><samlp:AuthnRequest
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="aaf23196-1773-2113-474a-fe114412ab72"
    Version="2.0"
    IssueInstant="2004-12-05T09:21:59"
    AssertionConsumerServiceIndex="0"
    AttributeConsumingServiceIndex="0">
    <saml:Issuer>https://sp.example.com/SAML2</saml:Issuer>
    <samlp:NameIDPolicy
      AllowCreate="true"
      Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient"/>
  </samlp:AuthnRequest></pre>

通过浏览器给idp，idp认证后返回响应。

#####ArRP(Artifact Resolution Protocal)
SAML消息要不传值，要不传引用，就是Artifact。传Artifact的话，接收方发送请求给sp,解析Artifact<pre>  `<samlp:ArtifactResolve
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="_cce4ee769ed970b501d680f697989d14"
    Version="2.0"
    IssueInstant="2004-12-05T09:21:58">
    <saml:Issuer>https://idp.example.org/SAML2</saml:Issuer>
    <!-- an ArtifactResolve message SHOULD be signed -->
    <ds:Signature
      xmlns:ds="http://www.w3.org/2000/09/xmldsig#">...</ds:Signature>
    <samlp:Artifact>AAQAAMh48/1oXIM+sDo7Dh2qMp1HM4IF5DaRNmDj6RdUmllwn9jJHyEgIi8=</samlp:Artifact>
  </samlp:ArtifactResolve>`</pre>
接下来sp响应返回相应的saml元素。 <br>这个协议形成HTTP Artifact Binding的基础。


#####HTTP Artifact Binding
最多的是Redirect binding和POST binding, 比如sp用redirect发送请求，idp用post返回相应。

+ HTTP Redirect Binding。因为url长度有限，常常用来做一些短消息如`<samlp:AuthnRequest>`的绑定。长的就用POST。<pre>`https://idp.example.org/SAML2/SSO/Redirect?SAMLRequest=fZFfa8IwFMXfBb9DyXvaJtZ1BqsURRC2
 Mabbw95ivc5Am3TJrXPffmmLY3%2FA15Pzuyf33On8XJXBCaxTRmeEhTEJQBdmr%2FRbRp63K3pL5rPhYOpkVdY
 ib%2FCon%2BC9AYfDQRB4WDvRvWWksVoY6ZQTWlbgBBZik9%2FfCR7GorYGTWFK8pu6DknnwKL%2FWEetlxmR8s
 BHbHJDWZqOKGdsRJM0kfQAjCUJ43KX8s78ctnIz%2Blp5xpYa4dSo1fjOKGM03i8jSeCMzGevHa2%2FBK5MNo1F
 dgN2JMqPLmHc0b6WTmiVbsGoTf5qv66Zq2t60x0wXZ2RKydiCJXh3CWVV1CWJgqanfl0%2Bin8xutxYOvZL18NK
 UqPlvZR5el%2BVhYkAgZQdsA6fWVsZXE63W2itrTQ2cVaKV2CjSSqL1v9P%2FAXv4C`</pre>

+ HTTP Post Binding. sp和idp都能用。比如sp发送给浏览器表单<pre> `<form method="post" action="https://idp.example.org/SAML2/SSO/POST" ...>
    <input type="hidden" name="SAMLRequest" value="''request''" />
    ... other input parameter....
  </form>`</pre>
SAMLRequest的值是一个Base64编码的`<samlp:AuthnRequest>`元素，通过浏览器发送给idp,idp返回<pre>`<form method="post" action="https://sp.example.com/SAML2/SSO/POST" ...>
    <input type="hidden" name="SAMLResponse" value="''response''" />
    ...
  </form>`</pre>

+ HTTP Artifact Binding. (略)

##SSO用例
包含ua(user agent),sp, idp. sp可以有四种绑定方式，idp三种。假定sp用redirect， idp用post，过程是

![参考图](https://upload.wikimedia.org/wikipedia/en/3/38/Saml2-browser-sso-post.gif)

1. https://sp.example.com/myresource
2. 响应<pre>` <form method="post" action="https://idp.example.org/SAML2/SSO/POST" ...>
    <input type="hidden" name="SAMLRequest" value="request" />
    <input type="hidden" name="RelayState" value="token" />
    ...
    <input type="submit" value="Submit" />
  </form>`</pre>其中SAMLRequest的value是<pre>`  <samlp:AuthnRequest
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="identifier_1"
    Version="2.0"
    IssueInstant="2004-12-05T09:21:59"
    AssertionConsumerServiceIndex="0">
    <saml:Issuer>https://sp.example.com/SAML2</saml:Issuer>
    <samlp:NameIDPolicy
      AllowCreate="true"
      Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient"/>
  </samlp:AuthnRequest>`</pre>的base64编码。

3. 浏览器请求<pre>`POST /SAML2/SSO/POST HTTP/1.1
Host: idp.example.org
Content-Type: application/x-www-form-urlencoded
Content-Length: nnn
SAMLRequest=request&RelayState=token`</pre>

4. idp响应<pre>`<form method="post" action="https://sp.example.com/SAML2/SSO/POST" ...>
    <input type="hidden" name="SAMLResponse" value="response" />
    <input type="hidden" name="RelayState" value="token" />
    ...
    <input type="submit" value="Submit" />
  </form>`</pre>SAMLResponse参数的值也是message的base64编码

5. 请求sp<pre>`POST /SAML2/SSO/POST HTTP/1.1
Host: sp.example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: nnn
SAMLResponse=response&RelayState=token
`</pre>

6. sp创建securitycontext, 重定向到resource
7. `https://sp.example.com/myresource`


#####两个都用redirect
![](https://upload.wikimedia.org/wikipedia/en/5/54/Saml2-browser-sso-artifact.gif)

###idpd， idp发现协议
1. Common Domain
2. Common Domain Cookie
3. Common Domain Cookie Writing Service
4. Common Domain Cookie Reading Service

比如：`example.co.uk`和`example.de`都属于`example.com`, 那么`example.com`就是一个Common Domain， 其他都是子域名如`uk.example.com`,`de.example.com`

那 Common Domain Cookie就存储最近访问的idp。认证成功，idp请求一个Common Domain Cookie Writing Service，这个service把idp唯一标识写入cookie，sp当收到没有认证请求，发送Common Domain Cookie Reading Service请求来获得最近使用的idp。

###Assertion 查询/请求协议
常常与soap一起使用

1. `<samlp:AssertionIDRequest>` 根据id请求Assertion。
2. `<samlp:SubjectQuery>` 定义新的基于subject的SAML查询。
3. `<samlp:AuthnQuery>` 根据给定的subject请求authentication assertions
4. `<samlp:AttributeQuery>` 根据给定的subject请求idp的 attributes
5. `<samlp:AuthzDecisionQuery>` 从信任的第三方请求authorization decision

attribute query<pre>`  <samlp:AttributeQuery
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    ID="aaf23196-1773-2113-474a-fe114412ab72"
    Version="2.0"
    IssueInstant="2006-07-17T20:31:40">
    <saml:Issuer
      Format="urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName">
      CN=trscavo@uiuc.edu,OU=User,O=NCSA-TEST,C=US
    </saml:Issuer>
    <saml:Subject>
      <saml:NameID
        Format="urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName">
        CN=trscavo@uiuc.edu,OU=User,O=NCSA-TEST,C=US
      </saml:NameID>
    </saml:Subject>
    <saml:Attribute
      NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"
      Name="urn:oid:2.5.4.42"
      FriendlyName="givenName">
    </saml:Attribute>
    <saml:Attribute
      NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"
      Name="urn:oid:1.3.6.1.4.1.1466.115.121.1.26"
      FriendlyName="mail">
    </saml:Attribute>
  </samlp:AttributeQuery>`</pre>


##SAML Metadata
+ idp接受sp的`<samlp:AuthnRequest>`之后，怎么知道sp是真的。他要看metadata中信任的sp列表。
+ idp怎么知道认证响应后，把用户重定向到哪里。idp看metadata中sp预先安排的endpoint地址
+ sp怎么知道返回来自于真正的idp。sp用metadata中的idp公钥检查assertion签名
+ sp怎么知道找谁解析idp提供的artifact。sp查找metadata预先定义的idp artifact解析服务地址。

idp发布自己的metadata<pre>`<md:EntityDescriptor
    xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
    entityID="https://idp.example.org/SAML2">
    <!-- insert ds:Signature element -->
    <!-- insert md:IDPSSODescriptor element (below) -->
    <!-- insert md:AttributeAuthorityDescriptor element (not shown) -->
    <md:Organization>
      <md:OrganizationName xml:lang="en">
        SAML Identity Provider 
      </md:OrganizationName>
      <md:OrganizationDisplayName xml:lang="en">
        SAML Identity Provider @ Some Location
      </md:OrganizationDisplayName>
      <md:OrganizationURL xml:lang="en">
        http://www.idp.example.org/
      </md:OrganizationURL>
    </md:Organization>
    <md:ContactPerson contactType="technical">
      <md:SurName>SAML IdP Support</md:SurName>
      <md:EmailAddress>mailto:saml-support@idp.example.org</md:EmailAddress>
    </md:ContactPerson>
  </md:EntityDescriptor>`</pre>

idp管理sso服务metadata<pre>`  <md:IDPSSODescriptor
    protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo>
        <ds:KeyName>IdP SSO Key</ds:KeyName>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:ArtifactResolutionService isDefault="true" index="0"
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:SOAP"
      Location="https://idp.example.org/SAML2/ArtifactResolution"/>
    <md:NameIDFormat>
      urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
    </md:NameIDFormat>
    <md:NameIDFormat>
      urn:oasis:names:tc:SAML:2.0:nameid-format:transient
    </md:NameIDFormat>
    <md:SingleSignOnService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      Location="https://idp.example.org/SAML2/SSO/POST"/>
    <md:SingleSignOnService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Artifact"
      Location="https://idp.example.org/SAML2/Artifact"/>
    <saml:Attribute
      NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"
      Name="urn:oid:1.3.6.1.4.1.5923.1.1.1.1"
      FriendlyName="eduPersonAffiliation">
      <saml:AttributeValue>member</saml:AttributeValue>
      <saml:AttributeValue>student</saml:AttributeValue>
      <saml:AttributeValue>faculty</saml:AttributeValue>
      <saml:AttributeValue>employee</saml:AttributeValue>
      <saml:AttributeValue>staff</saml:AttributeValue>
    </saml:Attribute>
  </md:IDPSSODescriptor>`</pre>

sp的metadata<pre>` <md:EntityDescriptor
    xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
    entityID="https://sp.example.com/SAML2">
    <!-- insert ds:Signature element -->
    <!-- insert md:SPSSODescriptor element (see below) -->
    <md:Organization>
      <md:OrganizationName xml:lang="en">
        SAML Service Provider 
      </md:OrganizationName>
      <md:OrganizationDisplayName xml:lang="en">
        SAML Service Provider @ Some Location
      </md:OrganizationDisplayName>
      <md:OrganizationURL xml:lang="en">
        http://www.sp.example.com/
      </md:OrganizationURL>
    </md:Organization>
    <md:ContactPerson contactType="technical">
      <md:SurName>SAML SP Support</md:SurName>
      <md:EmailAddress>mailto:saml-support@sp.example.com</md:EmailAddress>
    </md:ContactPerson>
  </md:EntityDescriptor>`</pre>

sp主要的服务组件assertion consumer service <pre>`  <md:SPSSODescriptor
    protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo>
        <ds:KeyName>SP SSO Key</ds:KeyName>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:ArtifactResolutionService isDefault="true" index="0"
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:SOAP"
      Location="https://sp.example.com/SAML2/ArtifactResolution"/>
    <md:NameIDFormat>
      urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
    </md:NameIDFormat>
    <md:NameIDFormat>
      urn:oasis:names:tc:SAML:2.0:nameid-format:transient
    </md:NameIDFormat>
    <md:AssertionConsumerService isDefault="true" index="0"
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      Location="https://sp.example.com/SAML2/SSO/POST"/>
    <md:AssertionConsumerService index="1"
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Artifact"
      Location="https://sp.example.com/SAML2/Artifact"/>
    <md:AttributeConsumingService isDefault="true" index="1">
      <md:ServiceName xml:lang="en">
        Service Provider Portal
      </md:ServiceName>
      <md:RequestedAttribute
        NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"
        Name="urn:oid:1.3.6.1.4.1.5923.1.1.1.1"
        FriendlyName="eduPersonAffiliation">
      </md:RequestedAttribute>
    </md:AttributeConsumingService>
  </md:SPSSODescriptor>`</pre>