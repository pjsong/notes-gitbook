# jekyll运行须知
---
##1. 启动
>`sudo su -`
>
>`jekyll serve --host '0.0.0.0' -w`

###1.1. 问题
####1.1.1. 解决启动报错 
<pre>jekyll 3.2.0 | Error:  getaddrinfo: Name or service not known</pre>
>没有切换到root,使用`sudo su -`

####1.1.2. 参考说`jekyll serve ` 时如果使用 `--detach`，不能实时编译`config.yml`。在vagrant环境下，不用该参数也不能实时编译，如果牵涉到css，更是要运行`jekyll build`才行
> 另外开一个ssh, 运行`jekyll build --watch`


------
##2. <del>加入多语言支持</del>
[github地址](https://github.com/Anthony-Gaudino/jekyll-multiple-languages-plugin)

###2.0. 本节遭到删除原因
+ 增加插件导致Jekyll变得复杂。
+ 默认模板引擎的处理能力不是最好。准备考虑下[Roots](http://roots.cx/) + [pug](https://github.com/pugjs/pug)的方式。
+ 多语言属于动态部分，不必在静态处理中实现。
+ 如果要在静态中实现多语言，不如从项目的高度分开。
