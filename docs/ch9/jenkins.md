# jenkins

## [概念](https://www.edureka.co/blog/jenkins-tutorial/)

参考<https://jenkins.io/solutions/pipeline/>
<https://github.com/jenkinsci/pipeline-plugin/blob/master/TUTORIAL.md>
<https://jenkins.io/doc/book/pipeline/>
之前，人们主要通过webui来与jenkins交互，有了pipline， 所有的构建/测试/部署都可以通过Jenkinsfile来完成。

+ pipeline,定义整个构建过程，通常包括构建，测试，交付等stage. 是declarative句法的block
+ node,一个能处理script pipeline的机器，是jenkins环境的一部分，是script句法的block
+ stage,处理概念上有区分的任务子集如构建，测试，部署等。许多插件用它来显示状态和进度。
+ step, 单个的任务，告诉jenkins在特定的时间做什么。比如`sh make`来执行shell命令。当插件扩展了pipeline dsl, 意味着这个插件实现了一个step.

###  句法

注意： stage和step都是两种句法的元素

#### declarative and scripted

```groovy
pipeline {
    agent any //Execute this Pipeline or any of its stages, on any available agent.
    stages {
        stage('Build') { // 	Defines the "Build" stage.
            steps {
                // Perform some steps related to the "Build" stage.
            }
        }
        stage('Test') { 
            steps {
                // 
            }
        }
        stage('Deploy') { 
            steps {
                // 
            }
        }
    }
}

node {  //Execute this Pipeline or any of its stages, on any available agent.
    stage('Build') { // Defines the "Build" stage. stage blocks are optional in Scripted Pipeline syntax. However, implementing stage blocks in a Scripted Pipeline provides clearer visualization of each stage's subset of tasks/steps in the Jenkins UI.
//  Perform some steps related to the "Build" stage.
    }
    stage('Test') { 
        // 
    }
    stage('Deploy') { 
        // 
    }
}
node { 
    stage('Build') { 
        sh 'make' 
    }
    stage('Test') {
        sh 'make check'
        junit 'reports/**/*.xml' 
    }
    stage('Deploy') {
        sh 'make publish'
    }
}
```

Scripted句法中，一个或者多个node block做全部pipeline的工作。尽管不是句法要求，把pipeline的工作限定在node block里会做两件事：

+ 通过给Jenkins队列添加工作项，调度block中要运行的steps.只要executor空闲，steps就会运行。
+ 创建一个workspace(pipeline特定的文件夹), 在scm拉下源代码来完成工作。
+ 注意有些工作空间在一段时间不活跃后，不会自动清除，这点以来与Jenkins的配置。





[pipline例子](https://github.com/jenkinsci/pipeline-examples)

### [什么是jenkins pipline](https://jenkins.io/doc/pipeline/tour/hello-world/)

+ jenkins2的功能，是一组插件，它们支持把持续交付的pipline集成到jenkins.
+ 持续交付pipline，就是从代码的版本化到交付给用户，这一系列操作的自动化。
+ jenkins Pipline提供一系列的工具，把持续交付的pipline变成可以执行的代码，与源代码一起管理
+ 用代码来定义步骤和自动化部署
+ `node`同`agent`为pipline分配执行器和工作空间
+ `stage`是`pipline`的逻辑分组
+ `step`是jenkins执行的单个任务

#### [9个经典步骤](https://dev.to/iriskatastic/start-continuous-integration-with-jenkins-pipeline-4edb)

+ 配置环境Set-up / Configure a build environment.
+ 检出代码Check out your code.
+ 构建代码。Build your code. Make sure you don’t use any environment specific settings for the build process could be independent of the environment.
+ 测试/质量检查Perform quality controls. This step consists out of two main tasks: running tests and perform code quality checks.
+ 部署到CI环境 Deploy your code on a Continuous Integration environment.
+ 功能测试Run functional tests.
+ 部署到测试环境Deploy the code on the test environment.
+ 部署到接受性测试环境Deploy the code on the user acceptance environment.
+ 部署到生产环境Deploy the code on the production environment.

<https://jenkins.io/doc/pipeline/steps/>
<https://github.com/jenkinsci/pipeline-plugin/blob/master/TUTORIAL.md#understanding-flow-scripts>

### job类型

+ freestyle 通用build jobs, 有最大的弹性和配置度， 可用于任意类型的项目.
+ Multiconfiguration Job: 也叫“matrix project”，可以在不同环境运行同一个build。比如不同的数据库甚至构建机器
+ Monitor an External Job: 监控,非交互的进程，比如定时任务。
+ Maven Project: 能理解pom文件，

### 安装

<https://strongloop.com/strongblog/roll-your-own-node-js-ci-server-with-jenkins-part-1/>
<https://jenkins.io/doc/tutorials/build-a-node-js-and-react-app-with-npm/>
<https://codeforgeek.com/2016/04/continuous-integration-deployment-jenkins-node-js/>

### [官文](https://jenkins.io/doc/book/pipeline/)

#### pipline的两种句法比较

刚一开始， Groovy就是pipline的基础。一直来Jenkins就用groovy来提供高级别的脚本能力， pipeline也发现了Groovy是构建DSL的基础。

Scripted Pipeline提供了很大的弹性和扩展性，毕竟是一个编程环境。但是因为Groovy的学习曲线，Pipeline提供了Declarative Pipeline，简化且更有见地的句法。

两者用的底层子系统基本一样。都是pipeline as code, 都能用steps来构建成pipeline,或者插件构建pipeline. 都能用共享库。

#### scripted pipeline

实际上就是一个用groovy构建的DSL。Groovy能用的功能script pipeline都能用。
script pipeline从顶部开始执行，有基于groovy表达式的控制流

```groovy
node {
    stage('Example') {
        if (env.BRANCH_NAME == 'master') {
            echo 'I only execute on the master branch'
        } else {
            echo 'I execute elsewhere'
        }
    }
}
```




### 过程注意事项

+ `Credentials > System > Global credentials (unrestricted)`进入default domain 左边有按钮`Add Credentials`
+ 新增多分支pipline项目，用github认证，要填写第二项github的登录名。
+ jenkins使用host上的docker
+ 出现`docker: error while loading shared libraries: libltdl.so.7: cannot open shared object file: No such file or directory`错误， 要修改Dockerfile，安装如下

```bash
USER root
RUN apt-get update && apt-get upgrade -y \
      && apt-get install -y sudo libltdl-dev \
      && rm -rf /var/lib/apt/lists/*
RUN echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers
# or
RUN apt-get update && apt-get install -y libltdl7 && rm -rf /var/lib/apt/lists/*
```

+ 容器中运行容器易导致各种其他问题，jenkins从github拉下代码卷，在host启动容器node中去构建, 要把代码卷映射回host。比如`-w`是说，这个node容器执行命令command的位置，`--volumes-from`是说让node从哪个容器加载其所有卷。下面的报错，一般是host或者docker版本问题引起。

```text
$ docker run -t -d -u 0:0 -w /var/jenkins_home/workspace/vending-ui_master-NFVE46OV5YXQXYRCLPNOXTTX2UQZT4ZBHB5MZWMH5A4JI2CHZ2LQ --volumes-from b2b865d5136271119a448adaeae11ea00ad91496b051634ffb1838b0d9df6399 -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** circleci/node:9.3-stretch-browsers cat
java.io.IOException: Failed to run image 'circleci/node:9.3-stretch-browsers'. Error: docker: Error response from daemon: OCI runtime create failed: container_linux.go:348: starting container process caused "process_linux.go:402: container init caused \"rootfs_linux.go:58: mounting \\\"/usr/bin/docker-compose\\\" to rootfs \\\"/var/lib/docker/overlay2/157a1ebf76dd8436e1cb6cbbad694a9f1df1c9c84f803f4b88365fa42ffb81b2/merged\\\" at \\\"/var/lib/docker/overlay2/157a1ebf76dd8436e1cb6cbbad694a9f1df1c9c84f803f4b88365fa42ffb81b2/merged/usr/bin/docker-compose\\\" caused \\\"not a directory\\\"\"": unknown: Are you trying to mount a directory onto a file (or vice-versa)? Check if the specified host path exists and is the expected type.
```

## 插件

### [nodejs]
