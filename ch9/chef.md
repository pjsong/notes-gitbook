# chef 教程
[官网](https://learn.chef.io/)

##[总揽](https://docs.chef.io/release/server_12-8/chef_overview.html)
用代码表示架构的自动化平台。

![示意图](https://docs.chef.io/release/server_12-8/_images/start_chef.svg)

###概念

+ 工作站：用Chef DK管理chef的地方。包含chefdk的安装，使用Kitchen, chef-zero(命令行工具，本地运行，模拟连到了实际的服务器), Knife(与Chef server交互的命令行工具), chef(与本地chef-repo交互)， 以及core chef resources(构建recipes), Inspec(构建安全和一致性检查) 之类的resource
+ node：chef管理的机器。每台机器安装chef-client, 执行自动化
+ Chef-server: 管理/创建弹性/动态架构的基础。作为配置数据的hub，存储节点上的cookbooks, policy，以及每个节点上chef-client管理的元数据。 node用chef-client向chef-server要配置，在自己的节点上执行。这个可扩展方法通过组织来分发配置工作。

### cookbook的组件
+ attribute。 节点的attribute。对于一个cookbook，default.rb属性最先装入。
+ definition 在各种recipe中重复使用的代码
+ files 从COOKBOOK_NAME/files/子目录拷贝文件到node节点的指定位置
+ library ruby代码运行需要的库
+ meta 在cookbook目录顶层，内容给chef-server，保证cookbook正确部署到每个节点
+ recipe 组织中最重要的配置。用ruby创建，基本是用模式pattern定义的资源的集合，包含了配置部分的全部。存储在cookbook，可以包含在另一个recipe，可以通过查询包含加密数据包。chef-client使用前必须加入run-list,在run-list按顺序执行。
+ resource 配置policy的陈述。说明配置项的正常状态，需要的步骤，自己的类型，是否加入recipes
+ provider定义步骤，把系统带入需要的正常状态
+ template嵌入Ruby模板ERB。用于动态方式生成静态文本。
+ test很多工具可用于测试

###节点Chef
+ policy把业务，操作请求，处理，工作流映射到chef server上的设置/对象
+ role决定server类型；Environment决定处理类型dev, staging ,prod; 敏感数据进入数据包，在cookbook中维护。



####chef组件关系
![示意图](https://docs.chef.io/release/server_12-8/_images/chef_overview.svg)


## 起步
[参考](https://learn.chef.io/skills/how-to-learn-chef/)

### 安装目标主机
[参考](https://learn.chef.io/tutorials/learn-the-basics/rhel/virtualbox/set-up-a-machine-to-manage/)

+ `vagrant box add bento/centos-7.2 --provider=virutualbox`
+ `vagrant init bento/centos-7.2`
+ edit Vagrantfile, open public network open bridge,and add line `config.ssh.insert_key = false` to eliminate error . "default:Warning:Authentication failure. Retrying".[ref](https://github.com/mitchellh/vagrant/issues/7610), pay attention to the `false` without double-quotes
+ `vagrant up`
+ ssh后`curl https://omnitruck.chef.io/install.sh | sudo bash -s -- -P chefdk -c stable -v 0.16.28`
+ 编辑文件，`mkdir chef-repo && cd chef-repo && vi hello.rb`
    <pre>
    file '/tmp/motd' do
     content 'hello world'
    end
   </pre>
+ file的缺省命令action是create，可以省略
+ `chef-client --local-mode hello.rb`
+ `more tmp/motd`文件已经写入
+ 修改文件，运行命令，可以更新`tmp/motd`
+ 修改`tmp/motd`,运行命令，可以恢复。
+ 增加文件`goodbye.rb`
    <pre> 
    file '/tmp/motd' do
      action :delete
    end
    </pre>
运行后motd删除。
+ 运行指定目录
<pre>
directory '/tmp/messages'
file '/tmp/messages/motd' do
  content 'hello world'
end
</pre>

###相关概念
+ resource： 系统应当所处的状态，比如应该安装的包，运行的服务，生成的文件。
+ recipe： 描述特定配置的resource集合。

##配置包/服务
+ 添加文件`webserver.rb`, 写入内容`package 'httpd'`，缺省命令install可以省略。`sudo`运行命令。
+ 继续编辑文件，再次运行
<pre>
package 'httpd'
service 'httpd' do
  action [:enable, :start]
end
</pre>
+ 继续编辑文件，添加页面
<pre>
    package 'httpd'
    service 'httpd' do
      action [:enable, :start]
    end
    file '/var/www/html/index.html' do
      content '&lt;html>
      &lt;body>
        &lt;h1>hello world</h1>
      &lt;/body>
    &lt;/html>'
    end
</pre>
curl localhost看到页面已经在运行了。

+ 写一个resource停止服务
  + 确认服务在运行curl -I localhost
  + 把action改成`action [:stop, :disable]`

##管理recipe,解决html在recipe中的问题。
+ `mkdir ~/chef-repo/cookbooks && cd ~/chef-repo/cookbooks`
+ 生成cookbook名字为`learn_chef_httpd` `chef generate cookbook cookbooks/learn_chef_httpd`
+ `tree cookbooks`查看结构，缺省recipe `default.rb`
+ 在cookbooks树下生成页面`chef generate template cookbooks/learn_chef_httpd index.html`,并写入html
+ 把webserver.rb内容copy到default.rb
+ 运行`sudo chef-client --local-mode --runlist 'recipe[learn_chef_httpd]'`


#使用工作站配置服务器
[参考](https://learn.chef.io/manage-a-node/rhel/get-set-up/)
[安装](https://docs.chef.io/install_dk.html)

+ 同样的Vagrantfile， 开启public network
+ ssh后， `sudo wget https://packages.chef.io/stable/el/7/chefdk-0.17.17-1.el7.x86_64.rpm`
+ `rpm -Uvh chefdk-...rpm`
+ 安装ruby`sudo yum install -y epel-release gcc ruby ruby-gems ruby-devel `
+ 使用 `sudo which ruby`看到已经安装好ruby了。
+ 查看ruby环境变量`echo "$(chef shell-init bash)"`, 
+ 加入到bash_profile `echo 'eval "$(chef shell-init bash)"' >> ~/.bash_profile`, + 执行`source ~/.bash_profile`, 再次检查`which ruby`，使用了chef自己的ruby。
+ `yum install -y git`

#chef server安装
[参考](https://downloads.chef.io/chef-server/)
[安装](https://docs.chef.io/release/server_12-8/install_server.html)

+ `sudo yum update`
+ `cd /tmp && wget  https://packages.chef.io/stable/el/7/chef-server-core-12.8.0-1.el7.x86_64.rpm`
+ `rpm -Uvh /tmp/chef-server-core-<version>.rpm`
+ `chef-server-ctl reconfigure` 启动所有服务
+ `chef-server-ctl user-create USER_NAME FIRST_NAME LAST_NAME EMAIL 'PASSWORD' --filename FILE_NAME`
创建管理员，生成key pair.filename就是私钥pem保存的路径，比如
`$ chef-server-ctl user-create stevedanno Steve Danno steved@chef.io 'abc123' --filename /path/to/stevedanno.pem`
+ `chef-server-ctl org-create short_name 'full_organization_name' --association_user user_name --filename ORGANIZATION-validator.pem`创建组织。这个私钥是生成chef校验key
+ 开启server的其他功能。下载安装没有防火墙，可以用install子命令一次做，也可以分开。
+ 一次安装
  + chef-manager,一个管理webui。
   `sudo chef-server-ctl install chef-manage && sudo chef-server-ctl reconfigure && sudo chef-manage-ctl reconfigure`
  + push-jobs。 在node上独立于chef-client运行job
  `sudo chef-server-ctl install opscode-push-jobs-server && sudo chef-server-ctl reconfigure && sudo opscode-push-jobs-server-ctl reconfigure`
  + Reporting. 
  `sudo chef-server-ctl install opscode-reporting && sudo chef-server-ctl reconfigure && sudo opscode-reporting-ctl reconfigure`
+ 本地安装(略)
+ 为购买的节点更新配置(略)

###使用chef-server
chef-server的管理。https://docs.chef.io/release/server_12-8/， Manage the Chef Server

---
##安装chef-repo
###使用chef-server webui中的starter kit  https://docs.chef.io/install_dk.html ， Set up the chef-repo


###用chef dev kit中command line tool 
+ 命令`chef generate app`
