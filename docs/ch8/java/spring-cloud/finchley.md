# Finchley.M8[原文](http://cloud.spring.io/spring-cloud-static/Finchley.M8/multi/multi_spring-cloud.html)

## Cloud Native

Cloud Native是一种基于[微服务12原则](https://12factor.net/),[微服务12原则中文](ch10/12factor.md)的开发风格,让开发/交付/运维相一致，比如声明式编程，管理和监控。

### cloud context: 应用上下文服务

Spring Boot构建应用有一套自己的主张， 比如常见的配置文件，和常用的管理端和监控任务都有默认的位置。在此基础上，还增加了系统一般要用的一些特性。

#### bootstrap应用上下文

+ cloud应用通过创建一个bootstrap上下文来操作。
+ bootstrap上下文是主应用的上一层上下文。负责从外部装入配置属性，解密本地的外部文件。
+ 两个上下文共享一个`Environment`，它是所有外部属性的源。
+ 缺省bootstrap属性优先于本地配置，不会被覆盖。
+ bootstrap上下文定位外部配置使用与main应用不同的惯例。不是application.yml或者application.properties, 而是bootstrap.yml和bootstrap.properties.

```yaml
spring:
  application:
    name: foo
  cloud:
    config:
      uri: ${SPRING_CONFIG_URI:http://localhost:8888}

```

如果要从服务器获取应用特定的配置，最好设置`spring.application.name`.
`spring.cloud.bootstrap.enabled=false`可以关闭bootstrap.

#### 应用上下文的层次

如果通过`SpringApplication` 或者 `SpringApplicationBuilder`来构建应用的上下文，bootstrap上下文就会作为上一层添加。spring默认子上下文继承上一层的属性和profile. 因此main应用相比于没有cloud config的应用，包含了附加的属性，这些属性有

+ `bootstrap`: 如果bootstrap上下文存在`PropertySourceLocator`这个bean，里边含有属性，会出现一个可选的高优先级的 `CompositePropertySource`。 比如spring cloud config server配置服务器的属性。下面的例子，如果jar包`META-INF/spring.factories`中有`org.springframework.cloud.bootstrap.BootstrapConfiguration=sample.custom.CustomPropertySourceLocator`，所有引入了jar包的应用都会出现`PropertySource`为`customProperty`的属性

```java
@Configuration
public class CustomPropertySourceLocator implements PropertySourceLocator {

    @Override
    public PropertySource<?> locate(Environment environment) {
        return new MapPropertySource("customProperty",
                Collections.<String, Object>singletonMap("property.from.sample.custom.source", "worked as intended"));
    }

}
```

+ bootstrap.yml.这些用来配置bootstrap上下文，并加入到子上下文，其优先级低于application.yml,可能是最低的，用于设置缺省值。
+ bootstrap.yml先于application.yml加载，由上一层的应用上下文加载。主要用作：
  + 如果使用config server, 就要bootstrap.yml指定`spring.application.name`，`spring.cloud.config.server.git.uri`
  + 其他加密/解密信息
+ bootstrap.yml是引入属性配置的文件，本身优先级高于本地，但里边的内容低于本地优先级。
+ 使用`-Dspring.profiles.active=development`来激活运行，用`bootstrap-development.properties`做profile,自动继承基本的`bootstrap.yml`。
+ 远程的配置使用`spring.cloud.config.overrideNone=true`让本地配置优先。`spring.cloud.config.overrideSystemProperties=false`只让系统属性和环境变量可以override.

#### RefreshScope

当一个数据源有打开的连接，但是Environment里数据库URL变了，最好数据源能够结束当前的工作下次在从连接池获取新地址的链接.
`Refresh scope beans`使用时才做初始化，是`lazy proxies`。充当初始化的缓存，要重新初始化必须让其cache失效。
其`refreshAll()`方法刷新scope内所有的bean。`refresh(String)`刷新某一个bean, `/refresh`通过jmx或者http暴露这个功能。

### Common抽象

服务发现，熔断，负载均衡等模式形成一个共用的抽象层，所有的客户端都可以使用，不管用consul还是zookeeper等具体的实现。

#### `@EnableDiscoveryClient`

本annotation用`META-INF/spring.factories`搜索DiscoveryClient实现，缺省情况下这个实现会自动注册本地的server到远程服务发现服务器，可用`@EnableDiscoveryClient`的属性`autoRegister=false`来解除该缺省。

#### ServiceRegistry

提供定制的注册服务。每个ServiceRegistry都包含自己的实现。

```java
@Configuration
@EnableDiscoveryClient(autoRegister=false)
public class MyConfiguration {
    private ServiceRegistry registry;

    public MyConfiguration(ServiceRegistry registry) {
        this.registry = registry;
    }
    // called through some external process, such as an event or a custom actuator endpoint
    public void register() {
        Registration registration = constructRegistration();
        this.registry.register(registration);
    }
}
```

#### RestTemplate作为客户端负载均衡客户端，自动配置使用Ribbon

此时不能用默认配置创建的resttemplate.

```java
@Configuration
public class MyConfiguration {
    @LoadBalanced
    @Bean
    RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
public class MyClass {
    @Autowired
    private RestTemplate restTemplate;

    public String doOtherStuff() {
        String results = restTemplate.getForObject("http://stores/stores", String.class);
        return results;
    }
}
```

#### webclient作为负载均衡客户端

```java
@Configuration
public class MyConfiguration {
  @Bean
  @LoadBalanced
  public WebClient.Builder loadBalancedWebClientBuilder() {
    return WebClient.builder();
  }
}
public class MyClass {
    @Autowired
    private WebClient.Builder webClientBuilder;

    public Mono<String> doOtherStuff() {
        return webClientBuilder.build().get().uri("http://stores/stores")
                .retrieve().bodyToMono(String.class);
    }
}
```

##### 重试失败请求

缺省该功能disabled, 把spring Retry加入classpath打开该功能。retry使用ribbon的配置来重试。