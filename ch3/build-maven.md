# Maven

# 安装
## centos
+ wget http://mirror.olnevhost.net/pub/apache/maven/maven-3/3.0.5/binaries/apache-maven-3.0.5-bin.tar.gz
最新版地址[maven latest](http://maven.apache.org/download.cgi)

+ tar xvf apache-maven-3.0.5-bin.tar.gz
+ mv apache-maven-3.0.5  /usr/local/apache-maven
+ 添加以下内容到~/.bashrc<pre>export M2_HOME=/usr/local/apache-maven
export M2=$M2_HOME/bin 
export PATH=$M2:$PATH</pre>

+ source ~/.bashrc


#使用
+ 当maven下载依赖失败，重新下载依赖，清除本地缓存
> mvn dependency:purge-local-repository

+ 参数
  + `-DskipTests` 或者 `-Dmaven.test.skip=true`