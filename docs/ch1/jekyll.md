# Jekyll

## 特性

+ 基于Ruby On Rails
+ 不带数据库，全静态

## 优点

+ 可以使用页面模板，自己设置样式
+ 开源的样式资源较多， 可供参考

## 缺点

+ 获取web服务能力需要开发
+ 对于不熟悉Ruby生态的同学，进一步开发是个挑战。

## docker结合

[参考](https://kristofclaes.github.io/2016/06/19/running-jekyll-locally-with-docker/)

## 启动

~~bash
`sudo su -`
`jekyll serve --host '0.0.0.0' -w`
~~

## 问题

### 解决启动报错

> jekyll 3.2.0 | Error:  getaddrinfo: Name or service not known

没有切换到root,使用`sudo su -`

## 安装

### [新版本](https://learn.cloudcannon.com/jekyll/install-jekyll-on-linux/)

```bash
    sudo apt-get update && sudo apt-get install ruby-full && sudo gem install jekyll
```

## 使用docker + jekyllbootstrap

###jekyllbootstrap

[ref install by jekyllbootstrap](jekyllbootstrap.com/usage/jekyll-quick-start.html)

```bash
git clone --depth 1 https://github.com/plusjade/jekyll-bootstrap.git

cd jekyll-bootstrap/

git remote set-url origin git@github.com:pjsong/vending-machine-manual.git

git push -u origin master
```

## 项目目录结构

### [图示](https://jekyllrb.com/docs/structure/)

>
├── _config.yml
├── _drafts
|   ├── begin-with-the-crazy-ideas.textile
|   └── on-simplicity-in-technology.markdown
├── _includes
|   ├── footer.html
|   └── header.html
├── _layouts
|   ├── default.html
|   └── post.html
├── _posts
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.textile
|   └── 2009-04-26-barcamp-boston-4-roundup.textile
├── _data
|   └── members.yml
├── _site
├── .jekyll-metadata
└── index.html

## 相关知识

+ [官网](jekyllrb.com)
+ [中文官网](http://jekyllrb.cn/)
+ [liquid模板学习](https://shopify.github.io/liquid/)
+ [jekyll使用资源](http://jekyll.tips/)
+ [jekyll用bootstrap建博客](https://learn.cloudcannon.com/)
+ [用github page](https://jekyllrb.com/docs/github-pages/)
+ [怎么使用github page](http://jmcglone.com/guides/github-pages/)