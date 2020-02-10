# Gradle

为什么用Gradle。 [参考](https://gradle.org/maven_vs_gradle/)

## 创建构建

### [Build lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)

gradle是基于依赖编程，每个task只执行一次，按照依赖的顺序执行，是一个有向无环图，在执行任务之前构建好。
三个阶段：

+ `Initialization`哪些项目参与构建，为每个项目创建Project实例.
  + 子项目内执行时，查找当前文件目录中的master文件夹，上一级目录。如果没有找到settings.gradle,就当做独立项目，否则看自己是否是其中的子项目。
  + 如果子项目内执行，只会构建子项目和依赖，因为gradle要构建全局的Project对象，因此查找settings.gradle, 加上参数`-u`可以避免查找settings.gradle
+ `Configuration`配置好project对象，执行项目的build script
+ `Execution`执行tasks的子集，

例子， `gradle test testBoth`

```groovy
//settings.gradle
println '1, during the initialization phase.'
//build.gradle
println '2,during the configuration phase.'

task configured {
    println '3 during the configuration phase.'
}
task test {
    doLast {
        println '5 during the execution phase.'
    }
}
task testBoth {
    doFirst {
      println '6 executed first during the execution phase.'
    }
    doLast {
      println '7 executed last during the execution phase.'
    }
    println '4 the configuration phase as well.'
}
```


### gradle wrapper

执行构建的推荐方式。该脚本调用制定版本的gradle, 如果需要的话下载它，这样开发人员直接上手。

+ 标准化项目版本和构建工具的版本。
+ 要为不同的用户/IDE等配置一个新的gradle版本,改下wrapper定义就可以。

对于用户来说，有三种工作流

+ 为graddle项目添加wrapper, 
  + 要本地已经安装gradle`gradle wrapper`, 也可以指定版本`gradle wrapper --gradle-version 4.0 --distribution-type all`， 生成的新wrapper配置，也用于升级。
  + 一个gradle项目包含5个文件(夹)`build.gradle`,`settings.gradle`,`gradlew,gradlew.bat(脚本)`,`gradle->wrapper->gradle-wrapper.jar(下载gradle),gradle-wrapper.properties(与这个wrapper兼容的gradle版本，地址等)`
+ 用wrapper来运行项目
+ 升级wrapper使用新的gradle版本

### [gradle DSL](https://docs.gradle.org/current/dsl/)

Gradle脚本是配置脚本。脚本执行中，配置一个特定的对象。比如，`build`脚本执行中，配置一个Project类型的对象。这个对象叫做脚本的代理对象。`init`脚本配置Gradle对象，`settings`脚本配置Settings对象。脚本中，可以使用对象的属性和方法。每个对象都实现了Script接口，脚本可以使用他们的方法。

+ build脚本包含`statement`和`script block`,`script block`是一个方法调用，用闭包作参数，这个配置闭包在执行时配置代理对象，顶级`build block`如下
  + `allprojects{}`在本项目及子项目上执行闭包来配置。`目标Project对象`作为闭包的代理传给闭包。
    + Project接口和build.gradle是一对一关系，通过该接口可以得到所有gradle能力。构建初始化时，Gradle为每个项目组装project对象。步骤是
      + 为build创建settings实例。
      + 如果存在settings.gradle,则用它来配置。
      + 用配置好的settings对象创建Project对象的层次。
      + 广度优先，执行每个project的build.gradle,
  + `settings`Object
    + 声明配置，用于初始化和配置Project对象的层次。Gradle组装project进行Build之前，创建settings实例并在上面执行配置。
 
### [Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)

通过重用其他build的输出，节省时间的缓存方案。

+ 命令行`--build-cache`
+ graddle.properties`org.gradle.caching=true`



### [从maven迁移](https://guides.gradle.org/migrating-from-maven/)

对于怎样构建项目，两者有基本的不同。Gradle基于任务依赖图，maven用固定的线性的phase，在phase上放goal.
对于理解gradle构建一个特别有用的功能，是构建扫描。这是一个基于web的快照![build-scan](https://guides.gradle.org/migrating-from-maven/images/groovy-build-scan.png)

+ 记录maven每步构建的输入输出。`gradle init`可以新建一个项目架子，也可以把现有的maven转为gradle,到项目的根目录运行就可以，基本上解析POM并生成对应的gradle,如果是多个项目，会有一个settings.gradle.
+ 有些组装工作不会转换，

### [gradle插件](https://docs.gradle.org/current/userguide/plugins.html)

功能：1,促进重用，2，高度模块化，3,封装imperative逻辑使build script保持声明式。

+ 扩展模型，为项目添加新的，可配置的DSL元素/任务
+ 提供项目/任务的缺省配置
+ 可以添加新属性，重写插件的缺省值,比如添加repository: `repositories{mavenLocal() mavenCentral()}`
+ 给项目添加依赖

默认`plugins {id "org.gradle.sample.hello" version "1.0.0"}`直接生效并应用，参数`apply false`可以关闭

[标准插件](https://docs.gradle.org/current/userguide/standard_plugins.html)

+ 语言插件`java`为项目增加java的编译/测试/打包能力，`groovy`...
+ 集成`application`为运行/打包java项目成命令行程序提供任务，`ear`支持J2EE应用的构建，`maven`发布artifact给maven仓库，`war`组装war文件。
+ 开发插件`idea`，`eclipse`等
+ base插件，是组装其他插件的基础，不是公共API的一部分。


#### Intellj插件

<https://docs.gradle.org/current/userguide/idea_plugin.html>

#### Eclipse插件

+ buildship
+ groovy-eclipse [update address](https://github.com/groovy/groovy-eclipse/wiki)

### groovy 语言

[参考](http://groovy-lang.org/documentation.html)

### Gradle DSL(domain specific language)

[参考](https://docs.gradle.org/current/dsl/)

### Gradle script类型

+ Gradle scripts是Configuration scripts
+ 三种script类型负责配置三种脚本的delegate object.
+ Settings(settings script)， Gradle(init script), Project(build script)

### Build script

#### [基础](https://docs.gradle.org/2.4/userguide/tutorial_using_tasks.html)

 + 一个build对应对个projects，每个projects对应多个task. 
 + project的形式取决与你怎么用Gradle,比如，可能是一个liberary jar,或者web应用，也可以是由其他项目的产生的jar组装的zip。
 + 项目不一定代表要构建的目标，可以是一件要做的事。 


#### 结构
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

### Gradle构建环境配置

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

#### forked java进程。

许多设定(java version, maximum heap size)只在新启动jvm才能使用。也就是gradle解析各个gradle.properties之后，必须启动一个分开的jvm进程来执行构建。当用daemon运行，jvm仅启动一次，给各个daemon构建重复用。当没有daemon执行，每个构建执行就必须新启动虚拟机。除非gradle启动的jvm启动脚本恰好参数相同。
每个build执行启动额外的jvm比较耗资源，因此如果设置org.gradle.java.home 或者gradle.jvmargs的时候，推荐使用[gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html).

daemon方式：gradle在jvm上运行，并使用许多需要耗费很多时间来初始化的库。
因此看起来启动慢。解决这个问题的方法就是gradle daemon，一个一直存在的后台进程。
缺省情况是关闭的，但是建议在开发机器上开启。设置的`org.gradle.daemon=true`地方就是user_home/.gradle/gradle.properties

`gradle --stop` 停止daemon

通过jps可以看到进程的状态。

#### debug java

+ 在src/main/test中的junit类下，直接可以打断点debug as junit test。

#### debug webapp

+ 安装gradle，不用eclipse自带的gradle插件，编辑~/.gradle/gradle.properties下的daemon方式`org.gradle.daemon=true`。开启terminal运行`sudo gradle jettyRunWar`,然后开启远程模式调试即可。可结合参考[remote debug](ch3/eclipse-remote-debug.md)

