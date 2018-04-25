# Groovy 脚本

<https://www.timroes.de/2015/06/28/groovy-tutorial-for-java-developers-part2-closures/>

## 基本解释

`println "Hello World"`

+ println是个`System.out.prinln`快捷键
+ 没有分号
+ 如果能检测后面是参数，方法调用可以忽略括号
+ 运行时确定类型

```groovy
def x = 42
println x.getClass() //class java.lang.Integer
def firstName = "Douglas"
def name = "Adams"
println "Hello, ${firstName[0]}. $name" //Hello, D. Adams
```

+ 引号。单引号没有插值功能， 双引号支持插值因此要对`$`转义，三引号支持多行， `/string/`同时支持插值和多行， 与三引号主要区别是不需要对`\`转义。
+ 正规表达式，`~`打头

```groovy
def s = """This is
a multiline
string"""
def pattern = ~/a slash must be escaped \/ but backslash, like in a digit match \d does not/
println pattern.getClass() //java.util.regex.Pattern
```

+ 正规匹配操作符`=~`

```groovy
def m = "Groovy is groovy" =~ /(G|g)roovy/
println m[0][0] // The first whole match (i.e. the first word Groovy)
println m[0][1] // The first group in the first match (i.e. G)
println m[1][0] // The second whole match (i.e. the word groovy)
println m[1][1] // The first group in the second match (i.e. g)
```

+ 安全Navigation`if(company.getContact()?.getAddress()?.getCountry() == Country.NEW_ZEALAND) { ... }`
+ elseif新写法。`def name = client.getName() != null ? client.getName() : ""`等价于`def name = client.getName() ?: ""`

## 闭包

+ 匿名可执行代码块
+ 可赋值给变量，可访问上下文变量

```groovy
def power = { int x, int y ->
  return Math.pow(x, y)
}
println power(2, 3) // Will print 8.0

def say = { what ->
  println what
}
say "Hello World"

def say = { println it }
say "Hello World"  // only parameter can be ignored and use it

def square = { it * it }
println square(4) // Will print out 16, 默认返回最后一个陈述，不用return

def transform = { str, transformation ->
  transformation(str)
}
println transform("Hello World", { it.toUpperCase() }) //把closure做参数
println transform("Hello World") { it.toUpperCase() } //句法压缩，可以把closure参数放到括号之后

def createGreeter = { name ->
  return {
    def day = new Date().getDay()
    if (day == 0 || day == 6) {
      println "Nice Weekend, $name"
    } else {
      println "Hello, $name"
    }
  }
}
def greetWorld = createGreeter("World")
greetWorld()  //返回闭包的闭包，返回后仍可得到上一个参数值world
```

## 集合运算

```groovy
def list = [1,1,2,3,5]
if (4 in list) { ... } //in 操作符

list.each {
  println it
}

def even = list.findAll { it % 2 == 0 }//过滤

def squaredList = list.collect { it * it }//类似javascript的map

def upper = ["Hello", "World"].collect { it.toUpperCase() } //句法sugar
def upper = ["Hello", "World"]*.toUpperCase()