#安装

##使用docker + jekyllbootstrap
###jekyllbootstrap

[ref install by jekyllbootstrap](jekyllbootstrap.com/usage/jekyll-quick-start.html)

<code>

git clone --depth 1 https://github.com/plusjade/jekyll-bootstrap.git

cd jekyll-bootstrap/

git remote set-url origin git@github.com:pjsong/vending-machine-manual.git

git push -u origin master

</code>

### docker
sudo docker run --rm --label jekyll \
 -v ~/Documents/git/github/vending-machine-manual/jekyllbootstrap:/srv/jekyll \
 -it --network omd-network-dev --ip 172.16.0.10 -p 4000:4000 jekyll/jekyll

---
##1. 使用作者的vagrant box
>vagrant pull pjsong/jekyll
##1. 还可以自己体会安装，步骤如下
###1.1. 在镜像安装
1.1.1 freelancer模板， 使用vagrant的bento/centos-7.2镜像
>yum install -y rubygems

>yum install -y ruby-devel

>yum install -y gcc

>gem install json_pure

>gem install bundler

>gem install minima

>gem install jekyll

1.1.2 feeling-responsive模板， 使用vagrant的bento/centos-7.2镜像. 

> Gemfile中的内容可以`bundle install` 安装

> sudo yum install -y  epel-release gcc ruby ruby-gems ruby-devel nodejs httpd
> 
> <del>gem update --system</del> 
> gem install bundler jekyll

安装中会有很多没有安装的。如果版本不对需要卸载：gem uninstall xxx

安装带版本号gem install packageName -v versionNumber

> bundle exec jekyll serve --host '0.0.0.0'

######遇到问题 
`LoadError: cannot load such file -- json
  /home/vagrant/.gem/ruby/gems/jekyll-3.0.2/lib/jekyll/filters.rb:2:in `require'`

修改Gemfile，添加行`gem: "json"`

###1.2. 做好镜像的备份，避免镜像内的东西丢失
> vagrant package

> vagrant box add --name oursmedia/jekyll ./package.box

###1.3. [其他操作](https://www.vagrantup.com/docs/cli/)
+ 检查启动的vagrant
>vagrant global-status

+ 关闭
>vagrant destroy 6e7fb

+ 查看box
>vagrant box list

##2. 问题

###host上serve之后打不开页面
>使用`jekyll serve --host '0.0.0.0' &`
>
>然后在host上打开

> `http://192.168.33.1/`
> 
> `http://192.168.33.10:4000/`
> 
> `http://localhost/`
> 
> `http://127.0.0.1`

> 都可以成功[【参考内容】](http://www.projectsnailtrail.org/blog/2015/04/14/setting-up-jekyll.html)。



