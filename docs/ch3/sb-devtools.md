# springboot devtools

Thanks to<http://www.dewafer.com/2016/09/12/notes-for-spring-devtools/>

+ `livereload.com`安装插件，自动刷新浏览器。 `spring.devtools.livereload.enabled=false`禁用
+ `~/.spring-boot-devtools.properties`全局设定文件
+ `DevToolsPropertyDefaultsPostProcessor`自动包含的properties

## maven plugin

如果以java -jar的方式启动，Spring会认为它是运行在生产环境，所以devtools会自动失效. `mvn spring-boot:run`

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

## 自动重启

+ `spring.devtools.restart.enabled=false`停用自动重启。
+ `spring.devtools.restart.additional-exclude`屏蔽监视的文件
+ `spring.devtools.restart.additional-paths`增加监视的路径
+ mvn 设置`fork`

```xml
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <fork>true</fork>
            </configuration>
        </plugin>
```

+ IDEA 用`build -> make project`

## 远程调试

+ 远端和本地配置spring.devtools.remote.secret=xxx
+ 本地端运行`org.springframework.boot.devtools.RemoteSpringApplication`，并指定远端url。
+ 本地如果有更新class文件，会自动推送到远端。
+ 如果远端是以debug模式启动的app（`-Xdebug -Xrunjdwp:server=y,transport=dt_socket,suspend=n`），可以在本地端调试远程端app。
+ 默认调试端口为8000，`spring.devtools.remote.debug.local-port`更改。
