# 语言摘要

## 内置对象

### [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

```javascript
var animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];
var last = animals[animals.length - 1];
console.log(animals.slice(2));// expected output: Array ["camel", "duck", "elephant"]
console.log(animals.slice(2, 4));// expected output: Array ["camel", "duck"]

var fruits = ['Apple', 'Banana'];
fruits.forEach(function(item, index, array) {
  console.log(item, index,array);
});
var newLength = fruits.push('Orange');// ["Apple", "Banana", "Orange"]
var last = fruits.pop();// ["Apple", "Banana"];
fruits.shift(); // remove Apple from the front, ["Banana"];
fruits.unshift('Strawberry') // add to the front, ["Strawberry", "Banana"];
var pos = fruits.indexOf('Banana');// 1
var shallowCopy = fruits.slice(); // this is how to make a copy

console.log(fruits['2'] != fruits['02']);//数字index将转换为字符串
fruits[5] = 'mango';
console.log(fruits[5]); // 'mango'
console.log(Object.keys(fruits));  // ['0', '1', '2', '5']
console.log(fruits.length); // 6//引擎自动更新length
fruits.length = 2;
console.log(Object.keys(fruits)); // ['0', '1']
console.log(fruits.length); // 2

var myRe = /d(b+)(d)/i;//正规表达式，大小写不敏感，d大头，中间至少一个b，d结尾
var myArray = myRe.exec('cdbBdbsbz');//
myArray.input = 'cdbBdbsbz'; myArray.index=1;//index从0开始，
myArray[0]='dbBd';myArray[1]='bB'; myArray[2]='d';

console.log(Array.from('foo'));// expected output: Array ["f", "o", "o"]
console.log(Array.from([1, 2, 3], x => x + x));// expected output: Array [2, 4, 6]

if (!Array.prototype.first) {
  Array.prototype.first = function() {
    return this[0];
  }
}

Array.isArray([1, 2, 3]);  // true
Array.isArray({foo: 123}); // false
Array.isArray('foobar');   // false

Array.of(7);       // [7]
Array.of(1, 2, 3); // [1, 2, 3]
Array(7);          // [ , , , , , , ]
Array(1, 2, 3);    // [1, 2, 3]

var arr1 = ['a', 'b', 'c'];var arr2 = ['d', 'e', 'f'];
var arr3 = arr1.concat(arr2);//return a merged new array

['alpha', 'bravo', 'charlie', 'delta'].copyWithin(2, 0);// results in ["alpha", "bravo", "alpha", "bravo"]， mutable！
arr.copyWithin(target is 0 based index at which to copy the sequence to, start is optional and 0 based index at which to start copying from, end is end copying from, if ommited, copy until the end):

var a = ['a', 'b', 'c'];
var iterator = a.entries();
console.log(iterator.next().value); // [0, 'a']
console.log(iterator.next().value); // [1, 'b']
console.log(iterator.next().value); // [2, 'c']


var array1 = [1, 30, 39, 29, 10, 13];
console.log(array1.every(currentValue=>{return currentValue < 40}));

var numbers = [1, 2, 3]
numbers.fill(1); // results in [1, 1, 1]

var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
const result = words.filter(word => word.length > 6);// expected output: Array ["exuberant", "destruction", "present"]

function isBigEnough(element) {
  return element >= 15;
}

[12, 5, 8, 130, 44].find(element=>{return element >= 15;}); // 130, 返回第一个

[5, 12, 8, 130, 44].findIndex(element=>{return element>13;});// expected output: 3

['a', 'b', 'c'].forEach(function(element) {
    console.log(element);
});

[1, 2, 3].includes(2); //true

[2, 9, 9].indexOf(2); // 0
[2, 9, 9].indexOf(7); // -1

['Fire', 'Wind', 'Rain'].join();// expected output: Fire,Wind,Rain
['Fire', 'Wind', 'Rain'].join('');// expected output: FireWindRain
['Fire', 'Wind', 'Rain'].join('-'));// expected output: Fire-Wind-Rain

var arr = ['a', 'b', 'c'];
var iterator = arr.keys();
console.log(iterator.next()); // { value: 0, done: false }
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

['Dodo', 'Tiger', 'Penguin', 'Dodo'].lastIndexOf('Dodo');// expected output: 3
['Dodo', 'Tiger', 'Penguin', 'Dodo'].lastIndexOf('Tiger');// expected output: 1

[1, 4, 9, 16].map(x => x * 2);// expected output: Array [2, 8, 18, 32]

const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));// expected output: 10
// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));// expected output: 15

var flattened = [[0, 1], [2, 3], [4, 5]].reduceRight(function(a, b) {
    return a.concat(b);
}, []);// flattened is [4, 5, 2, 3, 0, 1]

['one', 'two', 'three'].reverse(); // ['three', 'two', 'one']

var animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];
console.log(animals.slice(2));// expected output: Array ["camel", "duck", "elephant"]
console.log(animals.slice(2, 4));// expected output: Array ["camel", "duck"]
console.log(animals.slice(1, 5));// expected output: Array ["bison", "camel", "duck", "elephant"] shallow copy to a new array

[2, 5, 8, 1, 4].some((ele, index, array)=>{return return element > 10;});  // false
[12, 5, 8, 1, 4].some((ele, index, array)=>{return return element > 10;}); // true

var things = ['word', 'Word', '1 Word', '2 Words'];
things.sort(); // ['1 Word', '2 Words', 'Word', 'word']

var myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
myFish.splice(2, 0, 'drum'); // insert 'drum' at 2-index position
// myFish is ["angel", "clown", "drum", "mandarin", "sturgeon"]
myFish.splice(2, 1); // remove 1 item at 2-index position (that is, "drum")
// myFish is ["angel", "clown", "mandarin", "sturgeon"]
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])

var number = 1337;
var date = new Date();
var myArr = [number, date, 'foo'];
var str = myArr.toLocaleString();
console.log(str); // logs '1337,6.12.2013 19:37:35,foo'
// if run in a German (de-DE) locale with timezone Europe/Berlin

var a = ['w', 'y', 'k', 'o', 'p'];
var iterator = a.values(); // or var eArr = arr[Symbol.iterator]();
console.log(iterator.next().value); // w
console.log(iterator.next().value); // y
console.log(iterator.next().value); // k
console.log(iterator.next().value); // o
console.log(iterator.next().value); // p

var arr = ['w', 'y', 'k', 'o', 'p'];
var eArr = arr[Symbol.iterator]();
// your browser must support for..of loop
// and let-scoped variables in for loops
for (let letter of eArr) {
  console.log(letter);
}
```

## Function

```javascript
console.log(Function.length); /* 1 */
console.log((function()        {}).length); /* 0 */
console.log((function(a)       {}).length); /* 1 */
console.log((function(a, b)    {}).length); /* 2 etc. */
console.log((function(...args) {}).length); // 0, rest parameter is not counted
console.log((function(a, b = 1, c) {}).length);// 1, only parameters before the first one with a default value is counted

function doSomething() {}
doSomething.name; // "doSomething"
(new Function).name; // "anonymous", Functions created with the syntax new Function(...) or just Function(...)
var f = function() {};
var object = {
  someMethod: function() {}
};
console.log(f.name); // "f"
console.log(object.someMethod.name); // "someMethod"
```

## for loop

[ref](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

```javascript
var arr = [3, 5, 7];
var arr1 = [...Array(5).keys()];
[0, 1, 2, 3, 4]
arr.foo = 'hello';
for (var i in arr) {
   console.log(i); // logs "0", "1", "2", "foo"
}
for (var i of arr) {
   console.log(i); // logs 3, 5, 7
}
```

### rest和spread操作符`...`

<http://exploringjs.com/es6/ch_parameter-handling.html#sec_spread-operator>

+ rest把iterable中剩余的item搜集到Array

```javascript
function f(x, ...y) {
    ···
}
f('a', 'b', 'c'); // x = 'a'; y = ['b', 'c']
f(); // x = undefined; y = []
const [x, ...y] = ['a', 'b', 'c']; // x='a'; y=['b', 'c']
const [x, y, ...z] = ['a']; // x='a'; y=undefined; z=[]
const [x, ...[y, z]] = ['a', 'b', 'c'];
```

+ spread把iterable中的参数变成函数调用的参数或者Array的item.

```javascript
Math.max(-1, 5, 11, 3)
Math.max(...[-1, 5, 11, 3])
Math.max(-1, ...[-1, 5, 11], 3)
const arr1 = ['a', 'b'];
const arr2 = ['c', 'd'];
arr1.push(...arr2);
```

### RegExp `/pattern/flags`

#### flags

+ g 查找所有匹配，不是找到就停止
+ i 忽略大小写
+ m 多行，处理^#号时，以行为单位，而不仅仅是开始和结束
+ u 把pattern当unicode
+ y 根据表达式的lastIndex属性，从该index开始匹配。

#### 三种匹配方式

<https://docs.oracle.com/javase/tutorial/essential/regex/quant.html#difs>
量词后不再加`？`，`+`，表示greedy, 加`?`表示reluctant, 加`+`表示possessive

+ X？ greedy, 匹配器匹配之前，读入整个串，如果第一次失败，则后退一个字符再尝试;直到找到匹配或者退完了;
+ X?? reluctant，与greedy相反，从字符串的第一个字符开始，直到整个字符串
+ X?+ possessive，读入整个串，但匹配不后退。

#### 构子

[详细](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#boundaries)

+ 字符类 `.`,`\d`,`\w`,`\s`,`\D`,`\W`,`\S`,`\t`,`\v`,`\r`,`\n`,`\f`,`[\b]`,`\0`,`\cX`,`\xhh`,`\uhhhh`,`\u{hhhh}`, `\`
+ 字符集 `[xyz],[a-c],[^xyz],[^a-c]`
+ 或者 `x|y`
+ 边界 `^,$,\b,\B`
+ 组/回引 `(x),\n,(?:x)`
+ 量词 `?,+,*,{n},{n,},{n,m}`
+ 断言 `x(?=y), x(?!y)`

#### 例子

```javascript
var re = /quick\s(brown).+?(jumps)/ig;
var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
console.log(re);console.log(result);
/(hello \S+)/.exec('This is a hello world!');

var str = 'hello world!';
var result = /^hello/.test(str);
console.log(result); // true
var regex = /foo/g;// regex.lastIndex is at 0
regex.test('foo'); // true
// regex.lastIndex is now at 3
regex.test('foo'); // false
```

### Set

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set>

```javascript
var mySet = new Set();

mySet.add(1); // Set [ 1 ]
mySet.add(5); // Set [ 1, 5 ]
mySet.add(5); // Set [ 1, 5 ]
mySet.add('some text'); // Set [ 1, 5, 'some text' ]
var o = {a: 1, b: 2};
mySet.add(o);
mySet.add({a: 1, b: 2}); // o is referencing a different object so this is okay

mySet.has(1); // true
mySet.has(3); // false, 3 has not been added to the set
mySet.has(5);              // true
mySet.has(Math.sqrt(25));  // true
mySet.has('Some Text'.toLowerCase()); // true
mySet.has(o); // true

mySet.size; // 5

mySet.delete(5); // removes 5 from the set
mySet.has(5);    // false, 5 has been removed

mySet.size; // 4, we just removed one value
console.log(mySet);// Set [ 1, "some text", Object {a: 1, b: 2}, Object {a: 1, b: 2} ]

// logs the items in the order: 1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2} 
for (let item of mySet) console.log(item);
// logs the items in the order: 1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2} 
for (let item of mySet.keys()) console.log(item);
// logs the items in the order: 1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2} 
for (let item of mySet.values()) console.log(item);
// logs the items in the order: 1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2} 
//(key and value are the same here)
for (let [key, value] of mySet.entries()) console.log(key);

// convert Set object to an Array object, with Array.from
var myArr = Array.from(mySet); // [1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2}]

// the following will also work if run in an HTML document
mySet.add(document.body);
mySet.has(document.querySelector('body')); // true

// converting between Set and Array
mySet2 = new Set([1, 2, 3, 4]);
mySet2.size; // 4
[...mySet2]; // [1, 2, 3, 4]

// intersect can be simulated via
var intersection = new Set([...set1].filter(x => set2.has(x)));

// difference can be simulated via
var difference = new Set([...set1].filter(x => !set2.has(x)));

// Iterate set entries with forEach
mySet.forEach(function(value) {
  console.log(value);
});
```

### Generator函数

```javascript
function* generator(i) {
  yield i;
  yield i + 10;
}
var gen = generator(10);
console.log(gen.next().value);// expected output: 10
console.log(gen.next().value);// expected output: 20
```

`function*` 声明返回一个`GeneratorFunction`对象.另一种构造方式`Object.getPrototypeOf(function*(){}).constructor`

这种函数在再次进入时，能得到上次的上下文也就是变量值。
Generator对于异步编程是个强有力的工具，特别是与Promise结合使用时，能够减轻回调的压力。异步函数都是采用这种模式。

调用一个generator函数并不会立即执行，而是先返回一个iterator对象。只有iterator.next()执行, generator的函数内容才会执行，直到第一个yield表达式。表达式返回一个值，或者用`yield*`代理给另外一个generator函数。`next()`返回一个对象`{"value":"yieldValue", "done":"isLastYieldedValue"}`.
如果带参数调用`next(arg)`,则会用`arg`替换掉暂停位置的执行。

`return`执行时，会结束generator.
错误也会结束执行。除非在内部有`catch`
如果执行完了再次调用，返回`{value: undefined, done: true}`.

```javascript
//返回generator函数
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}
function* generator(i) {
  yield i;
  yield* anotherGenerator(i);
  yield i + 10;
}
var gen = generator(10);
console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // 13
console.log(gen.next().value); // 20

//传入参数
function* logGenerator() {
  console.log(0);
  console.log(1, yield);
  console.log(2, yield);
  console.log(3, yield);
}
var gen = logGenerator();
// the first call of next executes from the start of the function
// until the first yield statement
gen.next();             // 0
gen.next('pretzel');    // 1 pretzel
gen.next('california'); // 2 california
gen.next('mayonnaise'); // 3 mayonnaise

//表达式创建
const foo = function* () {
  yield 10;
  yield 20;
};
const bar = foo();
// {value: 10, done: false}
bar.next();
```