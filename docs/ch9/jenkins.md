# jenkins

## pipline

参考<https://jenkins.io/solutions/pipeline/>
<https://github.com/jenkinsci/pipeline-plugin/blob/master/TUTORIAL.md>
之前，人们主要通过webui来与jenkins交互，有了pipline， 所有的构建/测试/部署都可以通过Jenkinsfile来完成。

### [什么是jenkins pipline](https://jenkins.io/doc/pipeline/tour/hello-world/)

+ jenkins2的功能，是一组插件，它们支持把持续交付的pipline集成到jenkins.
+ 持续交付pipline，就是从代码的版本化到交付给用户，这一系列操作的自动化。
+ jenkins Pipline提供一系列的工具，把持续交付的pipline变成可以执行的代码，与源代码一起管理
+ 用代码来定义步骤和自动化部署
+ `node`同`agent`为pipline分配执行器和工作空间
+ `stage`是`pipline`的逻辑分组
+ `step`是jenkins执行的单个任务



### [概念](https://www.edureka.co/blog/jenkins-tutorial/)

job类型

+ freestyle 通用build jobs, 有最大的弹性和配置度， 可用于任意类型的项目.
+ Multiconfiguration Job: 也叫“matrix project”，可以在不同环境运行同一个build。比如不同的数据库甚至构建机器
+ Monitor an External Job: 监控非交互的进程，比如定时任务。
+ Maven Project: 能理解pom文件，

## pipeline

<https://jenkins.io/doc/pipeline/steps/>
<https://github.com/jenkinsci/pipeline-plugin/blob/master/TUTORIAL.md#understanding-flow-scripts>
<https://antonyderham.me/post/jenkins-docker-pipelines/>

## Jenkinsfile
<https://jenkins.io/doc/book/pipeline/jenkinsfile/#handling-credentials>

## 使用credential

<https://jenkins.io/doc/book/using/using-credentials/>

+ `Credentials > System > Global credentials (unrestricted)`进入default domain
+ 左边有按钮`Add Credentials`