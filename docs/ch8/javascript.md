# function

## 关于this

[原文](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)

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
    </pre>

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

#### 函数表达式写法

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