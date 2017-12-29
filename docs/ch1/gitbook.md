# gitbook

## 特性

+ 基于nodejs
+ 可以通过book.json文件(平行与项目文档根目录)添加自己的js脚本，[参考](https://github.com/GitbookIO/plugin-scripts)。
+ 不带数据库，全静态

## 优点

+ 编写文档简洁，一步到位
+ gitbook提供免费主机，可使用自己的域名

## 缺点

+ 没有模板的概念，不合适用于CMS，因此需要后续的jekyll或者hexo等其他工具来补充。

## gitbook安装

[ref](https://github.com/GitbookIO/gitbook/blob/master/docs/setup.md)

## 使用github库管理gitbook

[faq](https://help.gitbook.com/github/can-i-host-on-github.html)

+ gitbook.com-> account settings 设置permission
+ gitbook.com找到book进入settings，点击左边栏github， 链接book到github库
+ 错误提示`An user is already associated to this github account.`
+ 改用github账号登陆，在book的setting栏github下选择repo， 添加webhook
+ 在账号settings->github选择reconnect，授权
+ domain下检查新的地址
+ domain下增加域名，可用。

## 问题

### 问题1： 怎么clone到本地

对于新创建的book，如果你是第三方登陆的，要在setting里面设置一个密码，然后再git命令行放入用户名/密码
> `git clone https://nameInProfile:passwordYouJustSet@yourGitAddress`

### 问题2：怎么使用自己的域名

+ 进入设置页面，填写好域名
+ 进入域名注册商，把www变成一个CNAME,把url写入`www.gitbooks.io`
+ 如果要用顶级域名，要把顶级域名forward到www,在万网这个要备案。可以不管他，不影响www的访问就行。

### 本地测试

<https://github.com/GitbookIO/gitbook-cli>

```bash
gitbook help
gitbook install
gitbook build
gitbook serve
```

到localhost:4000找自己的网站
