# core

## IOC

### 容器/bean介绍

+ IOC/DI处理过程，对象定义他们的依赖，通过`constructor arguments`，`arguments to a factory method`，或者在对象`构造完成/工厂返回`之后，设置`properties`来完成。
+ 容器创建bean的时候，注入这些依赖。与bean自己控制依赖的初始化相反，因此得名IOC
+ `org.springframework.beans`和`org.springframework.context`是IOC的基础。
  + `BeanFactory`能够管理任意类型的对象，提供配置框架和基本能力。
  + `ApplicationContext`是子接口，超集，集成了AOP，资源处理(i18n)，事件发布，及特定上下文如(webapp中使用的context)。为BeanFactory增加了企业能力。
+ 形成应用骨架的对象是bean,由IoC初始化，组装，管理。bean和他们之间的依赖，容器通过`configuration metadata`来反映。

### 容器总揽

+ `ApplicationContext`代表容器，负责管理bean。通过读取`configuration metadata`获取指令。这些metadata可以是xml/annotation/code.
+ `ApplicationContext`有几种实现。如果单独应用，一般创建`ClassPathXmlApplicationContext`或者`FileSystemXmlApplicationContext`。大部分时候不需要明确的代码来初始化IoC。比如对于web application几行代码就行

```xml
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>/WEB-INF/daoContext.xml /WEB-INF/applicationContext.xml</param-value>
</context-param>
<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
```

+ `POJO`加上`metadata`经过Ioc,变成可执行应用。

#### meta data配置

现在更多人选择java代码的配置形式

```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

#### 容器初始化

```java
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");
ApplicationContext ctx =
    new FileSystemXmlApplicationContext("conf/appContext.xml");
ApplicationContext ctx =
    new FileSystemXmlApplicationContext("classpath:conf/appContext.xml");  
```

当Resource的URI没有前缀，那么得到的Resource类型由使用的方法来定，上面例子1会用`ClassPathResource`，2用`filesystem`，相对于当前的工作目录，3用前缀回到classpath

### Bean总揽

bean是通过metadata由容器创建的。在容器内部，定义表示为`BeanDefinition`



## 其他参考

### [生命周期](https://www.cnblogs.com/zrtqsk/p/3735273.html)

+ Bean自身的方法`init-method`和`destroy-method`指定的方法
+ Bean级生命周期接口方法`BeanNameAware`、`BeanFactoryAware`、`InitializingBean`和`DiposableBean`
+ 容器级生命周期接口方法`InstantiationAwareBeanPostProcessor` 和 `BeanPostProcessor` 
+ 工厂后处理器接口方法　`AspectJWeavingEnabler`, `ConfigurationClassPostProcessor`, `CustomAutowireConfigurer`。工厂后处理器也是容器级的。在应用上下文装配配置文件之后立即调用。

```java
 public class BeanLifeCycle {
     public static void main(String[] args) {
          System.out.println("1, 现在开始初始化容器");
         ApplicationContext factory = new ClassPathXmlApplicationContext("springBeanTest/beans.xml");
         System.out.println("19 容器初始化成功");    
         //得到Preson，并使用
         Person person = factory.getBean("person",Person.class);
         System.out.println("20" + person);
         
         System.out.println("21 现在开始关闭容器！");
         ((ClassPathXmlApplicationContext)factory).registerShutdownHook();
     }
 }
 public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
     public MyBeanFactoryPostProcessor() {
         super();
         System.out.println("2, 这是BeanFactoryPostProcessor实现类的构造器！！，BeanFactory构造结束之后执行");
     }
     @Override
     public void postProcessBeanFactory(ConfigurableListableBeanFactory arg0)
             throws BeansException {
         System.out.println("3, BeanFactoryPostProcessor.postProcessBeanFactory方法");
         BeanDefinition bd = arg0.getBeanDefinition("person");
         bd.getPropertyValues().addPropertyValue("phone", "110");
     }
 }

 public class MyBeanPostProcessor implements BeanPostProcessor {
      public MyBeanPostProcessor() {
         super();
         System.out.println("4, 这是BeanPostProcessor实现类构造器！！");
     }
     @Override
     public Object postProcessAfterInitialization(Object arg0, String arg1)
             throws BeansException {
         System.out.println("17 BeanPostProcessor接口方法postProcessAfterInitialization对属性进行更改！");
         return arg0;
     }
     @Override
     public Object postProcessBeforeInitialization(Object arg0, String arg1)
             throws BeansException {
         System.out.println("14 BeanPostProcessor接口方法postProcessBeforeInitialization对属性进行更改！");
         return arg0;
     }
 }
 public class MyInstantiationAwareBeanPostProcessor extends
         InstantiationAwareBeanPostProcessorAdapter {
     public MyInstantiationAwareBeanPostProcessor() {
        super();
         System.out.println("5, 这是InstantiationAwareBeanPostProcessorAdapter实现类的构造器！！");
     }
     @Override
     public Object postProcessBeforeInstantiation(Class beanClass,
             String beanName) throws BeansException {
         System.out.println("6, InstantiationAwareBeanPostProcessor调用postProcessBeforeInstantiation方法");
         return null;
     }
 
     // 接口方法、实例化Bean之后调用
     @Override
     public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
         System.out.println("18 InstantiationAwareBeanPostProcessor调用postProcessAfterInitialization方法");
         return bean;
     }
     // 接口方法、设置某个属性时调用
     @Override
     public PropertyValues postProcessPropertyValues(PropertyValues pvs,
             PropertyDescriptor[] pds, Object bean, String beanName) throws BeansException {
         System.out.println("8 InstantiationAwareBeanPostProcessor调用postProcessPropertyValues方法");
         return pvs;
     }
 }

public class Person implements BeanFactoryAware, BeanNameAware,
        InitializingBean, DisposableBean {
    private String name;
    private String address;
    private int phone;
    private BeanFactory beanFactory;
    private String beanName;

    public Person() {
        System.out.println("7【构造器】调用Person的构造器实例化");
    }
    public void setName(String name) {
        System.out.println("10【注入属性】注入属性name");
        this.name = name;
    }
    public void setAddress(String address) {
        System.out.println("9【注入属性】注入属性address");
        this.address = address;
    }
    public void setPhone(int phone) {
        System.out.println("11【注入属性】注入属性phone");
        this.phone = phone;
    }
    @Override
    public String toString() {
        return "Person [address=" + address + ", name=" + name + ", phone="
                + phone + "]";
    }
    // BeanFactoryAware接口方法
    @Override
    public void setBeanFactory(BeanFactory arg0) throws BeansException {
        System.out.println("13【BeanFactoryAware接口】调用BeanFactoryAware.setBeanFactory()");
        this.beanFactory = arg0;
    }

    // BeanNameAware接口方法
    @Override
    public void setBeanName(String arg0) {
        System.out.println("12【BeanNameAware接口】调用BeanNameAware.setBeanName()");
        this.beanName = arg0;
    }
    // InitializingBean接口方法
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out
                .println("15【InitializingBean接口】调用InitializingBean.afterPropertiesSet()");
    }
    // DiposibleBean接口方法
    @Override
    public void destroy() throws Exception {
        System.out.println("22【DiposibleBean接口】调用DiposibleBean.destory()");
    }
    // 通过<bean>的init-method属性指定的初始化方法
    public void myInit() {
        System.out.println("16【init-method】调用<bean>的init-method属性指定的初始化方法");
    }
    // 通过<bean>的destroy-method属性指定的初始化方法
    public void myDestory() {
        System.out.println("23【destroy-method】调用<bean>的destroy-method属性指定的初始化方法");
    }
}
```

+ 