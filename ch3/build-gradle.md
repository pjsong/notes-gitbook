# Gradle

### 为什么用Gradle。 [参考](https://gradle.org/maven_vs_gradle/)

##Eclipse插件
+ buildship
+ groovy-eclipse [update address](https://github.com/groovy/groovy-eclipse/wiki)

### groovy 语言
[参考](http://groovy-lang.org/documentation.html)


### Gradle DSL(domain specific language)
[参考](https://docs.gradle.org/current/dsl/)
#####Gradle script类型

+ Gradle scripts是Configuration scripts<br>
+ 三种script类型负责配置三种脚本的delegate object.<br>
+ Settings(settings script)， Gradle(init script), Project(build script)

#####Build script
包含statement和script两种block。statement包括方法调用，本地变量定义，属性赋值等，script用closure作为参数调用方法，执行时配置delegate object。顶级script block如下

+ allprojects: 项目/每一个子项目
+ artifacts: 项目的发布artifacts
+ buildscript: build script的classpath
+ configurations: 依赖配置
+ dependencies:依赖

关键类型如下：

+ Project:  build文件与gradle交互的主要api，通过这个类型程序化访问所有的gradle功能。
+ Task: 一个build的原子工作单元
+ Gradle: 一个Gradle触发
+ Settings: 初始化/配置项目build过程中层次结构所需要的配置。
+ Script: 添加特定的gradle才用的方法。因为编译后的脚本类都有此接口，可以在脚本中使用Script里面的属性/方法。
+ JavaToolChain: 从java代码来构建的工具。




###Gradle构建环境配置
有多种方式可以配置执行构建的java进程。本地环境可以通过GRADLE_OPTS或JAVA_OPTS设置之外, 设置JVM内存, Java home, daemon开关等等也很有用。

这个配置文件gradle.properties的应用的顺序是：

+ 项目
+ user home
+ 命令行

配置属性有

+ org.gradle.daemon 用gradle daemon来运行build，这是本地开发人员构建最常用的方式。本地开发人员环境适合于速度和响应，CI环境适合一致和可靠的构建。
+ org.gradle.java.home
+ org.gradle.jvmargs 用于daemon进程。
+ org.gradle.configureondemand。 new incubating mode，选择性只配置相关的项目，[参考](https://docs.gradle.org/current/userguide/multi_project_builds.html#sec:configuration_on_demand)
+ org.gradle.parallel。 incubating parallel mode.
+ org.gradle.workers.max
+ org.gradle.debug 默认监听5005，开启远程调试。与jvm选项`-Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005`等价


######forked java进程。

许多设定(java version, maximum heap size)只在新启动jvm才能使用。也就是gradle解析各个gradle.properties之后，必须启动一个分开的jvm进程来执行构建。当用daemon运行，jvm仅启动一次，给各个daemon构建重复用。当没有daemon执行，每个构建执行就必须新启动虚拟机。除非gradle启动的jvm启动脚本恰好参数相同。
每个build执行启动额外的jvm比较耗资源，因此如果设置org.gradle.java.home 或者gradle.jvmargs的时候，推荐使用[gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html).

daemon方式：gradle在jvm上运行，并使用许多需要耗费很多时间来初始化的库。
因此看起来启动慢。解决这个问题的方法就是gradle daemon，一个一直存在的后台进程。
缺省情况是关闭的，但是建议在开发机器上开启。设置的`org.gradle.daemon=true`地方就是user_home/.gradle/gradle.properties

`gradle --stop` 停止daemon

通过jps可以看到进程的状态。

######debug java

+ 在src/main/test中的junit类下，直接可以打断点debug as junit test。

###### debug webapp
+ 安装gradle，不用eclipse自带的gradle插件，编辑~/.gradle/gradle.properties下的daemon方式`org.gradle.daemon=true`。开启terminal运行`sudo gradle jettyRunWar`,然后开启远程模式调试即可。可结合参考[remote debug](ch3/eclipse-remote-debug.md)