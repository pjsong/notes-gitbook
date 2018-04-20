# 设计模式

<http://enos.itcollege.ee/~jpoial/java/naited/Java-Design-Patterns.pdf>
<https://en.wikipedia.org/wiki/Software_design_pattern>

模式四要素： 名称，问题：什么时候用，方案，结果

## 创建

+ 解决怎么设计对象的初始化。
+ 用继承来实现对象的差异化创建。
+ 他们主要两方面特征： 封装了使用哪一个具体类的知识; 隐藏了实例的生成细节。给设计者空间去设计什么时候创建，怎样创建。
+ 有时候，几个模式都同时使用，有时候要模式结合来使用。
+ factory, abstract factory, builder, singleton, prototype

### Abstract factory

#### 问题

+ application be independent of how its objects are created
+ class be independent of how the objects it requires are created
+ families of related or dependent objects be created

#### solution

+ Encapsulate object creation in a separate (factory) object. That is, define an interface (AbstractFactory) for creating objects, and implement the interface
+ A class delegates object creation to a factory object instead of creating objects directly.

返回不需要具体的类，类型即可。

+ 抽象工厂接口，返回另一个具体工厂接口
+ 具体工厂接口，返回具体的对象
+ 根据输入得到具体工厂，有具体工厂创建对象

### Builder

#### builder问题

+ class (the same construction process) create different representations of a complex object
+ class that includes creating a complex object be simplified

#### builder solution

+ Encapsulate creating and assembling the parts of a complex object in a separate Builder object.
+ A class delegates object creation to a Builder object instead of creating the objects directly

把复杂对象的创建与表示细节分离

+ 具体类，构造函数private, builder方法调用构造函数返回实例。
+ builder类含有具体类同样的成员，通过不断设置状态的方法，最后用build方法返回具体类的实例。

### singleton

+ common implementation

```java
public final class Singleton {
    private static final Singleton INSTANCE = new Singleton();

    private Singleton() {}

    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

+ lazy

```java
public final class Singleton {
    private static volatile Singleton instance = null;
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized(Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

+ Initialization-on-demand holder idiom

```java
public class Something {
    private Something() {}

    private static class LazyHolder {
        static final Something INSTANCE = new Something();
    }

    public static Something getInstance() {
        return LazyHolder.INSTANCE;
    }
}
```

## 结构

+ 怎样把对象和类组织成一个大的结构。
+ 结构类`structural class`用继承来组装接口和实现。比如想想多重集成怎样吧多个类组装成一个类。用于把各种独立开发的类库组合起来。
+ 结构对象`structural object`不是直接写接口或者实现，而是描述了组装对象来实现新功能的方法。
+ 对象组装可以运行是更改，这对于静态类组装是实现不了的。
+ adapter, bridge, composite, decorator, facade

### Adapter

#### adapter 问题

+ a class be reused that does not have an interface that a client requires
+ classes that have incompatible interfaces work together
+ an alternative interface be provided for a class

#### adapter solution

+ Define a separate Adapter class that converts the (incompatible) interface of a class (Adaptee) into another interface (Target) clients require.
+ Work through an Adapter to work with (reuse) classes that do not have the required interface

```java
public class Format1ClassA extends ClassA {
   @Override
   public String getStringData() {
      return format(toString());
   }
}
public interface StringProvider {
    public String getStringData();
}

public class ClassAFormat1 implements StringProvider {
    private ClassA classA = null;
    public ClassAFormat1(final ClassA a) {
        classA = a;
    }
    public String getStringData() {
        return format(classA.getStringData());
    }
    private String format(final String sourceValue) {
        // Manipulate the source string into a format required 
        // by the object needing the source object's data
        return sourceValue.trim();
    }
}

public class ClassAFormat1Adapter extends Adapter {
   public Object adapt(final Object anObject) {
      return new ClassAFormat1((ClassA) anObject);
   }
}
```

## 行为

+ 算法和对象之间的责任分配。
+ 使用对象组装而不是继承。
+ blackboard, chain of responsibility, command, interpreter, mediator