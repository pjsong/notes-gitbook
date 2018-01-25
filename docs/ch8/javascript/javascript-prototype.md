# prototype是怎样工作的

js类型分为基本类型和对象， 对象分为函数对象和一般对象， 用typeOf， 函数对象返回"function", 一般对象返回"object",基本类型返回"number, string, boolean, undefined"

函数对象(包括Function对象本身，使用了递归定义)是内置对象Function的实例。只有函数对象能用new生成一般对象。一般对象不能使用new再生成对象。

函数对象可以作为构子，用new生成新的一般对象。不过， Object，Array, RegExp不用new关键字({}，[], / /)，但String, Number, Boolean都要。

new生成的对象有一个内部引用__proto__，指向构子的prototype, 从那里继承属性和方法。这个内部引用就叫成对象的prototype, 通过Object.getPrototypeOf得到，形成prototype链。

不管函数对象一般对象，都有constructor属性，这个constructor都从构子的prototype的constructor继承。缺省，只要构子缺省的prototype没有改写，prototype的constructor都指向构子。

所有的函数对象， 其构子一律是Function， 非函数对象，构子函数是创建他的函数。比如Math就是Object

每个构子定义的时候都会自动附上prototype属性， 使用对象作为值，这个对象本身又有一个属性constructor指向构子。因此prototype只在函数对象上存在. 如果把构子的prototype设为null, 则构子创建对象.__proto__为Object.__proto__.

+ 函数对象.__proto__ --> Function.__proto__ --> Object.__proto__
+ 简单对象.__proto__ --> Object._prototype__
+ new或者Object.create()对象.__proto__ --> 函数.prototype链 -->Object.__proto__

<https://stackoverflow.com/questions/572897/how-does-javascript-prototype-work>

## Object

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object>
构子函数，把值打包对象，有length和prototype两个属性
创建手段有`new Object(); Object.create();{}`

## in vs hasOwnProperty

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty>
hasOwnProperty对象是否含有直接自己的属性(不是继承来)， in会检查prototype

## instanceOf vs typeof

都判断类型信息。instanceOf检查构子，typeof得到字符串

instanceOf， 判断是否对象由给定的构子创建， 看构子的prototype是否在对象的prototype链中。
这也是为什么primitive类型不适用，因为很多时候primitive类型都不用构子创建，也不推荐这样使用。

typeof检查一个值属于六种类型中的哪一个， string, number, boolean, object, function, undefined, 不依赖构子，即使未定义的变量也可以使用。

### instanceof

tests the presence of constructor.prototype in object's prototype chain.
测试对象的prototype链中是否存在constructor.prototype
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#Description>

```javascript
function C() {};
var o = new C();
console.assert(o instanceof C && Object.getPrototypeOf(o) === C.prototype && o instanceof Object && C.prototype instanceof Object);
C.prototype = {};

var o2 = new C();
console.assert(o2 instanceof C && !o instanceof(C) && !Object.getPrototypeOf(o) !== C.prototype)

function D() {}
D.prototype = new C(); // add C to [[Prototype]] linkage of D
var o3 = new D();
o3 instanceof D; // true
o3 instanceof C; // true since C.prototype is now in o3's prototype chain
```

instanceof测试随着构子的prototype属性， 或者Object.setPrototypeOf方法而变化。

## Object和Function

```javascript
function ninja(){};
console.assert(ninja instanceOf Object && ninjia.instanceOf Function);
```

## prototype

<https://stackoverflow.com/questions/572897/how-does-javascript-prototype-work>

以下判断都是true

```javascript
function Person() {};
// 因为Person作为function创建， 因此与所有的function共享prototype函数对象
console.log(Object.getPrototypeOf(Person) === Person.__proto__ ===  Function.prototype);

// 构成Person → Function.prototype → Object.prototype 的__proto__链条
console.log(Object.getPrototypeOf(Function.prototype) === Object.prototype);
console.log(Object.getPrototypeOf(Object.prototype) === null);

// Here we swap lanes, and look at the constructor of the constructor
console.log(Person.constructor === Function);
console.log(Person instanceof Function);

// Person.prototype was created by Person (at the time of its creation)
// Here we swap lanes back and forth:在两个链条上跳转
console.log(Person.prototype.constructor === Person);
// Although it is not an instance of it:
console.log(!(Person.prototype instanceof Person));
// Instances are objects created by the constructor:

var p = new Person();
// Similarly to what was shown for the constructor, here we have
// the same for the object created by the constructor:
console.log(Object.getPrototypeOf(p) === p.__proto__ === Person.prototype);

// prototype链条与Person所构建的对象几乎没有关系，Person构建的对象有自己的prototype链条
//p → Person.prototype → Object.prototype (end point)
console.log(p.constructor === Person);
console.log(p instanceof Person);
```

由此看到Person与两个chain(一个是函数本身代表的对象，一个是作为构子，构子才有prototype, 对象通过Object.getPrototypeOf方法，或者隐含的__proto__属性,图1)都有关系，要从一个链跳到另外一个， 可以用.prototype从构子的链跳到对象的链， 可以用.constructor从对象的链跳到构子的链。

prototype属性并没有主体的prototype链的信息，只有主题创建的对象的信息。prototype属性实际上叫做prototypeOfConstructedInstances更好。

Person.prototype对象在函数创建的时候就创建了，尽管函数没有执行，但该对象仍然以函数为构子。因此有两个对象产生， 一个是Person函数本身，另一个prototype对象，在创建对象的时候作为prototype. 此对象是后面创建的对象的prototype链的parent.

[图例1： thief->person](https://i.stack.imgur.com/m5DXc.png)
[图例2： 关系图1](https://i.stack.imgur.com/2tGyY.jpg)