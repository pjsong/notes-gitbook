# 命令

```bash
# https://docs.gradle.org/current/userguide/build_init_plugin.html
# when --type missed, if cant infer type from environment like pom, use basic
# other types: java-application,
init --type java-library
project
task
```

## maven兼容

+ repositories使用mavenLocal()搜索本地库
+ <https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:install>只要sdk的build.gradle中`apply plugin: "maven"`,并设好`group=“xxx” version="xxx"`, `gradle install`之后，在目标中repositories包含本地库，设置`dependencies { compile "xxx:sdk:1.0"}`便可