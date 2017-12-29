# prototype是怎样工作的

<https://stackoverflow.com/questions/572897/how-does-javascript-prototype-work>

## instanceOf vs typeof

都返回类型信息。instanceOf比较内存指针，typeof得到字符串

### instanceof

tests the presence of constructor.prototype in object's prototype chain.
测试对象的prototype链中是否存在constructor.prototype
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#Description>




## Object和Function

```javascript
function ninja(){};
console.log(ninja instanceOf Object && ninjia.instanceOf Function);
console.log(typeof(ninja));