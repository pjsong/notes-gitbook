# 如何使用github中的[sample]( https://github.com/spring-cloud/spring-cloud-config.git)

## 在各pom中加入snapshot的repo地址

```xml
<repositories>
    <repository>
        <id>repository.spring.snapshot</id>
        <name>Spring Snapshot Repository</name>
        <url>http://repo.spring.io/snapshot</url>
    </repository>
</repositories>
```

## 加入plugin的repo地址

```xml
<pluginRepositories>
    <pluginRepository>
        <id>spring-snapshots</id>
        <url>http://repo.spring.io/snapshot</url>
    </pluginRepository>
    <pluginRepository>
        <id>spring-milestones</id>
        <url>http://repo.spring.io/milestone</url>
    </pluginRepository>
</pluginRepositories>
```
