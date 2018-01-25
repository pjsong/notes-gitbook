# java 安装

## JVM配置

[http://jvm-options.tech.xebia.fr/](http://jvm-options.tech.xebia.fr/)

## centos

 [参考](http://tecadmin.net/install-java-8-on-centos-rhel-and-fedora/)

## 环境变量设置点。

给其他程序使用的环境变量设置

```bash
export JAVA_HOME=/usr/java/jdk1.7.0_79/
export JRE_HOME=$JAVA_HOME/jre
PATH=$PATH:$HOME/bin:$JAVA_HOME/bin:$JRE_HOME/bin
export PATH
```

+ ~/.bashrc
+ ~/.bash_profile
+ ~/.bash_login
+ ~/.bashrc
+ ~/.profile
+ /etc/mavenrc
+ ~/.mavenrc

## 最大线程数

[参考](http://jzhihui.iteye.com/blog/1271122)

### 代码

```java
import java.util.concurrent.atomic.AtomicInteger;
public class TestThread extends Thread {
    private static final AtomicInteger count = new AtomicInteger();
    public static void main(String[] args) {
        while (true)
          try{
            (new TestThread()).start();
          }catch(Error e){
            System.exit(-1);
        }
    }
    @Override
    public void run() {
        System.out.println(count.incrementAndGet());

        while (true)
            try {
                Thread.sleep(Integer.MAX_VALUE);
            } catch (InterruptedException e) {
                break;
            }
    }
}
```