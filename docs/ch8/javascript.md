# valilla javascript

[规范](http://www.ecma-international.org/ecma-262/5.1/)

## 为什么要学

<https://medium.freecodecamp.org/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34>

+ 框架/库的演变非常快， 有一些必然会消失
+ 框架只是一个快捷键，不会告诉你很多基本的东西， 如闭包如何工作， 对象引用的传递。在框架抽象之后学习这些东西更难。
+ 他是所有库/框架的基础。学好valilla js, 要学别的框架， 仅仅是一个熟悉句法的事情。
+ 可以通过读框架的源代码来测试你纯javascript学得怎样。
+ 许多框架都缺乏文档，但代码很复杂，懂了纯javascript，修改源代码小菜一叠。

作者推荐的书籍：
[eloquentjavascript](http://eloquentjavascript.net)
[you dont know js](https://github.com/getify/You-Dont-Know-JS)
[视频 Javascript: Understanding the Weird Parts](<https://github.com/SOSANA/All-Things-Javascript/tree/master/javascript-Understanding-the-Weird-Parts/section2>)

## 资源

[plainjs](https://plainjs.com/)

## 基本概念

+ 表达式和陈述：
  + 表达式产生一个值(eloquentjs)，是对变量或者值或者变量、值及操作符组合的引用（ydk），
  + 陈述带分号，由表达式组成，执行一个任务，改变程序的状态，影响后面的陈述。
+ 变量没有类型，值才有。`number, string, boolean, null||undefined, object||function, symbol`
+ void关键字，计算表达式，返回undefined，参考[1](https://www.tutorialspoint.com/javascript/javascript_void_keyword.htm),[2](http://www.ecma-international.org/ecma-262/5.1/#sec-11.4.2)
+ `==`规则
  + 类型相同时，
    + object必须是同一个对象
    + Number 0+ == 0-, 或者同一个值，不能有NaN
    + undefined || null类型
  + 类型不同时[规范](http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3)
    + 基本类型包括boolean, 全部转number
    + 基本类型和对象，对象转基本类型[规范](http://www.ecma-international.org/ecma-262/5.1/#sec-9.1)
  + 建议用 `===`
    + 如果两边有一个为boolean
    + 如果两边有一个为特殊值如0,''，[]
+ 变量名， [^a-zA-Z$_][a-zA-Z\d], 属性名同样适用，不过属性名可以用关键字
+ IIFE作为模块模式，包括继承, 详细参考[1](https://toddmotto.com/mastering-the-module-pattern/),[2](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)

```javascript
var Module = (function () {
  return {
    publicMethod: function () {
      // code
    }
  };
})();

var ModuleTwo = (function (Module) {
    Module.extension = function () {
        // another method!
    };
    return Module;
})(Module || {});
```

+ polyfilling, 用老代码实现语言中的新功能， 比如ES6的Number有方法`.isNaN`, 如果浏览器没有ES6实现，如下代码可以解决, 常用的polyfill有ES5-shim, ES6-shim

```javascript
if (!Number.isNaN) {
  Number.isNaN = function isNaN(x) {
    return x !== x;
  };
}
```

因为`NaN`是整个语言唯一不等于自己的对象.

+ transpiling. 对于语言中的新句法, polyfill无能为力，新句法在老浏览器会报错,因此需要一个工具把新的代码变成等价的老代码。就是transform+compiling. 通常你用新句法写代码，把transpiler加入到build过程，成为可以部署的老句法代码。babel或者traceur
+ 非js部分。js的很多代码，都不由js控制，典型就是DOM API。浏览器中document作为全局变量存在，实际上不是严格的javascript Object，通常叫host object.传统上DOM对象及行为实现都很可能是C++. Window的alert方法，console等都是。

## 关键概念

### 闭包

外面的函数运行结束， 里边返回的函数还能获取其内部的变量， 用于实现模块。

#### 例子

```javascript
function User(){
  var username, password;
  function doLogin(user,pw) {
    username = user;
    password = pw;
    // do the rest of the login work
  }
  var publicAPI = {
    login: doLogin
  };
  return publicAPI;
}
// create a `User` module instance
var fred = User();
fred.login( "fred", "12Battery34!" );
```

```javascript
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = (function(index) {
        return function() {
            console.log("My value: " + index);
        };
    }(i));
}
for (var j = 0; j < 3; j++) {
    funcs[j]();
}
```

#### 闭包细节

Scope & Closures的名号，是被误会突出的，这个误会就是，JS是一个解释语言，因此没有被编译。 错了。
JS引擎在执行前或者执行中来编译代码。因此我们要深入理解编译器怎样处理我们的代码，了解它是怎样处理变量和函数声明的。同时，我们也会看到那个经典的变量域管理的比方，hoisting.
了解lexical scope是我们对closure的探索的是基楚。closure可能是最重要的概念，但如果你没有牢固掌握scope怎样工作，closure可能仍在你能力之外。
closure的一个重要应用是模块模式。模块模式可能是最流行的代码组织模式，深入理解它至关重要。


### This 指针

函数中的this指针是动态的，指向谁要看函数是如何执行的，而不是函数在哪里定义的。

```javascript
function foo() {
  console.log( this.bar );
}
var bar = "global";
var obj1 = {
  bar: "obj1",
  foo: foo
};
var obj2 = {
  bar: "obj2"
};
foo();    // "global"
obj1.foo();    // "obj1"
foo.call( obj2 );    // "obj2"
new foo();    // undefined
```

#### 其他this [原文](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)

+ GlobalSample

```javascript
function hello(thing) {
  console.log(this + " says hello " + thing);
}
hello.call("Yehuda", "world") //=> Yehuda says hello world
    ####################################
// this:
hello("world")
// desugars to:
hello.call(window, "world");
```

in ECMAScript 5 only when using strict mode[2]:hello.call(undefined, "world");

+ member function

```javascript
var person = {
  name: "Brendan Eich",
  hello: function(thing) {
    console.log(this + " says hello " + thing);
  }
}
// this:
person.hello("world")
// desugars to this:
person.hello.call(person, "world");

    ###############################
function hello(thing) {
  console.log(this + " says hello " + thing);
}
person = { name: "Brendan Eich" }
person.hello = hello;
person.hello("world") // still desugars to person.hello.call(person, "world")
hello("world") // "[object DOMWindow]world"
```

+ bind

```javascript
var person = {
  name: "Brendan Eich",
  hello: function(thing) {
    console.log(this.name + " says hello " + thing);
  }
}
var boundHello = function(thing) { return person.hello.call(person, thing); }
boundHello("world");
###################################### more generic
var bind = function(func, thisValue) {
  return function() {
    return func.apply(thisValue, arguments);
  }
}

var boundHello = bind(person.hello, person);
boundHello("world") // "Brendan Eich says hello world"
###################################### ES5
var boundHello = person.hello.bind(person);
boundHello("world") // "Brendan Eich says hello world"
```

+ 在object的method中嵌入一个访问object属性的函数，此时用self = this 绑定对象

```javascript
var myObject = {
  aMethod: function() {
    var self = this;
    this.aProperty = 'foo';
    setTimeout(function() {
      console.log(self.aProperty); // outputs 'foo'
    }, 1);
  }
};
```



## 原型prototype

对象创建的时候都会有一个prototype

```javascript
var foo = {
  a: 42
};
// create `bar` and link it to `foo`
var bar = Object.create( foo );
bar.b = "hello world";
bar.b;    // "hello world"
bar.a;    // 42 <-- delegated to `foo`
```

## function



## 函数表达式

### for循环中的变量

[参考](http://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example)

#### 没有closure的问题写法

```javascript
var funcs = [];
for (var i = 0; i < 3; i++) {          // let's create 3 functions
    funcs[i] = function() {            // and store them in funcs
        console.log("My value: " + i); // each should log its value.
    };
}
for (var j = 0; j < 3; j++) {
    funcs[j]();                        // and now let's run each one to see
}
```

