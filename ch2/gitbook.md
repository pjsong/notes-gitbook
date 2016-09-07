# gitbook的使用

###### 问题1： 在线的编辑器太慢，下载来的线下编辑器又连不上。
用别的编辑器。同时git设置全局代理。

###### 问题2： 怎么clone到本地
对于新创建的book，如果你是第三方登陆的，要在setting里面设置一个密码，然后再git命令行放入用户名/密码
> `git clone https://nameInProfile:passwordYouJustSet@yourGitAddress`

###### 问题3：怎么使用自己的域名
+ 进入设置页面，填写好域名
+ 进入域名注册商，把www变成一个CNAME,把url写入`www.gitbooks.io`
+ 如果要用顶级域名，要把顶级域名forward到www,在万网这个要备案。可以不管他，不影响www的访问就行。