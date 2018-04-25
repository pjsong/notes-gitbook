# dev-ops

<https://www.edureka.co/blog/what-is-devops/>

![软件开发的演变](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2016/10/Development-models.png)

[dev/ops的10个必备工具](https://www.edureka.co/blog/top-10-devops-tools/)

+ 版本管理 git
+ 构建[jenkins](ch9/jenkins.md)， 其他选项TrvisCI， Banboo
+ web测试框架selenium，创建基于浏览器的回归自动测试
+ docker， 其他选项vagrant
+ chef管理/配置/部署服务器, 其他选项Puppet， Ansible
+ splunk，其他选项ELKstack， nagios

## Jenkins

每个源代码提交都出发构建/测试，开发者知道每个提交的测试结果

### 分布式架构，master

+ 调度build jobs.
+ 分配builds到slave.
+ 监控slave (possibly taking them online and offline as required).
+ 记录/展示结果Recording and presenting the build results.
+ 直接做build job

