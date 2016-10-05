###为什么选用django
  python代表最优的设计模式，最简单的句法。而django是公认的流行框架。

###安装
######python安装
python命令和python3命令检查版本。
######数据库安装
除了数据库后台，还要安装相应的python客户端/绑定/驱动/DB API driver.
mysqlclient，替代过时的MySQLdb。Django提供ORM到驱动的适配器
MySQL Connector/Python， oracle提供的纯python驱动，自己包含ORM到驱动的适配器。
######生产环境安装apache 和 mod_wsgi
生产环境下有两种工作模式：嵌入式和后台daemon式，前者把python引入到apache内部，所有的代码都在内存，效率较高。后者mod_wsgi生出独立的daemon进程来处理请求。可以独立于apache启动。[参考](https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/modwsgi/)

[1](https://docs.djangoproject.com/en/1.10/topics/install/)
[2](https://docs.djangoproject.com/en/1.10/ref/databases/#mysql-notes)
[3](https://tutorial.djangogirls.org/en/django_start_project/)  

######安装django
首先安装pip， `pip -V`显示版本。 `pip install -U pip`更新
安装virtualenv 
> `sudo pip install virtualenv && virtualenv ENV`
`virtualenv --python=/usr/bin/python3 ENV3 && cd ENV3 && pip install django`
或者 `pip install django~=1.10.0`

+ ENV是用来存放虚拟环境的目录。lib,include目录包含库文件，包。所有安装的package在ENV/lib/pythonX.X/site-packages/
+ bin可执行脚本
+ pip,setuptools, python工具
+ 激活脚本`source bin/activate`更改系统环境变量$PATH,让使用虚拟环境的可执行文件。如果你直接在bin目录下执行或者指定目录执行，不用执行activate。`deactivate`使设置失效。
+ 去掉虚拟环境，确保`deactivate`之后，删掉ENV目录就行。
+ 不用virtualenv的解析器。在mod_python或者mod_wsgi环境下，

`cd ENV && source bin/activate && pip install Django && python3 -m django --version`
 <code>

     >>> import django
     >>> print(django.get_version())
 </code>

######建立项目
[ref1](https://www.djangoproject.com/start/)

`django-admin startproject mysite`

+ manage.py: 与这个django项目交互的命令行工具。
+ The inner mysite/ 项目的python包
+ mysite/__init__.py: 空文件，告诉Python这个目录是个Python包。
+ mysite/settings.py: dango项目的设置。
+ mysite/urls.py: django的url设置。驱动的站点url。
+ mysite/wsgi.py: WSGI web服务器的入口。

启动项目`python manage.py runserver`


###容器运行django
[github](https://github.com/dockerfiles/django-uwsgi-nginx)
[uwsgi](https://uwsgi.readthedocs.io/en/latest/tutorials/Django_and_nginx.html)