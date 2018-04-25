# core

## 反射

### [class](https://docs.oracle.com/javase/tutorial/reflect/class/classNew.html)

+ Object.getClass()`"foo".getClass()`
+ The .class Syntax`boolean.class`
+ Class.forName()`class cDoubleArray = Class.forName("[D");`double[].class,`Class cStringArray = Class.forName("[[Ljava.lang.String;");`string[][].class
+ primitive type wrapper use `TYPE`. `Class c = Double.TYPE;`,`Class c = Void.TYPE;`
+ methods.`javax.swing.JButton.class.getSuperclass();`, `Class<?>[] c = Character.class.getClasses();`包含所有内部成员，如接口，enum，继承成员的class。

### fields， methods， constructors

## collection框架<https://docs.oracle.com/javase/tutorial/collections/intro/index.html>

主要包含

+ 接口，抽象数据类型，让对象操作与对象表示细节分离
+ 实现，可重用的数据结构
+ collection对象的算法如排序搜索。有多态的特性，同一个方法作用在不同的对象实现上。

## 关键接口

+ Collection，含set,list,queue,deque, set含sortedset
+ queue不一定FIFO，比如PriorityQueue使用comparator.
+ deque可以是LIFO，此时就是堆栈。所有元素都可以从两边读写。
+ map，含sortedMap