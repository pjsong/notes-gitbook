# reactjs

## getStarted

<https://reactjs.org/tutorial/tutorial.html>
基于javascript, 更纯，更灵活。

## Create React App

+ `npm install -g create-react-app`, `create-react-app myapp`, `cd myapp && npm start`, `npm run build`输出到build文件夹

## 组件

### React.Component

组件告诉React提交的内容。当数据有更改，react负责更新和提交。
组件带有属性参数props，通过render方法返回视图的描述，也就是`react element`。JSX句法可以简化写法。
JSX内可以写javascript表达式，可以赋给变量，或者方法间传递，是一个javascript对象。

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
      </div>
    );
  }
}
//上面的return 等价
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */)
);
```

### [代码赏析](https://reactjs.org/tutorial/tutorial.html)

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     render() {
//       return (
//         <button className="square" onClick={() => this.props.onClick()}>
//            {this.props.value}
//         </button>
//       );
//     }
//   }
  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  class Board extends React.Component {
    renderSquareLine(line) {
      //Array(3)=[undefined*3], Array(3).keys()=ArrayIterator{}, [...Array(3).keys()]=[1,2,3]
      return [...Array(3).keys()].map((_, i) => {
        // return <Square value={this.props.squares[i + line * 3]}
        //   onClick={() => this.props.onClick(i + line * 3)} />
        return this.renderSquare(i + line * 3)
      });
    }
    renderSquare(i) {
      return <Square key={i} value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />;
    }

    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquareLine(0)}
          </div>
          <div className="board-row">
            {this.renderSquareLine(1)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }

  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
        stepNumber: 0,
      };
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]), xIsNext: !this.state.xIsNext,stepNumber: history.length,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      let status = winner ? 'Winner: ' + winner: 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares}
            onClick={(i) => this.handleClick(i)} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

## [Thinking in react]<https://reactjs.org/docs/thinking-in-react.html>

### UI打碎成层次化的组件

类似与设计师在photoshop中使用的层layer.
怎么判断那些应该成为一个组件？一个组件只做一件事。
常向用户展示json数据，也可以发现，组件与数据模型可以很好对应。

### 构建react的静态版本

静态版本不需要太多思考，大量敲键盘，而交互则相反。
静态版本不需要写state
小项目可以自顶向下，大项目相反。
静态版本完成后，会有许多提供数据模型的可重用组件。这些组件只有render方法。
最顶层的组建会把这些数据模型当作prop.

### 找到最小化的UI状态state表示

+ 如果是从parent那里通过props过来，那可能不是state
+ 不随着时间改变，那可能不是state
+ 可以通过组件的其他props和state获取，那可能不是state

### 找到state应该处在什么组件中

+ 找到所有基于状态渲染的组件
+ 找到一个公共的主组件
+ 公共组件或其之上的拥有state.
+ 如果找不到合适的拥有状态的组件，创建一个新的组件，并添加到公共组件之上。

### 添加反向数据流

```javascript
class ProductCategoryRow extends React.Component {
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan="2">
          {category}
        </th>
      </tr>
    );
  }
}

class ProductRow extends React.Component {
  render() {
    const product = this.props.product;
    const name = product.stocked ?
      product.name :
      <span style={{color: 'red'}}>
        {product.name}
      </span>;

    return (
      <tr>
        <td>{name}</td>
        <td>{product.price}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;

    const rows = [];
    let lastCategory = null;

    this.props.products.forEach((product) => {
      if (product.name.indexOf(filterText) === -1) {
        return;
      }
      if (inStockOnly && !product.stocked) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(
          <ProductCategoryRow
            category={product.category}
            key={product.category} />
        );
      }
      rows.push(
        <ProductRow
          product={product}
          key={product.name}
        />
      );
      lastCategory = product.category;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    //bind to input element
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  handleInStockChange(e) {
    this.props.onInStockChange(e.target.checked);
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            onChange={this.handleInStockChange}
          />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false
    };
//function bind this https://stackoverflow.com/questions/2236747/use-of-the-javascript-bind-method
// make this two function bind to searchBars props
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  handleInStockChange(inStockOnly) {
    this.setState({
      inStockOnly: inStockOnly
    })
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockChange={this.handleInStockChange}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}


const PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS} />,
  document.getElementById('container')
);

```

## [组合/继承](https://reactjs.org/docs/composition-vs-inheritance.html)

### 容器包含

组件比如滚动条，对话框，并不能预先知道有哪些孩子。
此类组件的推荐做法是， 使用特殊的prop来直接把孩子传进他们的输出。

```javascript
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

```javascript
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

### 特定形式

```javascript
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}
function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

组件形式

```javascript
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}
class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }
  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }
  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

## quickstart<https://reactjs.org/docs/introducing-jsx.html>

### 为什么用jsx

React 认为渲染逻辑本质上与其他的UI逻辑是耦合的。比如事件处理,状态变化以及数据显示之前的准备等。
不是人工去分离技术，把标记和逻辑分开存放。React把关注分开成松耦合的组件。组件同时包含两者。

+ 可以嵌入`{表达式}`。 JSX外面用`()`包起来，避免`自动分号插入`
+ 本身是表达式。编译之后jsx变成函数调用，并计算成javascript对象。就是说可以赋值给变量，作参数，或者从函数返回
+ 用jsx指定属性。`attr=“字符串”`或者`attr={expression}`, DONT不要`“{expression}”`。
+ 因为jsx更接近javascript, 而不是html,属性的名字使用Javascript驼峰规范，比如`tabindex`变成`tabIndex`,`class`变成`className`
+ 防止注入攻击。渲染之前，reactdom会把嵌入jsx中的所有值转义，因此可以放心放入应用之外的内容，防止XSS(crossSiteScripting).
+ jsx代表对象。最终编译成一个函数`React.createElement()`调用的表达式。最终的对象叫`react元素`，可以看作一个显示的描述，react读入对象，构建并更新DOM。

```javascript
//demo for 1
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
//demo for 2
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
//demo for 5
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
//demo for 6
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
//等价于
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
//最终对象
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

### 把元素渲染成DOM

元素是reactapp的最小构建单元。组件由元素构成。
与DOM元素不同，react元素是javascript对象。react-dom负责更新dom来匹配react元素。

#### 提交一个react元素到dom

假定有一个html元素`<div id="root"></div>`，我们称他为根dom节点，因为里面所有的内容都是react-dom管理。
react应用一般只有一个根节点。如果集成react到其他app,你可以有多个根节点。

#### 更新渲染的元素

React元素是不可变更immutable的. 一旦元素创建好就不能更改其孩子，属性。就像电影中的帧。
因此，更新UI唯一的方法就是创建新元素并传给`ReactDOM.render()`方法

```javascript
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}
setInterval(tick, 1000);
```

一般实际中只调用render一次，我们要把这样的逻辑封装进stateful组件。

### 组件和Props

组件把UI分割成独立可重用的片，独立看待每个片。概念上像javascript函数，接受输入`Props`,返回React元素。

+ 组件最简单的定义方法是用函数，这种方式叫函数组件，因为其本质是javascript函数。
+ ES6的方式定义
+ 组件大写开头
+ 函数有两种，一种是pure,不改变参数内容，另一种会改变。react组件必须pure，不能改变props也就是说props是只读的.当然，UI总是不停在变，此时就要引入state. 
+ state功能只有组件才有

```javascript
//demo for 1
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
//demo for 2

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
ReactDOM.render(
  (<Welcome name="Sara" />),
  document.getElementById('root')
);
```

### State和lifecycle

+ `setState({})`,不要直接设置`state.xxx=yyy`
+ 使用之前的值，用`this.setState((prevState, props) => ({counter: prevState.counter + props.increment}));`方式
+ jsx可以直接用state的值`<h2>It is {this.state.date.toLocaleTimeString()}.</h2>`
+ 在函数组件，`FormattedDate`不知道这个值从Clock的哪里来，手写的，还是state，还是props。这个特性称作单向数据流或者自顶向下数据流。state属于某个特定组件，任意从该state获取的数据或者UI触发只影响其下面的组件。
+ 如果把组件树看作props的瀑布，那么state就像另外一处水源，在任意点加入并跟着一起向下流。

```javascript
//demo for 4
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
<FormattedDate date={this.state.date} />

//whole sample
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

### 事件处理

+ 句法区别，1,事件名字驼峰命名，2，传入函数而不是字符串
+ 不能用`return false`来阻止默认行为，要明确调用`preventDefault`
+ 不用`addEventListener`来给DOM元素添加listener, 在元素初始渲染的时候提供listener.
+ 关于上一条中的this。javascript中类方法缺省情况下，是没有绑定的。如果不做绑定，调用的时候handleClick函数的`this`就会变成undefined. 可以使用`()=>{}`箭头函数
+ 给eventHandler传递参数。比如传入一个rowId，下面两种方式是一样的。
  + `<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>`
  + `<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>`

```javascript
// demo for 1
<button onclick="activateLasers()">
  Activate Lasers
</button>
<button onClick={activateLasers}>
  Activate Lasers
</button>

//demo for 2
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }
  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}

//demo for 3
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};
    // This binding is necessary to make `this` work in the callback, last this is button object in this case
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);

//demo for 4
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }
  render() {
    // 保证handleClick内的this有绑定
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}

class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }
  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

### 条件渲染

react中，可以有条件的渲染内容，创建不同的组件来封装行为。

比如有两个组件,可以用props来有条件的渲染。

```javascript
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}
function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}


function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}
ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

#### 元素变量

用变量来存储element,来做有条件的提交。

```javascript
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}
function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}

class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }
  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }
  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }
  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const button = isLoggedIn ? (
      <LogoutButton onClick={this.handleLogoutClick} />
    ) : (
      <LoginButton onClick={this.handleLoginClick} />
    );
    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}
ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

可以使用`{表达式}`的内置条件来条件渲染

```javascript
//使用&&
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}
const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
//使用if/else
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

#### 阻止渲染

尽管被其他组件渲染了，但希望隐藏起来，通过`return null`来做

```javascript
function WarningBanner(props) {
  // return props.warn?null:(<div className="warning">Warning!</div>);
  if (!props.warn) {
    return null;
  }
  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }
  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}
ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

## List和Key

和javascript基本一样

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
//react
function NumberList(props) {
  const numbers = props.numbers;
  //key is needed for creating list of elements.
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
//最好选择能够区分的key，如果传入的对象有id,用id，实在没有，用默认的
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
//不推荐使用默认的，可能影响性能，而且对state有影响引起问题。[参考](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

### 用key提取组件

如果要提取`ListItem`组件，key就要放在`<ListItem />`上，而不是`<li>`。

```javascript
function ListItem(props) {
  const value = props.value;
  return (
    // Wrong! There is no need to specify the key here:
    <li key={value.toString()}>
      {value}
    </li>
  );
}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Wrong! The key should have been specified here:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

## 表单

html的表单元素`input`,`textarea`,`select`有自己的状态，基于用户的输入来更新。
我们可以把其状态与react合并，由react来控制表单元素的状态。如果输入表单元素的值由react控制，就称之为`controlled element`.
因为`controlled element`比较繁琐，如要所有的数据变更都要写eventHandler传给state, 可以考虑用高级教程中的`uncontrolled element`.

```javascript
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

## 状态向上走

两个input的状态通过handler函数委托给props的函数向上走。由上面的组件执行更新state的任务，并把得到的结果通过props返回。

```javascript
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}
function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }
  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }
  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }
  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }
  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
```