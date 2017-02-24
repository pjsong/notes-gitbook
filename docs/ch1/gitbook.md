# gitbook的使用
##gitbook安装
[ref](https://github.com/GitbookIO/gitbook/blob/master/docs/setup.md)

---
### 使用github库管理gitbook
[faq](https://help.gitbook.com/github/can-i-host-on-github.html)

+ gitbook.com-> account settings 设置permission
+ gitbook.com找到book进入settings，点击左边栏github， 链接book到github库
+ 错误提示`An user is already associated to this github account.`
+ 改用github账号登陆，在book的setting栏github下选择repo， 添加webhook
+ 在账号settings->github选择reconnect，授权
+ domain下检查新的地址
+ domain下增加域名，可用。

### 本地测试gitbook书籍
+ 安装环境，参考[vagrant](ch8/javascript-angular2.md)
+ 安装gitbook `npm install gitbook-cli -g`
+ 运行 `$ gitbook init`初始化
+ `$gitbook serve`启动
+ `$gitbook build` 建站



------
###### 问题1： 在线的编辑器太慢，下载来的线下编辑器又连不上。
用别的编辑器。同时git设置全局代理。

###### 问题2： 怎么clone到本地
对于新创建的book，如果你是第三方登陆的，要在setting里面设置一个密码，然后再git命令行放入用户名/密码
> `git clone https://nameInProfile:passwordYouJustSet@yourGitAddress`

###### 问题3：怎么使用自己的域名
+ 进入设置页面，填写好域名
+ 进入域名注册商，把www变成一个CNAME,把url写入`www.gitbooks.io`
+ 如果要用顶级域名，要把顶级域名forward到www,在万网这个要备案。可以不管他，不影响www的访问就行。