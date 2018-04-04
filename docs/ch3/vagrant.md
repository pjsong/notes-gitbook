# Vagrant



## 1. [创建box](https://atlas.hashicorp.com/help/vagrant/boxes/create)
三种方式， 

+ 推荐方式用packer,要开通企业版。
+ 第二种web api方式， 
  1. 基于basebox创建box，
  2. `package`将vagrant环境打包成box
  3. 到页面[create box](https://atlas.hashicorp.com/boxes/new)上传box
  4. 到页面[your boxes](https://atlas.hashicorp.com/vagrant) 查看。
## 2. [Atlas web interface方式上传box](https://atlas.hashicorp.com/boxes/new)
## 3. 常用指令
+ vagrant init 配置项
> config.vm.box = "bento/centos-7.2"

> config.ssh.insert_key = false

> config.vm.network "forwarded_port", guest: 4000, host: 80

> config.vm.network "private_network", ip: "192.168.10.10"

> config.vm.synced_folder "./data", "/home/vagrant/jekyll_data"

+ vagrant box add bento/ubuntu-16.04

## 4. getStarted

```bash
vagrant init hashicorp/precise64
vagrant up
vagrant ssh
vagrant destroy
# 初始化/开启/ssh登陆/关闭。
```

+ 初始化生成Vagrantfile文件，把指令变成文件内容一部分。这样环境便能启动。
+ box查找[page](https://atlas.hashicorp.com/boxes/search)
+ ssh之后，所在的目录是`/home/vagrant`,不是同步的目录。同步目录要转到根目录下/vagrant, 默认的同步了当前Vagrantfile所在的目录。`ctrl+D`退出。
+ destroy关闭虚拟机。要清除box `vagrant box list|remove`

## 安装[参考](https://www.vagrantup.com/docs/installation/)

按照页面下载[页面](https://www.vagrantup.com/downloads.html)/安装。

## 升级

覆盖安装

## 卸载

```bash
rm -rf /opt/vagrant
rm -f /usr/bin/vagrant</pre>
```

删除用户数据目录 `~/.vagrant.d`

## 用provision安装包/用户等

provision作用是vagrant up时，能自动安装必要的软件用户等环境。

比如在Vagrantfile平行目录下建立文件`bootstrap.sh`

```bash
#!/usr/bin/env bash

apt-get update
apt-get install -y apache2
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi</pre>
然后Vagrantfile中<pre>
Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.provision :shell, path: "bootstrap.sh"
end
```

Vagrantfile配置后，如果vagrant已经启动，`vagrant reload --provision`加载provision。provision缺省只在vagrant up的时候运行一次。

##### inline方式例子
<pre>
Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.synced_folder ".", "/var/www/project"
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y g++
    curl -sL https://deb.nodesource.com/setup_0.12 | sh
    apt-get install -y nodejs
    su vagrant
    mkdir /home/vagrant/node_modules
    cd /var/www/project
    ln -s /home/vagrant/node_modules/ node_modules
    npm install karma
  SHELL
end
</pre>

## 网络配置
本地端口forward到虚拟机<pre>Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.provision :shell, path: "bootstrap.sh"
  config.vm.network :forwarded_port, guest: 80, host: 4567
end</pre>

## Share
所有能上网的人都能看到这个启动的虚拟机。

+ `vagrant login`
+ `vagrant share`
把输出的地址贴到浏览器。url能直接进入vagrant环境，任意设备都能访问。
+ `ctrl+c`退出。


## 拆除
要吃饭了，转到另一个项目了，要回家了，怎么清理项目？

+ `suspend`: 保存当前状态并关机。用`up`能很快起来。缺点是需要磁盘空间。
+ `halt`： 关闭电源。也用`up`起来。好处是干净的关闭和启动。缺点是冷启动时间长。磁盘空间也占用。
+ `destroy`： 移除虚拟磁盘。

## 指令
`vagrant box -h`列出指令
 [页面](https://www.vagrantup.com/docs/cli/global-status.html)
`global-status`: 显示当前活跃的vagrant。 这些id能用作命令的参数`vagrant destroy a1b2c3`

[站内参考](ch1/jekyll-install.md)

继承软件otto
[blog](https://www.hashicorp.com/blog/otto.html)
在vagrant开发的基础上增加了部署的功能。包括了负载均衡，防火墙，路由，新配置等等。
[项目](https://www.ottoproject.io/)

---
# 环境：
###centos安装node， npm自动安装
[参考](https://nodejs.org/en/download/package-manager/)

+ curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
+ yum -y install nodejs

###mongodb
+  vi `/etc/yum.repo.d/mongodb-org-3.0`

> <pre>
[mongodb-org-3.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.0/x86_64/
gpgcheck=0
enabled=1
</pre>

+ yum install -y mongodb-org
+ sudo service mongod start
+ sudo chkconfig mongod on


###npmjs镜像
+ `npm config set registry https://r.cnpmjs.org`
+ `npm install --registry http://registry.npmjs.org`
+ npm --registry https://registry.npm.taobao.org install express


chinese repo 

+ 说明网址'https://cnpmjs.org'
+ 说明网址`http://npm.taobao.org/`

#####npm install故障 make g++ command not found

+ `yum groupinstall 'Development Tools'`