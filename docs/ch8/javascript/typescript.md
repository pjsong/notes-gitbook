# TypeScript

## namespace

+ 在global namespace中命令的javascript对象。

```typescript
interface StringValidator {
    isAcceptable(s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}

class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: StringValidator; } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
    for (let name in validators) {
        let isMatch = validators[name].isAcceptable(s);
        console.log(`'${ s }' ${ isMatch ? "matches" : "does not match" } '${ name }'.`);
    }
}
######################################优化
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

// Some samples to try
let strings = ["Hello", "98052", "101"];
// Validators to use
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
    for (var name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
}
######################################之后
validation.ts
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
}
LettersOnlyValidator.ts
/// &lt;reference path="Validation.ts" />
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}
ZipCodeValidator.ts
/// &lt;reference path="Validation.ts" />
namespace Validation {
    const numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
Test.ts
/// &lt;reference path="Validation.ts" />
/// &lt;reference path="LettersOnlyValidator.ts" />
/// &lt;reference path="ZipCodeValidator.ts" />
let strings = ["Hello", "98052", "101"];
// Validators to use
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();
// Show whether each string passed each validator
for (let s of strings) {
    for (let name in validators) {
        console.log(""" + s + "" " + (validators[name].isAcceptable(s) ? " matches " : " does not match ") + name);
    }
}
```

###########################################
`tsc --outFile sample.js Test.ts`
###########################################
使用别名
namespace Shapes {
    export namespace Polygons {
        export class Triangle { }
        export class Square { }
    }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
</pre>

###.d.ts
为了适应编译器，要引入第三方库的.d.ts文件。这些文件declare给编译器他要暴露的对象/方法，github中有一个仓库专门放第三方库的declaration文件。definitelyTyped.
如果开发了一个可重用组件或者库，用以下命令生成该文件。
`tsc --declaration myFile.ts`


###ambient namespace
没有定义实现的declaration为ambient.通常定义在.d.ts文件，可以看作C++里面的.h文件。比如d3库，用全局对象d3来定义功能，用`<script>`装入而不是模块装入，那么，他的declaration就用namespace来定义形状。用ambient declaration编译器就能看到形状了。
<pre>
D3.d.ts (simplified excerpt)
declare namespace D3 {
    export interface Selectors {
        select: {
            (selector: string): Selection;
            (element: EventTarget): Selection;
        };
    }

    export interface Event {
        x: number;
        y: number;
    }

    export interface Base extends Selectors {
        event: Event;
    }
}

declare var d3: D3.Base;
</pre>

###declare关键字
对于不从typescript文件中过来的变量，用declare.比如没有d.ts的第三方库变量。比如有一个lib没有.d.ts, namespace为mylibrary，就可以用`declare var myLibrary;`来declare避免编译错误。也可以不用'declare'关键字如:`var myLibrary: any;`


###modules
+  declare依赖
+  依赖模块加载器
+  用export暴露函数等




###pitfalls
+ 用`/// <reference ... />`引用模块文件，而不是`import`。 

要知道编译器怎样基于import的path来定位模块类型信息： 1，在路径下查找`ts, tsx, .d.ts`,如果找不到，就找ambient module declaration。
<pre>
myModules.d.ts
// In a .d.ts file or .ts file that is not a module:
declare module "SomeModule" {
    export function fn(): string;
}
#######################
myOtherModule.ts
/// &lt;reference path="myModules.d.ts" />
import * as m from "SomeModule";
</pre>

##构造函数[classes](https://www.typescriptlang.org/docs/handbook/classes.html)
<pre>
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter: Greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
################################################
let Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
})();

let greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
################################################
class Greeter {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet());

// “give me the type of the Greeter class itself rather than instance type, or give me the type of the symbol called Greeter,” which is the type of the constructor function. 
let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
</pre>

#####class as interface
<pre>
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
</pre>