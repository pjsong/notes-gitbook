# 从 wordpress 迁移博客到 jekyll
---
##为什么要迁移
静态内容不适合放到数据库，必须要方便编辑。

---
## 前提
请使用pjsong/jekyll virtual box
## 步骤
通过访问wp的数据库，把内容写入_post文件夹中的md文件。
[参考](https://import.jekyllrb.com/docs/home/)

###搭建环境
1. 使用pjsong/jekyll作为box，vagrant ssh进去。
2. 运行 `$ gem install jekyll-import`执行报错，需要手动安装一些依赖包。
    > zlib is missing, necessary for building xx......
    > `sudo yum install zlib-devel -y`， 再次运行[参考](https://github.com/flapjack/omnibus-flapjack/issues/72)
3. 将运行代码保存到文件import.ruby, chmod +x. 运行报错提示<pre>Whoops! Looks like you need to install 'sequel' before you can use this importer</pre> 运行`gem install sequel`, 仍然有错， 继续运行`gem install unidecode`, 仍然报错， 安装mysql`gem install mysql`, 安装报错` yum install mysql mysql-server mysql-devel`安装成功， `gem install htmlentities`, `gem install ffi --platform=ruby`, `gem install mysql2`
4. 运行时，出现连接问题。把host改成ip，把连接改成远程账户.
5. 成功.

