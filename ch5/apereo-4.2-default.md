## 缺省流程

### 启动debug
进入目录执行gradle task

    cd ~/Document/git/cas-gradle-overlay-template
    sudo gradle jettyRunWar

eclipse下远程debug cas-overlay-template.


### login-webflow


1. webapp-actions/.../InitialFlowSetupAction
  + 检查cookie， service参数， service访问策略
+  webapp-actions/.../TicketGrantingTicketCheckAction
  + 检查TGT，不存在进入gatewayRequestCheck
+ gateWay不存在，进入serviceAuthorizationCheck,
+ service不存在进入generateLoginTicket
+ 新生成LT打头的ticket， 返回viewLoginForm也就是casLoginView
+ casLoginview submit之后，进入AuthenticationViaFormAction.submit方法
+ 返回success进入sendTicketGrantingTicketAction,添加TicketGrantingTicketId到cookie。
+ 进入serviceCheck,service为空，进入endState: viewGenerateLoginSuccess,返回principle,显示casGenericSuccessView
    
###CAS协议服务访问流程
1. 浏览器跳转https:yourCompany.com/cas/login?service=http://client.com/login
2. 接着跳转https：//client.com/login?ticket=st-xxxxxx, st可以获取用户信息
3. service发送验证到cas：https://yourcompany.com/cas/ServiceValidate?service=http://client.com/login?ticket=st-xxxxx
4. cas返回
<pre>
    &lt;cas:serviceResponse xmlns:cas='http:......'>
      &lt;cas:authenticationSuccess>
        &lt;cas:user>xxxx&lt;/cas>
        &lt;cas:attributes>
          &lt;cas:sn>xxxx&lt;/cas:sn>
......
</pre>

###OATH协议服务访问流程
1. 浏览器跳转 `https:yourCompany.com/cas/oath2.0/authorize?client_id=clientId&redirect_uri={redirectUri}`
2. 验证通过，跳转`{redirectUri}?code={stCode}`
3. service发送验证到
   `https:yourCompany.com/cas/oath2.0/accessToken?response_type=code&client_id={clientId}&redirect_uri={redirectUri}&client_secret={clientSecret}&code={stCode}`
4. 返回 accessToken
   <pre>
     {"access-token":"{TGT}","expires":"7200"}
   </pre>
5.  `https:yourCompany.com/cas/oath2.0/profile?accessToken={TGT}&attributes=array
6.  返回{"id":"uuidxxx","attributes":["sid":"xxx"...]}<br>不指定attributes=array返回{"id":"uuidxxx","attributes":{"sid":"xxx.....}}