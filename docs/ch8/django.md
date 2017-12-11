# 关于django

## 为什么选用django

  python代表最优的设计模式，最简单的句法。而django是公认的流行框架。

## 安装

### python安装

python命令和python3命令检查版本。

#### 使用虚拟环境：

    pip install virtualenv && pip install virtualenv --upgrade&& mkdir proj && cd proj && virtualenv . && source bin/activate

    pip freeze && pip install django==1.10 && pip uninstall django  -y && pip install django && pip install django --upgrade

#### 创建项目

    django-admin.py startproject trydjango && cd trydjango && python manage.py makemigrations && python manage.py migrate && python manage.py runserver 8888

#### 项目准备

    python manage.py createsuperuser --user username --noinput or --email xxxxxx something like this.

#### 经典blog

    pyhton manage.py startapp posts

    + INSTALLED_APPS添加name
    + models.py添加class Post(models.Model): CharField(max_length=200), TextField(), DatetimeField(auto_now=True, auto_now_add=False)<em>update, true is for add</em>, __unicode__ is for python2, __str__ for python3
    + python manage.py makemigrations && python manage.py migrate
    + admin.py添加admin.site.register(Post)

#### [修改admin](docs.djangoproject.com/en/1.9/ref/contrib/admin/)

admin.py添加

    class PostModelAdmin(admin.ModdelAdmin):
        list_display = ["title","updated","timestamp"]
        list_display_links = [updated]
        list_filter = ["updated","timestamp"]
        search_fields = ["title", "content"]
        list_editable = ["title"]
        class Meta:
            model = Post

#### view

[regular expressions](github.com/codingforentrepreneurs/Guides/all/common_url_regex.md)
FunctionBasedViews vs ClassBasedViews

    def posts_home(request):
        return HttpResponse(`"<h1>hello</h1>"`)

    urlpatterns = [
        url(r'^posts/$', posts.views.posts_home),# include("posts.urls")
    ]

##### template

+ BASE_DIR: where manage.py inside,
+ TEMPLATE: DIRS setting the directory,
+ render(request, "index.html", {}),
+ error to see how it load templates

     if request.user.is_authenticated():
        context = {}
     else:
        context = {}

#### Queryset

首先用python shell `python manage.py shell`

    from posts.models import Post
    Post.objects.all()
    Post.objects.filter(title="adb")
    Post.objects.filter(title__icontains="abc")
    Post.object.create(title="abc",content='abc')
    queryset=Post.objects.all()
    for obj in queryset
        print obj.title
        print obj.id
        print obj.id
    context = {"object_list":queryset}
    {{object_list}}
    {% for obj in obj_list %}
    {{ obj.title }}
    {% endfor %}

#### getItem

[ref](https://www.youtube.com/watch?v=M5ytu6yzod0&list=PLEsfXFp6DpzQFqfCur9CJ4QnKQTVXUsRy&index=18)

    instance = get_object_or_404(Post, id=1)
    url(r'^detail/(?P<id>\d+)/$', post_detail),
    def post_detail(request, id=None)

P参数，`<id>`或者`<pk>`为关键字参数，request后面的参数名可以是其他
urls 后面的name = "detail", 在htmlpage `<a href='{% url "detail" id=obj.id %}'></a>`避免url硬编码。把url编码写入model

    def get_abs_url(self):
    return "/posts/%s/" %(self.id)
    or return django.core.urlresolvers.reverse("detail", kwargs={"id": self.id})

在htmlpage `<a href='{% obj.get_abs_url %}'></a>`

#### Model Form && create view

    #############forms.py part    #############
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model= Post
        fields = ["title",]

from .forms import PostForm
    #############view part###############
    def post_create(request):
        form = PostForm(request.POST or None)
        if form.is_valid():
            instance = form.save(commit=False)
        print form.cleaned_data.get("content")
            instance.save()
        return HttpResponseRedirect(instance.get_abs_url())
        #form = PostForm
        context = {"form": form,}
        #print request.method +' ' + request.POST.get("content")
        #Post.objects.create()
        return render(request, "post_detail.html", context)
    #############html part    #############

```html

    <form method='POST'>{% csrf_token %}
    {{ form.as_p }}
    <input type='submit' value='create' />
    </form>
```

#### update single record

[message](docs.djangoproject.com/en/1.9/ref/contrib/messages)

```python
    def post_update(request, id=None):
        instance = get_object_or_404(Post, id=id)
        form = PostForm(request.Post or None, instance = instance)
        if form.is_valid():
        instance = form.save(commit=False)
        instance.save()
            message.success(request, "succeed")
        return HttpResponseRedirect(instance.get_abs_url())
        else:
            message.error(request, "failed")
      #####################the same with detail page###############

#### delete record

    def post_delete(request, id=None):
    instance = get_object_or_404(Post, id=id)
    instance.delete()
    message.success(request, "succeed")
    return jdango.shortcuts.redirect("posts:list")
```

#### template example

```djangotemplate
    <title>{% block head_title%} abc {% endblock head_title %}
    {% extends "base.html" %}
    {% block head_title %} {{instance.title}} | {{block.super}} {{% endblock head_title %}}
    {% block content%}
    {% block.super %}
    {% endblock %}
```

#### 数据库安装

[参考](https://docs.djangoproject.com/en/1.10/ref/databases/)
除了数据库后台，还要安装相应的python客户端/绑定/驱动/DB API driver.
mysqlclient，替代过时的MySQLdb。Django提供ORM到驱动的适配器
MySQL Connector/Python， oracle提供的纯python驱动，自己包含ORM到驱动的适配器。
[参考](https://realpython.com/learn/start-django/)

#### 生产环境安装apache 和 mod_wsgi

生产环境下有两种工作模式：嵌入式和后台daemon式，前者把python引入到apache内部，所有的代码都在内存，效率较高。后者mod_wsgi生出独立的daemon进程来处理请求。可以独立于apache启动。[参考](https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/modwsgi/)

[1](https://docs.djangoproject.com/en/1.10/topics/install/)
[2](https://docs.djangoproject.com/en/1.10/ref/databases/#mysql-notes)
[3](https://tutorial.djangogirls.org/en/django_start_project/)

#### 安装django

首先安装pip， `pip -V`显示版本。 `pip install -U pip`更新
安装virtualenv

```bash
sudo pip install virtualenv && virtualenv ENV`
virtualenv --python=/usr/bin/python3 ENV3 && cd ENV3 && pip install django`
```

or

```bash
 `pip install django~=1.10.0`
```

+ ENV是用来存放虚拟环境的目录。lib,include目录包含库文件，包。所有安装的package在ENV/lib/pythonX.X/site-packages/
+ bin可执行脚本
+ pip,setuptools, python工具
+ 激活脚本`source bin/activate`更改系统环境变量$PATH,让使用虚拟环境的可执行文件。如果你直接在bin目录下执行或者指定目录执行，不用执行activate。`deactivate`使设置失效。
+ 去掉虚拟环境，确保`deactivate`之后，删掉ENV目录就行。
+ 不用virtualenv的解析器。在mod_python或者mod_wsgi环境下，

`cd ENV && source bin/activate && pip install Django && python3 -m django --version`

     >>> import django
     >>> print(django.get_version())

#### 建立项目

[ref1](https://www.djangoproject.com/start/)

`django-admin startproject mysite`

+ manage.py: 与这个django项目交互的命令行工具。
+ The inner mysite/ 项目的python包
+ mysite/__init__.py: 空文件，告诉Python这个目录是个Python包。
+ mysite/settings.py: dango项目的设置。
+ mysite/urls.py: django的url设置。驱动的站点url。
+ mysite/wsgi.py: WSGI web服务器的入口。

启动项目`python manage.py runserver`

#### advancing

1， google marked min.js cdn

#### 安装modwsgi

modwsgi是一个apache的模块，支持python wsgi规范。

[1参考](https://modwsgi.readthedocs.io/en/develop/)中说明了两种方式，在docker环境下推荐后一种。

[2怎样使用wsgi](https://pypi.python.org/pypi/mod_wsgi-httpd/2.4.12.4)

    pip3 install mod_wsgi-httpd && pip3 install mod_wsgi && pip3 install django

### 容器运行django

[参考](https://pypi.python.org/pypi/mod_wsgi)

`pip3 install mod_wsgi-httpd && pip3 install mod_wsgi && pip3 install django`

    python manage.py runmodwsgi --reload-on-changes --user mod_wsgi
要运行以上指令，先运行

+ 修改setting.py,增加STATIC_ROOT
+ `python manage.py collectstatic`
+ 修改settings.py,增加INSTALLED_APPS `mod_wsgi.server`

[python manage.py xxx](https://docs.djangoproject.com/en/1.10/intro/tutorial02/)
[4 source code for the youtube video](https://pythonprogramming.net/design-bootstrap-django-python-tutorial/)
[4 webpage-django](docs.djangoproject.com)
[5 youtube](https://www.youtube.com/watch?v=Y-CT_l1dnVU&t=1299s)
[6 https](https://www.youtube.com/watch?v=z0L3u2Vn3Wo)
[7 youtube chinese](https://www.youtube.com/watch?v=i8dj8xHmL60)
[yt](https://www.youtube.com/watch?v=KsLHt3D_jsE)