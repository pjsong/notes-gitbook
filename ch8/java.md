# java 安装
---

## centos
 [参考](http://tecadmin.net/install-java-8-on-centos-rhel-and-fedora/)

## 环境变量设置点。
给其他程序使用的环境变量设置
<pre>
export JAVA_HOME=/usr/java/jdk1.7.0_79/
export JRE_HOME=$JAVA_HOME/jre
PATH=$PATH:$HOME/bin:$JAVA_HOME/bin:$JRE_HOME/bin
export PATH
</pre>

+ ~/.bashrc
+ ~/.bash_profile
+ ~/.bash_login
+ ~/.bashrc
+ ~/.profile
+ /etc/mavenrc
+ ~/.mavenrc



