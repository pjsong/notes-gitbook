# 构建github上的静态站点

## 1. [新建库](https://pages.github.com/)
+ 用`username.github.io`作为库的名字。
+ 添加index.html,本地commit并push
+ 访问`username.github.io`


## 2. [使用jekyll](https://help.github.com/categories/github-pages-basics/)
+ 将Jekyll项目直接push，过滤掉`_site`文件夹。github可以会帮你直接编译。

## 3. [github page类型](https://jekyllrb.com/docs/github-pages/)
+ 在项目中添加`gh-pages`分支。这个分支下的内容将用jekyll提交，可以用`username.github.io/project`访问